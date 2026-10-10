"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export type LoginState = {
  error?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const ip = await getClientIp();
  const [ipOk, emailOk] = await Promise.all([
    rateLimit(`login:ip:${ip}`, 10, 15 * 60),
    rateLimit(`login:email:${email.toLowerCase()}`, 5, 15 * 60),
  ]);
  if (!ipOk || !emailOk) {
    return { error: "Too many attempts. Please try again in 15 minutes." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/admin");
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APPLY_ACCESS_COOKIE, APPLY_ACCESS_MAX_AGE } from "@/lib/apply-access";

export async function acceptApplyChecklist() {
  const cookieStore = await cookies();
  cookieStore.set(APPLY_ACCESS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: APPLY_ACCESS_MAX_AGE,
  });
  redirect("/apply");
}

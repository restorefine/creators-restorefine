"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { CreatorStatus } from "@/generated/prisma/client";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateCreatorStatus(id: string, status: CreatorStatus) {
  await prisma.creator.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/directory");
  revalidatePath(`/admin/${id}`);
}

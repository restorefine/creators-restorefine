"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { CreatorStatus } from "@/generated/prisma/client";
import { buildCsv } from "./(dashboard)/export-fields";

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

export async function rateCreator(id: string, rating: number) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  await prisma.creator.update({
    where: { id },
    data: { adminRating: clamped },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}

export async function exportCreatorsCsv(scope: "all" | "approved", fields: string[]) {
  const where = scope === "approved" ? { status: CreatorStatus.APPROVED } : {};
  const creators = await prisma.creator.findMany({ where, orderBy: { createdAt: "desc" } });
  return buildCsv(creators, fields);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, CREATOR_PHOTOS_BUCKET } from "@/lib/supabase/admin";
import { CreatorStatus } from "@/generated/prisma/client";
import { buildCsv } from "./(dashboard)/export-fields";

// Server actions are public POST endpoints, so each one must verify the
// session itself rather than relying on the /admin proxy redirect.
async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateCreatorStatus(id: string, status: CreatorStatus) {
  await requireAdmin();
  await prisma.creator.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/directory");
  revalidatePath(`/admin/${id}`);
}

export async function rateCreator(id: string, rating: number) {
  await requireAdmin();
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  await prisma.creator.update({
    where: { id },
    data: { adminRating: clamped },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}

export async function deleteCreator(id: string) {
  await requireAdmin();
  const creator = await prisma.creator.findUnique({
    where: { id },
    select: { frontFacePath: true, sideFacePath: true, lifestylePath: true },
  });
  if (!creator) redirect("/admin");

  const paths = [creator.frontFacePath, creator.sideFacePath, creator.lifestylePath].filter(
    (path): path is string => Boolean(path),
  );
  if (paths.length > 0) {
    const supabase = createAdminClient();
    await supabase.storage.from(CREATOR_PHOTOS_BUCKET).remove(paths);
  }

  await prisma.creator.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/directory");
  redirect("/admin/directory");
}

export async function exportCreatorsCsv(scope: "all" | "approved", fields: string[]) {
  await requireAdmin();
  const where = scope === "approved" ? { status: CreatorStatus.APPROVED } : {};
  const creators = await prisma.creator.findMany({ where, orderBy: { createdAt: "desc" } });
  return buildCsv(creators, fields);
}

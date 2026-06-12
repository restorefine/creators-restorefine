import { prisma } from "@/lib/prisma";
import { getSignedPhotoUrl } from "@/lib/supabase/admin";
import { CreatorStatus } from "@/generated/prisma/client";
import { CreatorTable } from "../creator-table";
import { Pagination } from "../pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function CreatorDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = { status: CreatorStatus.APPROVED };

  const [creators, total] = await Promise.all([
    prisma.creator.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.creator.count({ where }),
  ]);

  const rows = await Promise.all(
    creators.map(async (creator) => ({
      id: creator.id,
      firstName: creator.firstName,
      lastName: creator.lastName,
      expectedHourlyRate: creator.expectedHourlyRate,
      primaryNiche: creator.primaryNiche,
      city: creator.city,
      country: creator.country,
      status: creator.status,
      date: creator.updatedAt,
      thumbnailUrl: await getSignedPhotoUrl(creator.frontFacePath),
    })),
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Creator directory</h1>
        <span className="text-sm text-slate-500">{total} total</span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No approved creators yet. Approved applications will appear here.
        </div>
      ) : (
        <>
          <CreatorTable rows={rows} dateLabel="Approved" />
          <Pagination page={page} totalPages={totalPages} basePath="/admin/directory" />
        </>
      )}
    </div>
  );
}

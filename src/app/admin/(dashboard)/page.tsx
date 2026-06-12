import { prisma } from "@/lib/prisma";
import { getSignedPhotoUrl } from "@/lib/supabase/admin";
import { CreatorTable } from "./creator-table";
import { Pagination } from "./pagination";
import { ExportButton } from "./export-button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [creators, total] = await Promise.all([
    prisma.creator.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.creator.count(),
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
      date: creator.createdAt,
      thumbnailUrl: await getSignedPhotoUrl(creator.frontFacePath),
    })),
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Creator applications</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{total} total</span>
          <ExportButton scope="all" filename="creator-applications" />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No applications yet.
        </div>
      ) : (
        <>
          <CreatorTable rows={rows} dateLabel="Submitted" />
          <Pagination page={page} totalPages={totalPages} basePath="/admin" />
        </>
      )}
    </div>
  );
}

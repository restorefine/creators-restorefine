import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSignedPhotoUrl } from "@/lib/supabase/admin";
import { CreatorStatus } from "@/generated/prisma/client";
import { CreatorTable } from "./creator-table";
import { Pagination } from "./pagination";
import { ExportButton } from "./export-button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

const STATUS_TABS = [
  { value: CreatorStatus.PENDING, label: "Pending" },
  { value: CreatorStatus.APPROVED, label: "Approved" },
  { value: CreatorStatus.REJECTED, label: "Rejected" },
] as const;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page: pageParam, status: statusParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const status = STATUS_TABS.some((tab) => tab.value === statusParam)
    ? (statusParam as CreatorStatus)
    : CreatorStatus.PENDING;

  const where = { status };

  const [creators, total, statusCounts] = await Promise.all([
    prisma.creator.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.creator.count({ where }),
    prisma.creator.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countByStatus = Object.fromEntries(
    statusCounts.map((row) => [row.status, row._count._all]),
  ) as Partial<Record<CreatorStatus, number>>;

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
  const activeLabel = STATUS_TABS.find((tab) => tab.value === status)!.label;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Creator applications</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{total} total</span>
          <ExportButton scope="all" filename="creator-applications" />
        </div>
      </div>

      <div className="mb-4 flex w-fit gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin?status=${tab.value}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              status === tab.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label} ({countByStatus[tab.value] ?? 0})
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No {activeLabel.toLowerCase()} applications.
        </div>
      ) : (
        <>
          <CreatorTable rows={rows} dateLabel="Submitted" />
          <Pagination page={page} totalPages={totalPages} basePath="/admin" query={{ status }} />
        </>
      )}
    </div>
  );
}

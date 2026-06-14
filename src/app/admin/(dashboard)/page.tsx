import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSignedPhotoUrl } from "@/lib/supabase/admin";
import { CreatorStatus } from "@/generated/prisma/client";
import { CreatorTable } from "./creator-table";
import { Pagination } from "./pagination";
import { ExportButton } from "./export-button";
import { FilterBar, type SortOrder } from "./filter-bar";
import { NICHES } from "@/app/apply/options";

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
  searchParams: Promise<{ page?: string; status?: string; sort?: string; niche?: string; rating?: string }>;
}) {
  const { page: pageParam, status: statusParam, sort: sortParam, niche: nicheParam, rating: ratingParam } =
    await searchParams;

  const page = Math.max(1, Number(pageParam) || 1);
  const status = STATUS_TABS.some((tab) => tab.value === statusParam)
    ? (statusParam as CreatorStatus)
    : CreatorStatus.PENDING;

  const sort: SortOrder =
    sortParam === "asc" || sortParam === "desc" ? sortParam : "";

  const niche = NICHES.includes(nicheParam ?? "") ? (nicheParam ?? "") : "";

  // Rating filter: "5" means exactly 5; "1"-"4" means >= that value
  const ratingNum = Number(ratingParam);
  const validRating = ratingNum >= 1 && ratingNum <= 5 ? ratingNum : null;
  const rating = validRating !== null ? String(validRating) : "";

  const where = {
    status,
    ...(niche ? { primaryNiche: niche } : {}),
    ...(validRating !== null
      ? validRating === 5
        ? { adminRating: 5 }
        : { adminRating: { gte: validRating } }
      : {}),
  };

  const orderBy = sort
    ? [
        { expectedHourlyRate: sort as "asc" | "desc" },
        { createdAt: "desc" as const },
      ]
    : { createdAt: "desc" as const };

  const [creators, total, statusCounts] = await Promise.all([
    prisma.creator.findMany({
      where,
      orderBy,
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
      adminRating: creator.adminRating,
      date: creator.createdAt,
      thumbnailUrl: await getSignedPhotoUrl(creator.frontFacePath),
    })),
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeLabel = STATUS_TABS.find((tab) => tab.value === status)!.label;

  const paginationQuery: Record<string, string> = { status };
  if (sort) paginationQuery.sort = sort;
  if (niche) paginationQuery.niche = niche;
  if (rating) paginationQuery.rating = rating;

  const hasFilters = !!(niche || sort || rating);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Creator applications</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {total} {hasFilters ? "matching" : "total"}
          </span>
          <ExportButton scope="all" filename="creator-applications" />
        </div>
      </div>

      {/* Status tabs — preserve active filters when switching tabs */}
      <div className="mb-4 flex w-fit gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin?status=${tab.value}${sort ? `&sort=${sort}` : ""}${niche ? `&niche=${encodeURIComponent(niche)}` : ""}${rating ? `&rating=${rating}` : ""}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              status === tab.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label} ({countByStatus[tab.value] ?? 0})
          </Link>
        ))}
      </div>

      {/* Filter bar */}
      <FilterBar niche={niche} sort={sort} rating={rating} />

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No {activeLabel.toLowerCase()} applications
          {niche ? ` in the "${niche}" niche` : ""}
          {rating ? ` rated ${rating === "5" ? "exactly 5" : `${rating}+`} stars` : ""}.
        </div>
      ) : (
        <>
          <CreatorTable rows={rows} dateLabel="Submitted" />
          <Pagination page={page} totalPages={totalPages} basePath="/admin" query={paginationQuery} />
        </>
      )}
    </div>
  );
}

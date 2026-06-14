"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { NICHES } from "@/app/apply/options";

export type SortOrder = "asc" | "desc" | "";

const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "5", label: "★★★★★  5 stars" },
  { value: "4", label: "★★★★☆  4+ stars" },
  { value: "3", label: "★★★☆☆  3+ stars" },
  { value: "2", label: "★★☆☆☆  2+ stars" },
  { value: "1", label: "★☆☆☆☆  1+ star" },
];

export function FilterBar({
  niche,
  sort,
  rating,
}: {
  niche: string;
  sort: SortOrder;
  rating: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const toggleSort = () => {
    const next: SortOrder = sort === "asc" ? "desc" : sort === "desc" ? "" : "asc";
    update("sort", next);
  };

  const sortLabel =
    sort === "asc" ? "Rate ↑" : sort === "desc" ? "Rate ↓" : "Rate";

  const isRateActive = sort === "asc" || sort === "desc";
  const hasFilters = niche || isRateActive || rating;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Niche filter */}
      <div className="relative">
        <select
          id="niche-filter"
          value={niche}
          onChange={(e) => update("niche", e.target.value)}
          className={`appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand ${
            niche
              ? "border-brand bg-brand/5 text-brand"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
          }`}
        >
          <option value="">All niches</option>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Hourly rate sort toggle */}
      <button
        type="button"
        id="sort-rate-btn"
        onClick={toggleSort}
        title={
          sort === "asc"
            ? "Sort: lowest rate first — click for highest first"
            : sort === "desc"
              ? "Sort: highest rate first — click to clear"
              : "Sort by hourly rate"
        }
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
          isRateActive
            ? "border-brand bg-brand/5 text-brand"
            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2 3.75A.75.75 0 0 1 2.75 3h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75Zm0 4.167a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75Zm0 4.166a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        {sortLabel}
        {isRateActive && (
          <span className="ml-0.5 text-xs opacity-60">
            (click to {sort === "asc" ? "flip" : "clear"})
          </span>
        )}
      </button>

      {/* Rating filter */}
      <div className="relative">
        <select
          id="rating-filter"
          value={rating}
          onChange={(e) => update("rating", e.target.value)}
          className={`appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand ${
            rating
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
          }`}
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Clear all filters */}
      {hasFilters && (
        <button
          type="button"
          id="clear-filters-btn"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("niche");
            params.delete("sort");
            params.delete("rating");
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

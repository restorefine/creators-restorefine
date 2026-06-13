import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const hrefForPage = (targetPage: number) => {
    const params = new URLSearchParams(query);
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={hrefForPage(Math.max(1, page - 1))}
          aria-disabled={prevDisabled}
          tabIndex={prevDisabled ? -1 : undefined}
          className={`rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium transition ${
            prevDisabled
              ? "pointer-events-none text-slate-300"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          ← Previous
        </Link>
        <Link
          href={hrefForPage(Math.min(totalPages, page + 1))}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : undefined}
          className={`rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium transition ${
            nextDisabled
              ? "pointer-events-none text-slate-300"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          Next →
        </Link>
      </div>
    </div>
  );
}

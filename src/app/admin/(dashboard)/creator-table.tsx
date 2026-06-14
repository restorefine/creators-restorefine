import Link from "next/link";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export type CreatorRow = {
  id: string;
  firstName: string;
  lastName: string;
  expectedHourlyRate: number | null;
  primaryNiche: string;
  city: string;
  country: string;
  status: string;
  adminRating: number | null;
  date: Date;
  thumbnailUrl: string | null;
};

export function CreatorTable({ rows, dateLabel }: { rows: CreatorRow[]; dateLabel: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Photo</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Hourly Rate</th>
            <th className="px-4 py-3">Niche</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">{dateLabel}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((creator) => {
            const fullName = `${creator.firstName} ${creator.lastName}`;
            return (
              <tr key={creator.id} className="cursor-pointer transition hover:bg-slate-50">
                <td className="p-0">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {creator.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={creator.thumbnailUrl}
                        alt={fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                    )}
                  </Link>
                </td>
                <td className="p-0 font-medium text-slate-900">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {fullName}
                  </Link>
                </td>
                {/* Star rating (read-only in table) */}
                <td className="p-0">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {creator.adminRating ? (
                      <span className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={s <= creator.adminRating! ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className={`h-4 w-4 ${
                              s <= creator.adminRating! ? "text-amber-400" : "text-slate-200"
                            }`}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                        ))}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </Link>
                </td>
                <td className="p-0 text-slate-600">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {creator.expectedHourlyRate != null ? `£${creator.expectedHourlyRate}/hr` : "—"}
                  </Link>
                </td>
                <td className="p-0 text-slate-600">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {creator.primaryNiche}
                  </Link>
                </td>
                <td className="p-0 text-slate-600">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {creator.city}, {creator.country}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[creator.status]}`}
                    >
                      {creator.status}
                    </span>
                  </Link>
                </td>
                <td className="p-0 text-slate-500">
                  <Link href={`/admin/${creator.id}`} className="block px-4 py-3">
                    {creator.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

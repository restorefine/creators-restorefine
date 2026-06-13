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

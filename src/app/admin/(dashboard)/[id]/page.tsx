import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSignedPhotoUrl } from "@/lib/supabase/admin";
import { updateCreatorStatus } from "../../actions";
import { CreatorStatus } from "@/generated/prisma/client";
import { SOCIAL_PLATFORMS } from "@/app/apply/options";
import { PhotoGallery } from "./photo-lightbox";
import { StarRating } from "./star-rating";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${parseFloat((n / 1_000_000).toFixed(1))}M`;
  if (n >= 1_000) return `${parseFloat((n / 1_000).toFixed(1))}K`;
  return String(n);
}

type SocialPlatformData = { na: boolean; handle: string | null; followers: number | null };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border-t border-slate-100 pt-6 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-sm text-slate-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SocialTable({ socialPlatforms }: { socialPlatforms: Record<string, SocialPlatformData> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2">Platform</th>
            <th className="px-3 py-2">Handle</th>
            <th className="px-3 py-2">Followers</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {SOCIAL_PLATFORMS.map(({ key, label }) => {
            const data = socialPlatforms[key];
            return (
              <tr key={key}>
                <td className="px-3 py-2 font-medium text-slate-900">{label}</td>
                <td className="px-3 py-2 text-slate-600">
                  {data?.na ? <span className="text-slate-400">N/A</span> : data?.handle || "—"}
                </td>
                <td className="px-3 py-2 text-slate-600">
                  {data?.na
                    ? <span className="text-slate-400">N/A</span>
                    : data?.followers != null
                      ? formatFollowers(data.followers)
                      : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NavArrow({ href, direction, label }: { href: string; direction: "prev" | "next"; label: string }) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className="fixed top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand shadow-md transition hover:bg-brand-dark hover:shadow-lg active:scale-95 lg:flex"
      style={{ [direction === "prev" ? "left" : "right"]: "clamp(8px, 2vw, 48px)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white" aria-hidden="true">
        {direction === "prev" ? (
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        )}
      </svg>
    </Link>
  );
}

export default async function CreatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [creator, allCreators] = await Promise.all([
    prisma.creator.findUnique({ where: { id } }),
    prisma.creator.findMany({ select: { id: true }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!creator) notFound();

  const currentIndex = allCreators.findIndex((c) => c.id === id);
  const prevId = currentIndex > 0 ? allCreators[currentIndex - 1].id : null;
  const nextId = currentIndex < allCreators.length - 1 ? allCreators[currentIndex + 1].id : null;

  const [frontFaceUrl, sideFaceUrl, lifestyleUrl] = await Promise.all([
    getSignedPhotoUrl(creator.frontFacePath),
    getSignedPhotoUrl(creator.sideFacePath),
    getSignedPhotoUrl(creator.lifestylePath),
  ]);

  const fullName = `${creator.firstName} ${creator.lastName}`;
  const socialPlatforms = (creator.socialPlatforms ?? {}) as Record<string, SocialPlatformData>;
  const photos = [
    { label: "Front headshot", url: frontFaceUrl },
    { label: "Side profile", url: sideFaceUrl },
    { label: "Lifestyle / content", url: lifestyleUrl },
  ];
  const submittedAt = creator.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(creator.email)}`;

  // Desktop sidebar action buttons
  const desktopActionButtons = (
    <>
      <a
        href={gmailHref}
        target="_blank"
        rel="noreferrer"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Email creator
      </a>
      <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.APPROVED)}>
        <button
          type="submit"
          disabled={creator.status === CreatorStatus.APPROVED}
          className="w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve
        </button>
      </form>
      <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.REJECTED)}>
        <button
          type="submit"
          disabled={creator.status === CreatorStatus.REJECTED}
          className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>
      </form>
      {creator.status !== CreatorStatus.PENDING && (
        <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.PENDING)}>
          <button
            type="submit"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reset to pending
          </button>
        </form>
      )}
      <DeleteButton
        creatorId={creator.id}
        fullName={fullName}
        className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      />
    </>
  );

  const dataSections = (
    <>
      <Section title="About">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" value={creator.email} />
          <Field label="Phone" value={creator.phone} />
          <Field label="City" value={creator.city} />
          <Field label="Country" value={creator.country} />
          <Field label="Age range" value={creator.ageRange} />
          <Field label="Gender identity" value={creator.genderIdentity} />
          <Field label="Languages spoken" value={creator.languages} />
        </dl>
      </Section>

      <Section title="Social platforms">
        <SocialTable socialPlatforms={socialPlatforms} />
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Website / blog"
            value={
              creator.website ? (
                <a href={creator.website} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  {creator.website}
                </a>
              ) : null
            }
          />
        </dl>
      </Section>

      <Section title="Content & niche">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Primary niche"
            value={
              creator.primaryNiche === "Other" && creator.primaryNicheOther
                ? `Other — ${creator.primaryNicheOther}`
                : creator.primaryNiche
            }
          />
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Secondary niches</dt>
            <dd className="mt-1"><ChipList items={creator.secondaryNiches} /></dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content style</dt>
            <dd className="mt-1">
              <ChipList items={creator.contentStylesOther ? [...creator.contentStyles.filter((s) => s !== "Other"), `Other — ${creator.contentStylesOther}`] : creator.contentStyles} />
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content format strengths</dt>
            <dd className="mt-1">
              <ChipList items={creator.contentFormatsOther ? [...creator.contentFormats.filter((s) => s !== "Other"), `Other — ${creator.contentFormatsOther}`] : creator.contentFormats} />
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content example links</dt>
            <dd className="mt-1 space-y-1">
              {creator.contentLinks.map((link) => (
                <a key={link} href={link} target="_blank" rel="noreferrer" className="block text-sm text-brand hover:underline">{link}</a>
              ))}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Audience">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary age group" value={creator.audienceAgeGroup} />
          <Field label="Gender split" value={creator.audienceGenderSplit} />
          <Field label="Top countries" value={creator.audienceTopCountries} />
          <Field label="Top UK cities" value={creator.audienceTopCities} />
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audience interests</dt>
            <dd className="mt-1">
              <ChipList items={creator.audienceInterestsOther ? [...creator.audienceInterests.filter((s) => s !== "Other"), `Other — ${creator.audienceInterestsOther}`] : creator.audienceInterests} />
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Experience & availability">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Previous brand collaborations</dt>
            <dd className="mt-1"><ChipList items={creator.previousBrands} /></dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Campaign types done</dt>
            <dd className="mt-1"><ChipList items={creator.campaignTypes} /></dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available for</dt>
            <dd className="mt-1"><ChipList items={creator.availability} /></dd>
          </div>
          <Field label="Expected hourly rate" value={creator.expectedHourlyRate != null ? `£${creator.expectedHourlyRate}/hr` : null} />
          <Field label="Brands/industries excluded" value={creator.brandsExcluded} />
          <Field label="Current brand exclusivity" value={creator.brandExclusivity} />
          <Field label="Represented by agent" value={creator.hasAgent ? "Yes" : "No"} />
          {creator.hasAgent && (
            <>
              <Field label="Agent name" value={creator.agentName} />
              <Field label="Agent contact" value={creator.agentContact} />
            </>
          )}
        </dl>
      </Section>

      <Section title="Final details">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</dt>
            <dd className="mt-1 text-sm text-slate-900">{creator.bio}</dd>
          </div>
          <Field
            label="Portfolio / media kit"
            value={
              creator.portfolioLink ? (
                <a href={creator.portfolioLink} target="_blank" rel="noreferrer" className="text-brand hover:underline">{creator.portfolioLink}</a>
              ) : null
            }
          />
          <Field label="VAT registered" value={creator.vatStatus} />
          <Field label="Invoicing as" value={creator.invoicingAs} />
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Anything else</dt>
            <dd className="mt-1 text-sm text-slate-900">{creator.additionalInfo || "—"}</dd>
          </div>
        </dl>
      </Section>
    </>
  );

  return (
    <div>
      {/* Fixed nav arrows — desktop only */}
      {prevId && <NavArrow href={`/admin/${prevId}`} direction="prev" label="Previous applicant" />}
      {nextId && <NavArrow href={`/admin/${nextId}`} direction="next" label="Next applicant" />}

      <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Back to applications
      </Link>

      {/* ── MOBILE: floating action bar ── */}
      <div className="fixed bottom-6 inset-x-0 z-20 flex items-center justify-center lg:hidden">
        <div className="flex items-center gap-3 rounded-full bg-white/70 px-4 py-3 shadow-xl backdrop-blur-md ring-1 ring-black/5">
        <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.REJECTED)}>
          <button
            type="submit"
            disabled={creator.status === CreatorStatus.REJECTED}
            className="rounded-full bg-red-600 px-7 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-red-700 active:scale-95 disabled:opacity-40"
          >
            Reject
          </button>
        </form>
        <a
          href={gmailHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Email creator"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-slate-600" aria-hidden="true">
            <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
            <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
          </svg>
        </a>
        <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.APPROVED)}>
          <button
            type="submit"
            disabled={creator.status === CreatorStatus.APPROVED}
            className="rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-green-700 active:scale-95 disabled:opacity-40"
          >
            Approve
          </button>
        </form>
        </div>
      </div>

      {/* ── MOBILE: original single-card layout ── */}
      <div className="mt-4 lg:hidden">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 pb-28 shadow-sm sm:p-8 sm:pb-28">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
              <p className="mt-1 text-sm text-slate-500">Submitted {submittedAt}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyles[creator.status]}`}>
              {creator.status}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Admin rating</p>
            <StarRating creatorId={creator.id} initialRating={creator.adminRating} />
          </div>

          <Section title="Photos">
            <PhotoGallery fullName={fullName} photos={photos} layout="horizontal" />
          </Section>

          {dataSections}

          {creator.status !== CreatorStatus.PENDING && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.PENDING)}>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Reset to pending
                </button>
              </form>
            </div>
          )}

          <div className="mt-4 border-t border-slate-100 pt-4">
            <DeleteButton
              creatorId={creator.id}
              fullName={fullName}
              className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP: two-column sticky layout ── */}
      <div className="mt-4 hidden gap-6 lg:flex lg:items-start">

        {/* Left sticky panel */}
        <div className="sticky top-4 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-96 lg:flex-shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight text-slate-900">{fullName}</h1>
              <p className="mt-0.5 text-xs text-slate-500">Submitted {submittedAt}</p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[creator.status]}`}>
              {creator.status}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">Admin rating</p>
            <StarRating creatorId={creator.id} initialRating={creator.adminRating} />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Photos</p>
            <PhotoGallery fullName={fullName} layout="sidebar" photos={photos} />
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {desktopActionButtons}
          </div>
        </div>

        {/* Right scrollable panel */}
        <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {dataSections}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSignedPhotoUrl } from "@/lib/supabase/admin";
import { updateCreatorStatus } from "../../actions";
import { CreatorStatus } from "@/generated/prisma/client";
import { SOCIAL_PLATFORMS } from "@/app/apply/options";
import { PhotoGallery } from "./photo-lightbox";
import { StarRating } from "./star-rating";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

type SocialPlatformData = { na: boolean; handle: string | null; followers: number | null };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border-t border-slate-100 pt-6 first:mt-6 first:border-t-0 first:pt-0">
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

export default async function CreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = await prisma.creator.findUnique({ where: { id } });

  if (!creator) {
    notFound();
  }

  const [frontFaceUrl, sideFaceUrl, lifestyleUrl] = await Promise.all([
    getSignedPhotoUrl(creator.frontFacePath),
    getSignedPhotoUrl(creator.sideFacePath),
    getSignedPhotoUrl(creator.lifestylePath),
  ]);

  const fullName = `${creator.firstName} ${creator.lastName}`;
  const socialPlatforms = (creator.socialPlatforms ?? {}) as Record<string, SocialPlatformData>;

  return (
    <div>
      <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Back to applications
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Submitted{" "}
              {creator.createdAt.toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyles[creator.status]}`}
          >
            {creator.status}
          </span>
        </div>

        {/* Admin rating */}
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Admin rating</p>
          <StarRating creatorId={creator.id} initialRating={creator.adminRating} />
        </div>

        <Section title="Photos">
          <PhotoGallery
            fullName={fullName}
            photos={[
              { label: "Front headshot", url: frontFaceUrl },
              { label: "Side profile", url: sideFaceUrl },
              { label: "Lifestyle / content", url: lifestyleUrl },
            ]}
          />
        </Section>

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
                            ? data.followers.toLocaleString("en-GB")
                            : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Secondary niches
              </dt>
              <dd className="mt-1">
                <ChipList items={creator.secondaryNiches} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Content style
              </dt>
              <dd className="mt-1">
                <ChipList
                  items={
                    creator.contentStylesOther
                      ? [...creator.contentStyles.filter((s) => s !== "Other"), `Other — ${creator.contentStylesOther}`]
                      : creator.contentStyles
                  }
                />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Content format strengths
              </dt>
              <dd className="mt-1">
                <ChipList
                  items={
                    creator.contentFormatsOther
                      ? [...creator.contentFormats.filter((s) => s !== "Other"), `Other — ${creator.contentFormatsOther}`]
                      : creator.contentFormats
                  }
                />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Content example links
              </dt>
              <dd className="mt-1 space-y-1">
                {creator.contentLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-brand hover:underline"
                  >
                    {link}
                  </a>
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
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Audience interests
              </dt>
              <dd className="mt-1">
                <ChipList
                  items={
                    creator.audienceInterestsOther
                      ? [
                          ...creator.audienceInterests.filter((s) => s !== "Other"),
                          `Other — ${creator.audienceInterestsOther}`,
                        ]
                      : creator.audienceInterests
                  }
                />
              </dd>
            </div>
          </dl>
        </Section>

        <Section title="Experience & availability">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Previous brand collaborations
              </dt>
              <dd className="mt-1">
                <ChipList items={creator.previousBrands} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Campaign types done
              </dt>
              <dd className="mt-1">
                <ChipList items={creator.campaignTypes} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Available for
              </dt>
              <dd className="mt-1">
                <ChipList items={creator.availability} />
              </dd>
            </div>
            <Field
              label="Expected hourly rate"
              value={creator.expectedHourlyRate != null ? `£${creator.expectedHourlyRate}/hr` : null}
            />
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
                  <a href={creator.portfolioLink} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                    {creator.portfolioLink}
                  </a>
                ) : null
              }
            />
            <Field label="VAT registered" value={creator.vatStatus} />
            <Field label="Invoicing as" value={creator.invoicingAs} />
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Anything else
              </dt>
              <dd className="mt-1 text-sm text-slate-900">{creator.additionalInfo || "—"}</dd>
            </div>
          </dl>
        </Section>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(creator.email)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Email this creator
          </a>
          <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.APPROVED)}>
            <button
              type="submit"
              disabled={creator.status === CreatorStatus.APPROVED}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Approve
            </button>
          </form>
          <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.REJECTED)}>
            <button
              type="submit"
              disabled={creator.status === CreatorStatus.REJECTED}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </form>
          {creator.status !== CreatorStatus.PENDING && (
            <form action={updateCreatorStatus.bind(null, creator.id, CreatorStatus.PENDING)}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset to pending
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

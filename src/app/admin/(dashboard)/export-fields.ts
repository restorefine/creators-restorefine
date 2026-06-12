import type { Creator } from "@/generated/prisma/client";

type SocialPlatformData = { na: boolean; handle: string | null; followers: number | null };

function formatList(items: string[]) {
  return items.join("; ");
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatSocialPlatforms(value: unknown) {
  const data = (value ?? {}) as Record<string, SocialPlatformData>;
  return Object.entries(data)
    .filter(([, platform]) => platform && !platform.na && (platform.handle || platform.followers != null))
    .map(([key, platform]) => {
      const followers = platform.followers != null ? ` (${platform.followers.toLocaleString("en-GB")})` : "";
      return `${key}: ${platform.handle ?? ""}${followers}`;
    })
    .join("; ");
}

export type ExportField = {
  key: string;
  label: string;
  getValue: (creator: Creator) => string;
};

export const EXPORT_FIELDS: ExportField[] = [
  { key: "firstName", label: "First name", getValue: (c) => c.firstName },
  { key: "lastName", label: "Last name", getValue: (c) => c.lastName },
  { key: "email", label: "Email", getValue: (c) => c.email },
  { key: "phone", label: "Phone", getValue: (c) => c.phone },
  { key: "city", label: "City", getValue: (c) => c.city },
  { key: "country", label: "Country", getValue: (c) => c.country },
  { key: "dateOfBirth", label: "Date of birth", getValue: (c) => formatDate(c.dateOfBirth) },
  { key: "genderIdentity", label: "Gender identity", getValue: (c) => c.genderIdentity ?? "" },
  { key: "languages", label: "Languages spoken", getValue: (c) => c.languages ?? "" },
  { key: "socialPlatforms", label: "Social platforms", getValue: (c) => formatSocialPlatforms(c.socialPlatforms) },
  { key: "website", label: "Website / blog", getValue: (c) => c.website ?? "" },
  {
    key: "primaryNiche",
    label: "Primary niche",
    getValue: (c) => (c.primaryNiche === "Other" && c.primaryNicheOther ? `Other - ${c.primaryNicheOther}` : c.primaryNiche),
  },
  { key: "secondaryNiches", label: "Secondary niches", getValue: (c) => formatList(c.secondaryNiches) },
  { key: "contentLinks", label: "Content links", getValue: (c) => formatList(c.contentLinks) },
  { key: "audienceAgeGroup", label: "Audience age group", getValue: (c) => c.audienceAgeGroup },
  { key: "audienceGenderSplit", label: "Audience gender split", getValue: (c) => c.audienceGenderSplit },
  { key: "audienceTopCountries", label: "Audience top countries", getValue: (c) => c.audienceTopCountries },
  { key: "expectedHourlyRate", label: "Expected hourly rate (£)", getValue: (c) => (c.expectedHourlyRate != null ? String(c.expectedHourlyRate) : "") },
  { key: "hasAgent", label: "Has agent/manager", getValue: (c) => (c.hasAgent == null ? "" : c.hasAgent ? "Yes" : "No") },
  { key: "agentName", label: "Agent/manager name", getValue: (c) => c.agentName ?? "" },
  { key: "agentContact", label: "Agent/manager contact", getValue: (c) => c.agentContact ?? "" },
  { key: "bio", label: "Bio", getValue: (c) => c.bio },
  { key: "portfolioLink", label: "Portfolio / media kit link", getValue: (c) => c.portfolioLink ?? "" },
  { key: "vatStatus", label: "VAT registered", getValue: (c) => c.vatStatus },
  { key: "invoicingAs", label: "Invoicing as", getValue: (c) => c.invoicingAs },
  { key: "status", label: "Status", getValue: (c) => c.status },
  { key: "createdAt", label: "Submitted", getValue: (c) => formatDate(c.createdAt) },
  { key: "updatedAt", label: "Last updated", getValue: (c) => formatDate(c.updatedAt) },
];

export const DEFAULT_EXPORT_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "expectedHourlyRate",
  "primaryNiche",
  "city",
  "country",
  "status",
];

function csvEscape(value: string): string {
  // Prefix values that spreadsheet apps could interpret as formulas.
  if (/^[=+\-@\t\r]/.test(value)) {
    value = `'${value}`;
  }
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv(creators: Creator[], fieldKeys: string[]): string {
  const fields = EXPORT_FIELDS.filter((field) => fieldKeys.includes(field.key));
  const header = fields.map((field) => csvEscape(field.label)).join(",");
  const rows = creators.map((creator) =>
    fields.map((field) => csvEscape(field.getValue(creator))).join(","),
  );
  return [header, ...rows].join("\r\n");
}

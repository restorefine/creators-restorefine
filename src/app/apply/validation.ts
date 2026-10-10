// Field rules shared by the browser (per step) and the server action (all
// fields), so both always agree. Photos are checked separately.

import {
  AGE_RANGES,
  AUDIENCE_AGE_GROUPS,
  AUDIENCE_GENDER_SPLITS,
  COUNTRIES,
  GENDER_IDENTITIES,
  HOURLY_RATE_RANGES,
  INVOICING_OPTIONS,
  SOCIAL_PLATFORMS,
  VAT_OPTIONS,
} from "./options";

type Get = (name: string) => string;
type Rule = (value: string, get: Get) => string | undefined;
type Check = (value: string) => string | undefined;

const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_DISALLOWED_RE = /[^\d+\s()-]/g;

function isValidUrl(value: string) {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function isValidPhone(value: string) {
  if (!/^[\d+\s()-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 10 && digits <= 15;
}

/** Adds https:// to links typed without it. */
export function normaliseUrl(value: string | null) {
  if (!value) return value;
  return value.includes("://") ? value : `https://${value}`;
}

const required =
  (message: string, rule?: Rule): Rule =>
  (value, get) =>
    !value ? message : rule?.(value, get);

const optional =
  (rule: Rule): Rule =>
  (value, get) =>
    value ? rule(value, get) : undefined;

const maxLength =
  (max: number): Check =>
  (value) =>
    value.length > max ? `Please keep this under ${max} characters.` : undefined;

const oneOf =
  (options: readonly string[]): Check =>
  (value) =>
    options.includes(value) ? undefined : "Please choose one of the options.";

const name: Check = (value) =>
  !NAME_RE.test(value) ? "Use letters only." : value.length > 50 ? "Please keep this under 50 characters." : undefined;

const url: Check = (value) =>
  !isValidUrl(value) ? "Enter a valid link, e.g. example.com/you" : maxLength(300)(value);

const socialHandleRules = Object.fromEntries(
  SOCIAL_PLATFORMS.map(({ key }) => [
    `social_${key}_handle`,
    optional((value, get) => (get(`social_${key}_na`) ? undefined : maxLength(100)(value))),
  ]),
) as Record<string, Rule>;

const RULES: Record<string, Rule> = {
  // Step 1 - About you & socials
  firstName: required("First name is required.", name),
  lastName: required("Last name is required.", name),
  email: required("Email is required.", (v) =>
    !EMAIL_RE.test(v) || v.length > 254 ? "Enter a valid email address." : undefined,
  ),
  confirmEmail: required("Please confirm your email.", (v, get) =>
    v.toLowerCase() !== get("email").toLowerCase() ? "Emails do not match." : undefined,
  ),
  phone: required("Phone number is required.", (v) =>
    isValidPhone(v) ? undefined : "Enter a valid phone number, e.g. +44 7700 900123.",
  ),
  city: required("City is required.", (v) =>
    !NAME_RE.test(v) ? "Use letters only." : maxLength(60)(v),
  ),
  country: required("Please select a country.", oneOf(COUNTRIES)),
  ageRange: required("Please select your age range.", oneOf(AGE_RANGES)),
  genderIdentity: optional(oneOf(GENDER_IDENTITIES)),
  languages: optional((v) =>
    /^[\p{L}\s,/&-]+$/u.test(v) ? maxLength(100)(v) : "Use letters and commas only, e.g. English, Spanish.",
  ),
  ...socialHandleRules,
  website: optional(url),

  // Step 2 - Content & audience
  primaryNiche: required("Please select your primary niche.", (_v, get) =>
    get("primaryNiche") === "Other" && !get("primaryNicheOther") ? "Please describe your niche." : undefined,
  ),
  primaryNicheOther: optional(maxLength(100)),
  contentStylesOther: optional(maxLength(100)),
  contentFormatsOther: optional(maxLength(100)),
  contentLink1: optional(url),
  contentLink2: optional(url),
  contentLink3: optional(url),
  audienceAgeGroup: optional(oneOf(AUDIENCE_AGE_GROUPS)),
  audienceGenderSplit: optional(oneOf(AUDIENCE_GENDER_SPLITS)),
  audienceTopCountries: optional(maxLength(100)),
  audienceTopCities: optional(maxLength(100)),
  audienceInterestsOther: optional(maxLength(100)),

  // Step 3 - Experience & final details
  brandsExcluded: optional(maxLength(200)),
  brandExclusivity: optional(maxLength(200)),
  expectedHourlyRate: required(
    "Please choose your expected hourly rate.",
    oneOf(HOURLY_RATE_RANGES.map((range) => range.label)),
  ),
  hasAgent: required("Please select an option.", oneOf(["Yes", "No"])),
  agentName: (v, get) =>
    get("hasAgent") !== "Yes" ? undefined : !v ? "Agent name is required." : maxLength(100)(v),
  agentContact: (v, get) =>
    get("hasAgent") !== "Yes"
      ? undefined
      : !v
        ? "Agent contact is required."
        : EMAIL_RE.test(v) || isValidPhone(v)
          ? undefined
          : "Enter an email address or phone number.",
  bio: required("Please add a short bio.", (v) =>
    v.length < 20 ? "Please write at least 20 characters." : maxLength(300)(v),
  ),
  portfolioLink: optional(url),
  vatStatus: required("Please select an option.", oneOf(VAT_OPTIONS)),
  invoicingAs: required("Please select an option.", oneOf(INVOICING_OPTIONS)),
  additionalInfo: optional(maxLength(1000)),
};

const STEP_FIELDS: Record<number, string[]> = {
  1: [
    "firstName",
    "lastName",
    "email",
    "confirmEmail",
    "phone",
    "city",
    "country",
    "ageRange",
    "genderIdentity",
    "languages",
    ...Object.keys(socialHandleRules),
    "website",
  ],
  2: [
    "primaryNiche",
    "primaryNicheOther",
    "contentStylesOther",
    "contentFormatsOther",
    "contentLink1",
    "contentLink2",
    "contentLink3",
    "audienceAgeGroup",
    "audienceGenderSplit",
    "audienceTopCountries",
    "audienceTopCities",
    "audienceInterestsOther",
  ],
  3: [
    "brandsExcluded",
    "brandExclusivity",
    "expectedHourlyRate",
    "hasAgent",
    "agentName",
    "agentContact",
    "bio",
    "portfolioLink",
    "vatStatus",
    "invoicingAs",
    "additionalInfo",
  ],
};

/** Step number (1-3) a field lives on; photos and terms are step 4. */
export function stepForField(field: string) {
  for (const [step, fields] of Object.entries(STEP_FIELDS)) {
    if (fields.includes(field)) return Number(step);
  }
  return 4;
}

function run(fields: string[], formData: FormData) {
  const get: Get = (field) => ((formData.get(field) as string | null) ?? "").trim();
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const message = RULES[field](get(field), get);
    if (message) errors[field] = message;
  }
  return errors;
}

export function validateFieldsForStep(step: number, formData: FormData) {
  return run(STEP_FIELDS[step] ?? [], formData);
}

export function validateAllFields(formData: FormData) {
  return run(Object.keys(RULES), formData);
}

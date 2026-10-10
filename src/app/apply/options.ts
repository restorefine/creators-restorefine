export const COUNTRIES = ["England", "Scotland", "Wales", "Northern Ireland", "Other"];

export const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export const GENDER_IDENTITIES = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
  "Other",
];

export const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "x", label: "X (Twitter)" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "podcast", label: "Podcast" },
] as const;

export const NICHES = [
  "Fashion",
  "Beauty",
  "Fitness",
  "Food & drink",
  "Travel",
  "Tech",
  "Gaming",
  "Finance",
  "Parenting",
  "Lifestyle",
  "Sports",
  "Business",
  "Other",
];

export const SECONDARY_NICHES = NICHES.filter((niche) => niche !== "Other");

export const CONTENT_STYLES = [
  "Educational",
  "Entertaining",
  "Aspirational",
  "Comedic",
  "Documentary",
  "Authentic/raw",
  "Aesthetic/visual",
  "Review/opinion",
  "Other",
];

export const CONTENT_FORMATS = [
  "Short-form video",
  "Long-form video",
  "Photography",
  "Written/blog",
  "Live streaming",
  "Podcasting",
  "Stories/ephemeral",
  "Other",
];

export const AUDIENCE_AGE_GROUPS = ["13–17", "18–24", "25–34", "35–44", "45+", "Mixed"];

export const AUDIENCE_GENDER_SPLITS = [
  "Mostly female",
  "Mostly male",
  "Balanced / mixed",
  "Prefer not to say",
];

export const AUDIENCE_INTERESTS = [
  "Health & wellness",
  "Luxury & premium",
  "Budget-conscious",
  "Family & home",
  "Career & ambition",
  "Entertainment",
  "Sustainability",
  "Music & culture",
  "Other",
];

export const CAMPAIGN_TYPES = [
  "Gifted/product seeding",
  "Paid social post",
  "Brand ambassador",
  "Event/experience",
  "Presenter/on-camera",
  "None yet",
];

export const AVAILABILITY_OPTIONS = [
  "Local tastings/events",
  "UK travel",
  "International travel",
  "On-camera/presenting",
  "Overnight stays",
  "Exclusivity deals",
];

export const VAT_OPTIONS = ["Yes", "No", "Not sure"];

// Stored as the range's lower bound in expectedHourlyRate so admin can sort.
export const HOURLY_RATE_RANGES = [
  { label: "Under £15", min: 0 },
  { label: "£15–25", min: 15 },
  { label: "£25–40", min: 25 },
  { label: "£40–60", min: 40 },
  { label: "£60–100", min: 60 },
  { label: "£100+", min: 100 },
] as const;

/** Range label for new applications; older typed amounts show as £x/hr. */
export function formatHourlyRate(rate: number | null) {
  if (rate == null) return null;
  return HOURLY_RATE_RANGES.find((range) => range.min === rate)?.label ?? `£${rate}/hr`;
}

export const INVOICING_OPTIONS = ["Sole trader", "Limited company", "Neither yet"];

type StepMeta = {
  step: number;
  label: string;
  title: string;
  highlight: string;
  description: string;
  note?: string;
};

export const STEP_META: StepMeta[] = [
  {
    step: 1,
    label: "About you",
    title: "Tell us about yourself",
    highlight: "yourself",
    description: "Your contact details and where brands can find you online.",
  },
  {
    step: 2,
    label: "Your content",
    title: "What kind of content do you create?",
    highlight: "content",
    description: "Help us match you with brands that fit your style, niche and audience.",
  },
  {
    step: 3,
    label: "Experience",
    title: "Experience & final details",
    highlight: "final details",
    description: "What you've done before, what you're open to, and how you invoice.",
  },
  {
    step: 4,
    label: "Your photos",
    title: "One last thing: your photos",
    highlight: "photos",
    description: "Almost done! Upload a front headshot and side profile. A lifestyle shot is optional but helps brands get a feel for your style.",
    note: "Use a plain or neutral background for headshots. Good natural lighting works best. Your lifestyle shot should reflect your usual content style.",
  },
];

// Sub-sections shown inside the merged steps above.
export const SECTION_META = {
  social: {
    title: "Social platforms",
    description:
      "Add your handles. We'll fetch Instagram and TikTok follower counts automatically; enter the rest yourself. If you don't use a platform, tick N/A.",
  },
  audience: {
    title: "Your audience",
    description: "All optional, but it helps brands understand who's watching.",
  },
  finalDetails: {
    title: "Final details",
    description: "Your bio, VAT status and invoicing details.",
  },
};

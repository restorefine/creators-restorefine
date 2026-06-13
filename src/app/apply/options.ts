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
    description: "We use these details to verify your application and stay in touch.",
  },
  {
    step: 2,
    label: "Social platforms",
    title: "Where can brands find you?",
    highlight: "brands",
    description:
      "Add your handles and follower counts. If you don't use a platform, tick N/A.",
  },
  {
    step: 3,
    label: "Content & niche",
    title: "What kind of content do you create?",
    highlight: "content",
    description: "Help us match you with brands that fit your style and niche.",
  },
  {
    step: 4,
    label: "Your audience",
    title: "Tell us about your audience",
    highlight: "audience",
    description: "Brands want to know who's watching, reading or listening.",
  },
  {
    step: 5,
    label: "Experience",
    title: "Experience & availability",
    highlight: "availability",
    description: "Let us know what you've done before and what you're open to.",
  },
  {
    step: 6,
    label: "Final details",
    title: "Just a few final details",
    highlight: "final details",
    description: "Almost done — wrap up your profile and submit your application.",
  },
  {
    step: 7,
    label: "Your photos",
    title: "Let's start with your photos",
    highlight: "photos",
    description:
      "Brand clients want to see your look and your content style. Upload three images below. These form the first impression of your profile.",
    note: "Use a plain or neutral background for headshots. Good natural lighting works best. Your lifestyle shot should reflect your usual content style.",
  },
];

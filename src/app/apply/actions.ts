"use server";

import { prisma } from "@/lib/prisma";
import { createAdminClient, CREATOR_PHOTOS_BUCKET } from "@/lib/supabase/admin";
import { resend, EMAIL_FROM, TALENT_EMAIL } from "@/lib/email/resend";
import { newApplicationEmail } from "@/lib/email/new-application";
import { SOCIAL_PLATFORMS } from "./options";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function validateImage(file: File | null, fieldName: string, errors: Record<string, string>) {
  if (!file || file.size === 0) {
    errors[fieldName] = "This photo is required.";
    return;
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    errors[fieldName] = "Please upload a JPG or PNG image.";
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    errors[fieldName] = "Image must be smaller than 5MB.";
  }
}

function str(formData: FormData, name: string) {
  return ((formData.get(name) as string) ?? "").trim();
}

function optionalStr(formData: FormData, name: string) {
  const value = str(formData, name);
  return value || null;
}

export async function submitApplication(
  _prevState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const fieldErrors: Record<string, string> = {};

  // Step 1 - Photos
  const frontFace = formData.get("frontFace") as File | null;
  const sideFace = formData.get("sideFace") as File | null;
  const lifestyle = formData.get("lifestyle") as File | null;
  validateImage(frontFace, "frontFace", fieldErrors);
  validateImage(sideFace, "sideFace", fieldErrors);
  validateImage(lifestyle, "lifestyle", fieldErrors);

  // Step 2 - About you
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const email = str(formData, "email");
  const confirmEmail = str(formData, "confirmEmail");
  const phone = str(formData, "phone");
  const city = str(formData, "city");
  const country = str(formData, "country");
  const ageRange = str(formData, "ageRange");
  const genderIdentity = optionalStr(formData, "genderIdentity");
  const languages = optionalStr(formData, "languages");

  if (!firstName) fieldErrors.firstName = "First name is required.";
  if (!lastName) fieldErrors.lastName = "Last name is required.";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!confirmEmail) {
    fieldErrors.confirmEmail = "Please confirm your email.";
  } else if (confirmEmail !== email) {
    fieldErrors.confirmEmail = "Emails do not match.";
  }
  if (!phone) fieldErrors.phone = "Phone number is required.";
  if (!city) fieldErrors.city = "City is required.";
  if (!country) fieldErrors.country = "Please select a country.";

  if (!ageRange) fieldErrors.ageRange = "Please select your age range.";

  // Step 3 - Social platforms
  const socialPlatforms: Record<string, { na: boolean; handle: string | null; followers: number | null }> = {};
  for (const { key } of SOCIAL_PLATFORMS) {
    const na = formData.get(`social_${key}_na`) === "on";
    const handle = optionalStr(formData, `social_${key}_handle`);
    const followersRaw = str(formData, `social_${key}_followers`);
    const followers = followersRaw ? Number(followersRaw) : null;
    socialPlatforms[key] = {
      na,
      handle: na ? null : handle,
      followers: na ? null : (followers !== null && !Number.isNaN(followers) ? followers : null),
    };
  }
  const website = optionalStr(formData, "website");

  // Step 4 - Content & niche
  const primaryNiche = str(formData, "primaryNiche");
  const primaryNicheOther = optionalStr(formData, "primaryNicheOther");
  const secondaryNiches = formData.getAll("secondaryNiches") as string[];
  const contentStyles = formData.getAll("contentStyles") as string[];
  const contentStylesOther = optionalStr(formData, "contentStylesOther");
  const contentFormats = formData.getAll("contentFormats") as string[];
  const contentFormatsOther = optionalStr(formData, "contentFormatsOther");
  const contentLinks = [
    str(formData, "contentLink1"),
    str(formData, "contentLink2"),
    str(formData, "contentLink3"),
  ].filter(Boolean);

  if (!primaryNiche) {
    fieldErrors.primaryNiche = "Please select your primary niche.";
  } else if (primaryNiche === "Other" && !primaryNicheOther) {
    fieldErrors.primaryNiche = "Please describe your niche.";
  }
  if (!contentLinks[0]) fieldErrors.contentLink1 = "Please share at least one content link.";

  // Step 5 - Audience
  const audienceAgeGroup = str(formData, "audienceAgeGroup");
  const audienceGenderSplit = str(formData, "audienceGenderSplit");
  const audienceTopCountries = str(formData, "audienceTopCountries");
  const audienceTopCities = optionalStr(formData, "audienceTopCities");
  const audienceInterests = formData.getAll("audienceInterests") as string[];
  const audienceInterestsOther = optionalStr(formData, "audienceInterestsOther");

  if (!audienceAgeGroup) fieldErrors.audienceAgeGroup = "Please select an age group.";
  if (!audienceGenderSplit) fieldErrors.audienceGenderSplit = "Please select a gender split.";
  if (!audienceTopCountries) fieldErrors.audienceTopCountries = "Please list your top countries.";

  // Step 6 - Experience & availability
  const previousBrandsRaw = str(formData, "previousBrands");
  const previousBrands = previousBrandsRaw ? previousBrandsRaw.split(",").filter(Boolean) : [];
  const campaignTypes = formData.getAll("campaignTypes") as string[];
  const availability = formData.getAll("availability") as string[];
  const brandsExcluded = optionalStr(formData, "brandsExcluded");
  const brandExclusivity = optionalStr(formData, "brandExclusivity");
  const expectedHourlyRateRaw = str(formData, "expectedHourlyRate");
  const hasAgentRaw = str(formData, "hasAgent");
  const agentName = optionalStr(formData, "agentName");
  const agentContact = optionalStr(formData, "agentContact");

  let expectedHourlyRate: number | null = null;
  if (!expectedHourlyRateRaw) {
    fieldErrors.expectedHourlyRate = "Please enter your expected hourly rate.";
  } else {
    expectedHourlyRate = Number(expectedHourlyRateRaw);
    if (Number.isNaN(expectedHourlyRate) || expectedHourlyRate < 0) {
      fieldErrors.expectedHourlyRate = "Enter a valid amount.";
      expectedHourlyRate = null;
    }
  }

  let hasAgent: boolean | null = null;
  if (!hasAgentRaw) {
    fieldErrors.hasAgent = "Please select an option.";
  } else {
    hasAgent = hasAgentRaw === "Yes";
    if (hasAgent) {
      if (!agentName) fieldErrors.agentName = "Agent name is required.";
      if (!agentContact) fieldErrors.agentContact = "Agent contact is required.";
    }
  }

  // Step 7 - Final details
  const bio = str(formData, "bio");
  const portfolioLink = optionalStr(formData, "portfolioLink");
  const vatStatus = str(formData, "vatStatus");
  const invoicingAs = str(formData, "invoicingAs");
  const additionalInfo = optionalStr(formData, "additionalInfo");
  const termsAccepted = formData.get("termsAccepted") === "true";

  if (!bio) fieldErrors.bio = "Please add a short bio.";
  if (!vatStatus) fieldErrors.vatStatus = "Please select an option.";
  if (!invoicingAs) fieldErrors.invoicingAs = "Please select an option.";
  if (!termsAccepted) fieldErrors.termsAccepted = "You must accept the terms to continue.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const supabase = createAdminClient();
  const applicationId = crypto.randomUUID();

  const uploadPhoto = async (file: File, label: string) => {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${applicationId}/${label}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(CREATOR_PHOTOS_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      throw new Error(`Failed to upload ${label} photo: ${error.message}`);
    }
    return path;
  };

  try {
    const [frontFacePath, sideFacePath, lifestylePath] = await Promise.all([
      uploadPhoto(frontFace as File, "front"),
      uploadPhoto(sideFace as File, "side"),
      uploadPhoto(lifestyle as File, "lifestyle"),
    ]);

    await prisma.creator.create({
      data: {
        id: applicationId,
        frontFacePath,
        sideFacePath,
        lifestylePath,
        firstName,
        lastName,
        email,
        phone,
        city,
        country,
        ageRange,
        genderIdentity,
        languages,
        socialPlatforms,
        website,
        primaryNiche,
        primaryNicheOther,
        secondaryNiches,
        contentStyles,
        contentStylesOther,
        contentFormats,
        contentFormatsOther,
        contentLinks,
        audienceAgeGroup,
        audienceGenderSplit,
        audienceTopCountries,
        audienceTopCities,
        audienceInterests,
        audienceInterestsOther,
        previousBrands,
        campaignTypes,
        availability,
        brandsExcluded,
        brandExclusivity,
        expectedHourlyRate,
        hasAgent,
        agentName,
        agentContact,
        bio,
        portfolioLink,
        vatStatus,
        invoicingAs,
        additionalInfo,
        termsAccepted,
      },
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong submitting your application.",
    };
  }

  try {
    const { subject, html } = newApplicationEmail({
      id: applicationId,
      firstName,
      lastName,
      email,
      primaryNiche,
      city,
      country,
    });
    await resend.emails.send({
      from: EMAIL_FROM,
      to: TALENT_EMAIL,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send new application notification email", error);
  }

  return {
    status: "success",
    message: "Application submitted! We'll be in touch soon.",
  };
}

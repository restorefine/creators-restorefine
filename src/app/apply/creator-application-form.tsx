"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import localFont from "next/font/local";
import { submitApplication, type ApplicationFormState } from "./actions";
import { STEP_META } from "./options";
import { Step1Photos } from "./steps/step-1-photos";
import { Step2About } from "./steps/step-2-about";
import { Step3Social } from "./steps/step-3-social";
import { Step4Content } from "./steps/step-4-content";
import { Step5Audience } from "./steps/step-5-audience";
import { Step6Experience } from "./steps/step-6-experience";
import { Step7Final } from "./steps/step-7-final";
import { InfoBox } from "./form-ui";

const holiday = localFont({
  src: "../../../public/fonts/Holiday.otf",
  variable: "--font-holiday",
});

const initialState: ApplicationFormState = { status: "idle" };

const TOTAL_STEPS = 7;

function renderTitle(title: string, highlight: string) {
  const index = title.indexOf(highlight);
  if (index === -1) return title;

  return (
    <>
      {title.slice(0, index)}
      <span className={`${holiday.className} text-brand`}>{highlight}</span>
      {title.slice(index + highlight.length)}
    </>
  );
}

const FIELD_STEP: Record<string, number> = {
  firstName: 1,
  lastName: 1,
  email: 1,
  confirmEmail: 1,
  phone: 1,
  city: 1,
  country: 1,
  ageRange: 1,
  primaryNiche: 3,
  primaryNicheOther: 3,
  audienceAgeGroup: 4,
  audienceGenderSplit: 4,
  audienceTopCountries: 4,
  expectedHourlyRate: 5,
  hasAgent: 5,
  agentName: 5,
  agentContact: 5,
  bio: 6,
  vatStatus: 6,
  invoicingAs: 6,
  termsAccepted: 7,
  frontFace: 7,
  sideFace: 7,
  lifestyle: 7,
};

function isFileSelected(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0;
}

function validateStep(step: number, formData: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const get = (name: string) => (formData.get(name) as string)?.trim() ?? "";

  if (step === 1) {
    if (!get("firstName")) errors.firstName = "First name is required.";
    if (!get("lastName")) errors.lastName = "Last name is required.";
    const email = get("email");
    const confirmEmail = get("confirmEmail");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!confirmEmail) {
      errors.confirmEmail = "Please confirm your email.";
    } else if (confirmEmail !== email) {
      errors.confirmEmail = "Emails do not match.";
    }
    if (!get("phone")) errors.phone = "Phone number is required.";
    if (!get("city")) errors.city = "City is required.";
    if (!get("country")) errors.country = "Please select a country.";
    if (!get("ageRange")) errors.ageRange = "Please select your age range.";
  }

  if (step === 3) {
    const primaryNiche = get("primaryNiche");
    if (!primaryNiche) {
      errors.primaryNiche = "Please select your primary niche.";
    } else if (primaryNiche === "Other" && !get("primaryNicheOther")) {
      errors.primaryNiche = "Please describe your niche.";
    }
  }

  if (step === 4) {
    if (!get("audienceAgeGroup")) errors.audienceAgeGroup = "Please select an age group.";
    if (!get("audienceGenderSplit")) errors.audienceGenderSplit = "Please select a gender split.";
    if (!get("audienceTopCountries")) errors.audienceTopCountries = "Please list your top countries.";
  }

  if (step === 5) {
    const expectedHourlyRate = get("expectedHourlyRate");
    if (!expectedHourlyRate) {
      errors.expectedHourlyRate = "Please enter your expected hourly rate.";
    } else if (Number.isNaN(Number(expectedHourlyRate)) || Number(expectedHourlyRate) < 0) {
      errors.expectedHourlyRate = "Enter a valid amount.";
    }

    const hasAgent = get("hasAgent");
    if (!hasAgent) errors.hasAgent = "Please select an option.";
    if (hasAgent === "Yes") {
      if (!get("agentName")) errors.agentName = "Agent name is required.";
      if (!get("agentContact")) errors.agentContact = "Agent contact is required.";
    }
  }

  if (step === 6) {
    if (!get("bio")) errors.bio = "Please add a short bio.";
    if (!get("vatStatus")) errors.vatStatus = "Please select an option.";
    if (!get("invoicingAs")) errors.invoicingAs = "Please select an option.";
  }

  if (step === 7) {
    if (!isFileSelected(formData.get("frontFace"))) errors.frontFace = "This photo is required.";
    if (!isFileSelected(formData.get("sideFace"))) errors.sideFace = "This photo is required.";
    if (!isFileSelected(formData.get("lifestyle"))) errors.lifestyle = "This photo is required.";
    if (formData.get("termsAccepted") !== "true") {
      errors.termsAccepted = "You must accept the terms to continue.";
    }
  }

  return errors;
}

export function CreatorApplicationForm() {
  const [state, formAction, isPending] = useActionState(submitApplication, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [handledFieldErrors, setHandledFieldErrors] = useState(state.fieldErrors);

  if (state.fieldErrors && state.fieldErrors !== handledFieldErrors) {
    setHandledFieldErrors(state.fieldErrors);
    const steps = Object.keys(state.fieldErrors).map((field) => FIELD_STEP[field] ?? 1);
    setStep(Math.min(...steps));
    setErrors(state.fieldErrors);
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Application submitted</h2>
        <p className="mt-2 text-sm text-slate-600">{state.message}</p>
      </div>
    );
  }

  const meta = STEP_META[step - 1];

  const handleContinue = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const stepErrors = validateStep(TOTAL_STEPS, formData);
    if (Object.keys(stepErrors).length > 0) {
      e.preventDefault();
      setErrors(stepErrors);
    }
  };

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium text-slate-500">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="font-medium text-slate-500">{meta.label}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Step {step}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          {renderTitle(meta.title, meta.highlight)}
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">{meta.description}</p>
      </div>

      {meta.note && <InfoBox>{meta.note}</InfoBox>}

      {state.status === "error" && state.message && !state.fieldErrors && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div hidden={step !== 1}>
        <Step2About errors={errors} />
      </div>
      <div hidden={step !== 2}>
        <Step3Social />
      </div>
      <div hidden={step !== 3}>
        <Step4Content errors={errors} />
      </div>
      <div hidden={step !== 4}>
        <Step5Audience errors={errors} />
      </div>
      <div hidden={step !== 5}>
        <Step6Experience errors={errors} />
      </div>
      <div hidden={step !== 6}>
        <Step7Final errors={errors} />
      </div>
      <div hidden={step !== 7}>
        <Step1Photos errors={errors} />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            key="continue"
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            Continue →
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}

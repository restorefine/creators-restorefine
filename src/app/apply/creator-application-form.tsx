"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import localFont from "next/font/local";
import { submitApplication, type ApplicationFormState } from "./actions";
import { SECTION_META, STEP_META } from "./options";
import { Step1Photos } from "./steps/step-1-photos";
import { Step2About } from "./steps/step-2-about";
import { Step3Social } from "./steps/step-3-social";
import { Step4Content } from "./steps/step-4-content";
import { Step5Audience } from "./steps/step-5-audience";
import { Step6Experience } from "./steps/step-6-experience";
import { Step7Final } from "./steps/step-7-final";
import { InfoBox } from "./form-ui";
import { clearDraft, loadDraft, restoreDraft, saveDraft, snapshotDefaults } from "./form-draft";
import { stepForField, validateFieldsForStep } from "./validation";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const holiday = localFont({
  src: "../../../public/fonts/Holiday.otf",
  variable: "--font-holiday",
});

const initialState: ApplicationFormState = { status: "idle" };

const TOTAL_STEPS = 4;

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

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-t border-slate-200 pt-6 sm:pt-8">
      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}


function isFileSelected(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0;
}

function validateStep(step: number, formData: FormData): Record<string, string> {
  if (step < 4) return validateFieldsForStep(step, formData);

  const errors: Record<string, string> = {};
  if (!isFileSelected(formData.get("frontFace"))) errors.frontFace = "This photo is required.";
  if (!isFileSelected(formData.get("sideFace"))) errors.sideFace = "This photo is required.";
  if (formData.get("termsAccepted") !== "true") {
    errors.termsAccepted = "You must accept the terms to continue.";
  }
  return errors;
}

export function CreatorApplicationForm() {
  const [state, formAction, isPending] = useActionState(submitApplication, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [handledFieldErrors, setHandledFieldErrors] = useState(state.fieldErrors);
  const [restored, setRestored] = useState(false);
  const draftReady = useRef(false);
  const formDefaults = useRef<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (state.fieldErrors && state.fieldErrors !== handledFieldErrors) {
    setHandledFieldErrors(state.fieldErrors);
    const steps = Object.keys(state.fieldErrors).map((field) => stepForField(field));
    setStep(Math.min(...steps));
    setErrors(state.fieldErrors);
  }

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.applicationStarted);
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      clearDraft();
      trackEvent(ANALYTICS_EVENTS.applicationSubmitted);
    }
  }, [state.status]);

  // Restore saved progress once, before auto-save starts.
  useEffect(() => {
    if (!formRef.current) return;
    formDefaults.current = snapshotDefaults(formRef.current);
    const draft = loadDraft(formDefaults.current);
    if (!draft) {
      draftReady.current = true;
      return;
    }
    restoreDraft(formRef.current, draft).then(() => {
      setStep(Math.min(Math.max(draft.step, 1), TOTAL_STEPS));
      setRestored(true);
      draftReady.current = true;
    });
  }, []);

  const scheduleSave = () => {
    if (!draftReady.current) return;
    clearTimeout(saveTimer.current);
    // Wait for React to commit state-driven hidden inputs before reading.
    saveTimer.current = setTimeout(() => {
      if (formRef.current) saveDraft(formRef.current, step, formDefaults.current);
    }, 400);
  };

  useEffect(() => {
    if (draftReady.current && formRef.current) saveDraft(formRef.current, step, formDefaults.current);
  }, [step]);

  // Bring the new step into view so phone users never land mid-page.
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Jump to the first problem instead of making people hunt for it.
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const firstError = formRef.current?.querySelector<HTMLElement>("[data-field-error]");
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  // "Next" on the phone keyboard moves to the next field rather than doing nothing.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key !== "Enter" || e.defaultPrevented || !(target instanceof HTMLInputElement)) return;
    if (["checkbox", "radio", "file", "submit"].includes(target.type)) return;
    e.preventDefault();
    const fields = Array.from(
      formRef.current?.querySelectorAll<HTMLElement>("input:not([type=hidden]):not([type=file]), textarea") ?? [],
    ).filter((el) => el.offsetParent !== null && !(el as HTMLInputElement).disabled && !el.classList.contains("sr-only"));
    const next = fields[fields.indexOf(target) + 1];
    if (next) next.focus();
    else target.blur();
  };

  const startOver = () => {
    clearDraft();
    window.location.reload();
  };

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
    trackEvent(ANALYTICS_EVENTS.applicationStepCompleted, {
      step_number: step,
      step_name: STEP_META[step - 1].label,
    });
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
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onChange={scheduleSave}
      onClick={scheduleSave}
      onBlur={scheduleSave}
      onKeyDown={handleKeyDown}
      noValidate
      className="scroll-mt-4 space-y-6 sm:space-y-8"
    >
      <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 pb-3 pt-3 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <p className="text-sm text-slate-500 sm:hidden">
          Step {step} of {TOTAL_STEPS} · <span className="font-medium text-slate-900">{meta.label}</span>
        </p>
        <ol className="mt-2 grid grid-cols-4 gap-1.5 sm:mt-0 sm:gap-3" aria-label="Application progress">
          {STEP_META.map((item) => (
            <li key={item.step} aria-current={item.step === step ? "step" : undefined}>
              <div
                className={`h-1 rounded-full transition-colors duration-300 ${
                  item.step <= step ? "bg-brand" : "bg-slate-200"
                }`}
              />
              <p
                className={`mt-2.5 hidden text-xs font-medium sm:block ${
                  item.step === step ? "text-slate-900" : "text-slate-400"
                }`}
              >
                <span className="tabular-nums">{String(item.step).padStart(2, "0")}</span>
                <span className="ml-2">{item.label}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
          {renderTitle(meta.title, meta.highlight)}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">{meta.description}</p>
      </div>

      {restored && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>Welcome back! We&apos;ve restored your progress. Photos need re-adding.</span>
          <button type="button" onClick={startOver} className="shrink-0 font-semibold underline">
            Start over
          </button>
        </div>
      )}

      {meta.note && <InfoBox>{meta.note}</InfoBox>}

      {state.status === "error" && state.message && !state.fieldErrors && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div hidden={step !== 1} className="space-y-6 sm:space-y-8">
        <Step2About errors={errors} />
        <SectionHeading {...SECTION_META.social} />
        <Step3Social errors={errors} />
      </div>
      <div hidden={step !== 2} className="space-y-6 sm:space-y-8">
        <Step4Content errors={errors} />
        <SectionHeading {...SECTION_META.audience} />
        <Step5Audience errors={errors} />
      </div>
      <div hidden={step !== 3} className="space-y-6 sm:space-y-8">
        <Step6Experience errors={errors} />
        <SectionHeading {...SECTION_META.finalDetails} />
        <Step7Final errors={errors} />
      </div>
      <div hidden={step !== 4}>
        <Step1Photos errors={errors} />
      </div>

      {/* Pinned to the bottom of the screen on phones so Continue is always in reach */}
      <div className="sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mx-0 sm:justify-between sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-6 sm:backdrop-blur-none">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:py-2.5"
        >
          ← Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            key="continue"
            type="button"
            onClick={handleContinue}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.98] sm:flex-none sm:py-2.5"
          >
            Continue →
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={isPending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:py-2.5"
          >
            {isPending ? "Submitting..." : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}

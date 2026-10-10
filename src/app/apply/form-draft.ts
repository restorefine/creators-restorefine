// Saves in-progress answers to localStorage so creators can leave and come
// back. Photos can't be stored and the terms box is always re-confirmed.

const STORAGE_KEY = "rcn-application-draft";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const SKIPPED_FIELDS = new Set(["termsAccepted"]);

export type FormDraft = {
  step: number;
  savedAt: number;
  entries: [string, string][];
};

/** Serialised values a form starts with (e.g. pre-selected "No"). */
export function snapshotDefaults(form: HTMLFormElement) {
  const defaults = new Set<string>();
  for (const [name, value] of new FormData(form)) {
    if (typeof value === "string") defaults.add(`${name}=${value}`);
  }
  return defaults;
}

/** Only answers the person actually gave; pre-filled defaults don't count. */
function meaningfulEntries(entries: [string, string][], defaults: Set<string>) {
  return entries.filter(([name, value]) => !defaults.has(`${name}=${value}`));
}

export function saveDraft(form: HTMLFormElement, step: number, defaults: Set<string>) {
  const entries: [string, string][] = [];
  for (const [name, value] of new FormData(form)) {
    if (typeof value === "string" && value !== "" && !SKIPPED_FIELDS.has(name)) {
      entries.push([name, value]);
    }
  }
  if (meaningfulEntries(entries, defaults).length === 0) {
    clearDraft();
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, savedAt: Date.now(), entries }));
  } catch {
    // Storage unavailable (e.g. private browsing) — progress just won't persist.
  }
}

export function loadDraft(defaults: Set<string>): FormDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as FormDraft;
    if (Date.now() - draft.savedAt > MAX_AGE_MS || meaningfulEntries(draft.entries, defaults).length === 0) {
      clearDraft();
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Fill fields through real DOM events so React-controlled inputs (chips,
// conditional "Other" fields, tags, follower counts) update their state.
function setInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function blur(input: HTMLElement) {
  input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
}

export async function restoreDraft(form: HTMLFormElement, draft: FormDraft) {
  const fields = (name: string) =>
    Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[name="${CSS.escape(name)}"]`));

  // 1. Choices first — they reveal conditional fields (agent, "Other" boxes).
  for (const [name, value] of draft.entries) {
    for (const field of fields(name)) {
      if (field instanceof HTMLInputElement && (field.type === "radio" || field.type === "checkbox")) {
        if (field.value === value && !field.checked) field.click();
      }
    }
  }

  // Let React render any newly revealed fields.
  await new Promise((resolve) => setTimeout(resolve, 0));

  // 2. Text fields, plus the hidden values that need their visible input.
  for (const [name, value] of draft.entries) {
    const followerMatch = name.match(/^social_(\w+)_followers$/);
    if (followerMatch) {
      // Instagram/TikTok re-fetch from the handle; others restore the typed count.
      const visible = form.querySelector<HTMLInputElement>(`#social_${followerMatch[1]}_followers`);
      const lookedUp = ["instagram", "tiktok"].includes(followerMatch[1]);
      if (visible && !lookedUp) {
        setInputValue(visible, value);
        blur(visible);
      }
      continue;
    }

    if (name === "previousBrands") {
      const entry = form.querySelector<HTMLInputElement>("#previousBrands_entry");
      for (const brand of value.split(",").filter(Boolean)) {
        if (!entry) break;
        setInputValue(entry, brand);
        entry.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      }
      continue;
    }

    for (const field of fields(name)) {
      if (field.type === "radio" || field.type === "checkbox" || field.type === "hidden") continue;
      setInputValue(field, value);
      // Social handles look up follower counts on blur.
      if (/^social_\w+_handle$/.test(name)) blur(field);
    }
  }
}

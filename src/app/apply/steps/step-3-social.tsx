"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS } from "../options";
import { FieldLabel, TextInput } from "../form-ui";

// ---------------------------------------------------------------------------
// Follower count formatting helpers
// ---------------------------------------------------------------------------
function formatFollowers(raw: number): string {
  if (raw >= 1_000_000) {
    const val = raw / 1_000_000;
    return `${parseFloat(val.toFixed(1))}M`;
  }
  if (raw >= 1_000) {
    const val = raw / 1_000;
    return `${parseFloat(val.toFixed(1))}K`;
  }
  return String(raw);
}

/** Parse a user-typed string like "1.1k", "2.5M", "1100" → raw number or null */
function parseFollowers(input: string): number | null {
  const trimmed = input.trim().replace(/,/g, "");
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower.endsWith("m")) {
    const n = parseFloat(lower.slice(0, -1));
    return isNaN(n) ? null : Math.round(n * 1_000_000);
  }
  if (lower.endsWith("k")) {
    const n = parseFloat(lower.slice(0, -1));
    return isNaN(n) ? null : Math.round(n * 1_000);
  }
  const n = parseFloat(lower);
  return isNaN(n) ? null : Math.round(n);
}

// ---------------------------------------------------------------------------
// FollowerInput — shows K/M display, submits raw number via hidden input
// ---------------------------------------------------------------------------
function FollowerInput({ platformKey, disabled }: { platformKey: string; disabled: boolean }) {
  const [display, setDisplay] = useState("");
  const [rawValue, setRawValue] = useState<number | null>(null);

  const handleBlur = () => {
    if (!display.trim()) {
      setRawValue(null);
      return;
    }
    const parsed = parseFollowers(display);
    if (parsed !== null) {
      setRawValue(parsed);
      setDisplay(formatFollowers(parsed));
    } else {
      setRawValue(null);
    }
  };

  const handleFocus = () => {
    // When focused, revert to raw number so user can edit freely
    if (rawValue !== null) {
      setDisplay(String(rawValue));
    }
  };

  const inputClasses =
    "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <>
      {/* Visible display input — no `name` so FormData ignores it */}
      <input
        id={`social_${platformKey}_followers`}
        type="text"
        inputMode="numeric"
        value={display}
        disabled={disabled}
        placeholder="e.g. 1.1K"
        onChange={(e) => setDisplay(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${inputClasses} ${disabled ? "bg-slate-50 text-slate-400" : ""}`}
        aria-label="Follower count"
      />
      {/* Hidden input carries the raw integer for the server action */}
      <input
        type="hidden"
        name={`social_${platformKey}_followers`}
        value={rawValue !== null ? String(rawValue) : ""}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Step
// ---------------------------------------------------------------------------
export function Step3Social() {
  const [naFlags, setNaFlags] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {SOCIAL_PLATFORMS.map(({ key, label }) => {
        const isNa = naFlags[key] ?? false;
        return (
          <div
            key={key}
            className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end"
          >
            <div className="text-sm font-semibold text-slate-900 sm:pb-2">{label}</div>
            <div>
              <FieldLabel htmlFor={`social_${key}_handle`}>Handle / name</FieldLabel>
              <TextInput
                id={`social_${key}_handle`}
                name={`social_${key}_handle`}
                type="text"
                disabled={isNa}
                placeholder="@username"
                className={isNa ? "bg-slate-50 text-slate-400" : ""}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`social_${key}_followers`}>Followers</FieldLabel>
              <FollowerInput platformKey={key} disabled={isNa} />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-slate-600 sm:justify-self-end">
              <input
                type="checkbox"
                name={`social_${key}_na`}
                checked={isNa}
                onChange={(e) => setNaFlags((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              N/A
            </label>
          </div>
        );
      })}

      <div>
        <FieldLabel htmlFor="website" optional>
          Personal website or blog
        </FieldLabel>
        <TextInput id="website" name="website" type="url" placeholder="https://" />
      </div>
    </div>
  );
}

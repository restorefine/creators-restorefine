"use client";

import { useRef, useState } from "react";
import { isLookupPlatform, normaliseHandle } from "@/lib/followers";
import { lookupFollowers } from "../followers-actions";
import { SOCIAL_PLATFORMS } from "../options";
import { FieldError, FieldShell, TextField, fieldInputClassName } from "../form-ui";

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
function FollowerInput({
  platformKey,
  disabled,
  readOnly,
  rawValue,
  onRawValueChange,
}: {
  platformKey: string;
  disabled: boolean;
  readOnly: boolean;
  rawValue: number | null;
  onRawValueChange: (value: number | null) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? (rawValue !== null ? formatFollowers(rawValue) : "");

  const handleBlur = () => {
    if (draft === null) return;
    onRawValueChange(draft.trim() ? parseFollowers(draft) : null);
    setDraft(null);
  };

  const handleFocus = () => {
    // When focused, revert to raw number so user can edit freely
    if (!readOnly) setDraft(rawValue !== null ? String(rawValue) : "");
  };

  return (
    <>
      {/* Visible display input — no `name` so FormData ignores it */}
      <FieldShell label="Followers" htmlFor={`social_${platformKey}_followers`} disabled={disabled || readOnly}>
        <input
          id={`social_${platformKey}_followers`}
          type="text"
          inputMode="decimal"
          value={display}
          disabled={disabled}
          readOnly={readOnly}
          placeholder="e.g. 1.2K"
          onChange={(e) => setDraft(e.target.value.replace(/[^\d.,kKmM]/g, ""))}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={fieldInputClassName}
        />
      </FieldShell>
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
// PlatformRow — Instagram/TikTok counts are looked up from the handle
// ---------------------------------------------------------------------------
type LookupStatus = "idle" | "checking" | "found" | "not_found";

function PlatformRow({ platformKey, label, error }: { platformKey: string; label: string; error?: string }) {
  const [isNa, setIsNa] = useState(false);
  const [followers, setFollowers] = useState<number | null>(null);
  const [status, setStatus] = useState<LookupStatus>("idle");
  const lookedUpHandle = useRef("");
  const canLookup = isLookupPlatform(platformKey);

  const handleHandleChange = () => {
    if (status === "found") setFollowers(null);
    if (status !== "idle") setStatus("idle");
    lookedUpHandle.current = "";
  };

  const handleHandleBlur = async (value: string) => {
    const handle = normaliseHandle(value);
    if (!canLookup || !handle || handle === lookedUpHandle.current) return;

    lookedUpHandle.current = handle;
    setStatus("checking");
    const count = await lookupFollowers(platformKey, handle).catch(() => null);
    // Ignore results for a handle the user has since edited
    if (lookedUpHandle.current !== handle) return;

    if (count !== null) {
      setFollowers(count);
      setStatus("found");
    } else {
      setStatus("not_found");
    }
  };

  return (
    // Phones: platform + N/A on top, handle and followers side by side below.
    // Ticking N/A collapses the row on phones to save scrolling.
    <div className="grid grid-cols-[3fr_2fr] items-center gap-x-3 gap-y-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end sm:gap-3 sm:p-4">
      <div className="order-1 text-sm font-semibold text-slate-900 sm:pb-2">{label}</div>
      <div className={`order-3 self-start sm:order-2 ${isNa ? "max-sm:hidden" : ""}`}>
        <TextField
          label="Handle"
          id={`social_${platformKey}_handle`}
          name={`social_${platformKey}_handle`}
          type="text"
          disabled={isNa}
          placeholder="@username"
          onChange={handleHandleChange}
          onBlur={(e) => handleHandleBlur(e.target.value)}
        />
        <FieldError message={error} />
      </div>
      <div className={`order-4 self-start sm:order-3 ${isNa ? "max-sm:hidden" : ""}`}>
        <FollowerInput
          platformKey={platformKey}
          disabled={isNa || status === "checking"}
          readOnly={status === "found"}
          rawValue={followers}
          onRawValueChange={setFollowers}
        />
      </div>
      <label className="order-2 flex items-center gap-2 justify-self-end text-sm text-slate-600 sm:order-4 sm:pb-2">
        <input
          type="checkbox"
          name={`social_${platformKey}_na`}
          checked={isNa}
          onChange={(e) => setIsNa(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
        />
        N/A
      </label>
      {canLookup && !isNa && status !== "idle" && (
        <p
          className={`order-5 col-span-2 text-xs sm:col-span-4 ${
            status === "found" ? "text-emerald-600" : status === "checking" ? "text-slate-500" : "text-amber-600"
          }`}
        >
          {status === "checking" && `Checking ${label}…`}
          {status === "found" && `✓ Found ${followers?.toLocaleString("en-GB")} followers on ${label}`}
          {status === "not_found" && "Couldn't fetch your follower count. Please enter it manually."}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step
// ---------------------------------------------------------------------------
export function Step3Social({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="space-y-4">
      {SOCIAL_PLATFORMS.map(({ key, label }) => (
        <PlatformRow key={key} platformKey={key} label={label} error={errors[`social_${key}_handle`]} />
      ))}

      <div>
        <TextField label="Personal website or blog" optional id="website" name="website" type="url" inputMode="url" placeholder="yoursite.com" />
        <FieldError message={errors.website} />
      </div>
    </div>
  );
}

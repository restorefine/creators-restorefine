"use client";

import { useRef, useState } from "react";
import { isLookupPlatform, normaliseHandle } from "@/lib/followers";
import { lookupFollowers } from "../followers-actions";
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

  const inputClasses =
    "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <>
      {/* Visible display input — no `name` so FormData ignores it */}
      <input
        id={`social_${platformKey}_followers`}
        type="text"
        inputMode="text"
        value={display}
        disabled={disabled}
        readOnly={readOnly}
        placeholder="e.g. 1.1K/1.1M"
        onChange={(e) => setDraft(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${inputClasses} ${disabled || readOnly ? "bg-slate-50 text-slate-500" : ""}`}
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
// PlatformRow — Instagram/TikTok counts are looked up from the handle
// ---------------------------------------------------------------------------
type LookupStatus = "idle" | "checking" | "found" | "not_found";

function PlatformRow({ platformKey, label }: { platformKey: string; label: string }) {
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
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
      <div className="text-sm font-semibold text-slate-900 sm:pb-2">{label}</div>
      <div>
        <FieldLabel htmlFor={`social_${platformKey}_handle`}>Handle / name</FieldLabel>
        <TextInput
          id={`social_${platformKey}_handle`}
          name={`social_${platformKey}_handle`}
          type="text"
          disabled={isNa}
          placeholder="@username"
          onChange={handleHandleChange}
          onBlur={(e) => handleHandleBlur(e.target.value)}
          className={isNa ? "bg-slate-50 text-slate-400" : ""}
        />
      </div>
      <div>
        <FieldLabel htmlFor={`social_${platformKey}_followers`}>Followers</FieldLabel>
        <FollowerInput
          platformKey={platformKey}
          disabled={isNa || status === "checking"}
          readOnly={status === "found"}
          rawValue={followers}
          onRawValueChange={setFollowers}
        />
      </div>
      <label className="flex items-center gap-2 pb-2 text-sm text-slate-600 sm:justify-self-end">
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
          className={`text-xs sm:col-span-4 ${
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
export function Step3Social() {
  return (
    <div className="space-y-4">
      {SOCIAL_PLATFORMS.map(({ key, label }) => (
        <PlatformRow key={key} platformKey={key} label={label} />
      ))}

      <div>
        <FieldLabel htmlFor="website" optional>
          Personal website or blog
        </FieldLabel>
        <TextInput id="website" name="website" type="url" placeholder="https://" />
      </div>
    </div>
  );
}

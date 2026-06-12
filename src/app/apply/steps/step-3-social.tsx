"use client";

import { useState } from "react";
import { SOCIAL_PLATFORMS } from "../options";
import { FieldLabel, TextInput } from "../form-ui";

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
              <TextInput
                id={`social_${key}_followers`}
                name={`social_${key}_followers`}
                type="number"
                min={0}
                disabled={isNa}
                placeholder="0"
                className={isNa ? "bg-slate-50 text-slate-400" : ""}
              />
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

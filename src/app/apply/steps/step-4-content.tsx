"use client";

import { useState } from "react";
import {
  CONTENT_FORMATS,
  CONTENT_STYLES,
  NICHES,
  SECONDARY_NICHES,
} from "../options";
import { ChipCheckbox, ChipRadio, FieldError, FieldLabel, TextInput } from "../form-ui";

export function Step4Content({ errors }: { errors: Record<string, string> }) {
  const [primaryNiche, setPrimaryNiche] = useState("");
  const [styleOther, setStyleOther] = useState(false);
  const [formatOther, setFormatOther] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <FieldLabel>Primary niche</FieldLabel>
        <div className="mt-2">
          <ChipRadio name="primaryNiche" options={NICHES} value={primaryNiche} onChange={setPrimaryNiche} />
        </div>
        <FieldError message={errors.primaryNiche} />
        {primaryNiche === "Other" && (
          <div className="mt-3">
            <TextInput
              id="primaryNicheOther"
              name="primaryNicheOther"
              type="text"
              placeholder="Tell us your niche"
            />
          </div>
        )}
      </div>

      <div>
        <FieldLabel optional>Secondary niches</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {SECONDARY_NICHES.map((option) => (
            <ChipCheckbox key={option} name="secondaryNiches" option={option} />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel optional>Content style</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTENT_STYLES.map((option) =>
            option === "Other" ? (
              <ChipCheckbox
                key={option}
                name="contentStyles"
                option={option}
                checked={styleOther}
                onChange={setStyleOther}
              />
            ) : (
              <ChipCheckbox key={option} name="contentStyles" option={option} />
            ),
          )}
        </div>
        {styleOther && (
          <div className="mt-3">
            <TextInput
              id="contentStylesOther"
              name="contentStylesOther"
              type="text"
              placeholder="Tell us your style"
            />
          </div>
        )}
      </div>

      <div>
        <FieldLabel optional>Content format strengths</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTENT_FORMATS.map((option) =>
            option === "Other" ? (
              <ChipCheckbox
                key={option}
                name="contentFormats"
                option={option}
                checked={formatOther}
                onChange={setFormatOther}
              />
            ) : (
              <ChipCheckbox key={option} name="contentFormats" option={option} />
            ),
          )}
        </div>
        {formatOther && (
          <div className="mt-3">
            <TextInput
              id="contentFormatsOther"
              name="contentFormatsOther"
              type="text"
              placeholder="Tell us your format"
            />
          </div>
        )}
      </div>

      <div>
        <FieldLabel>Content example links</FieldLabel>
        <p className="mt-0.5 text-xs text-slate-500">
          Share links to content that best represents you.
        </p>
        <div className="mt-2 space-y-3">
          <div>
            <TextInput
              id="contentLink1"
              name="contentLink1"
              type="url"
              placeholder="https://"
            />
            <FieldError message={errors.contentLink1} />
          </div>
          <TextInput id="contentLink2" name="contentLink2" type="url" placeholder="https:// (optional)" />
          <TextInput id="contentLink3" name="contentLink3" type="url" placeholder="https:// (optional)" />
        </div>
      </div>
    </div>
  );
}

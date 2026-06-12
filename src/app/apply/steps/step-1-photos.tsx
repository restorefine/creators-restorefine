"use client";

import { PhotoUpload } from "../form-ui";

export function Step1Photos({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <PhotoUpload
        name="frontFace"
        label="Front headshot"
        helpText="Clear face, neutral bg"
        error={errors.frontFace}
      />
      <PhotoUpload
        name="sideFace"
        label="Side profile"
        helpText="Natural pose, good light"
        error={errors.sideFace}
      />
      <PhotoUpload
        name="lifestyle"
        label="Lifestyle / content"
        helpText="Shows your aesthetic"
        error={errors.lifestyle}
      />
    </div>
  );
}

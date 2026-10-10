"use client";

import Link from "next/link";
import { FieldError } from "../form-ui";
import { PhotoUpload } from "../form-ui";

export function Step1Photos({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
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
          label="Lifestyle / content (optional)"
          className="col-span-2 sm:col-span-1"
          aspectClassName="aspect-[2/1] sm:aspect-[4/5]"
          helpText="Shows your aesthetic"
          error={errors.lifestyle}
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="termsAccepted"
            value="true"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
          />
          <span>
            I confirm the information above is accurate and I agree to the{" "}
            <Link
              href="/terms-and-condition"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:text-brand-dark"
            >
              Terms &amp; Conditions
            </Link>
            .
          </span>
        </label>
        <FieldError message={errors.termsAccepted} />
      </div>
    </div>
  );
}

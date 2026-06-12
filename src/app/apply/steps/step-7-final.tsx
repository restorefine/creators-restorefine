"use client";

import Link from "next/link";
import { INVOICING_OPTIONS, VAT_OPTIONS } from "../options";
import { FieldError, FieldLabel, SelectInput, TextAreaField, TextInput } from "../form-ui";

export function Step7Final({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <p className="mt-0.5 text-xs text-slate-500">
          A short introduction brands will see on your profile.
        </p>
        <div className="mt-2">
          <TextAreaField id="bio" name="bio" rows={4} maxLength={300} />
        </div>
        <FieldError message={errors.bio} />
      </div>

      <div>
        <FieldLabel htmlFor="portfolioLink" optional>
          Portfolio or media kit link
        </FieldLabel>
        <TextInput id="portfolioLink" name="portfolioLink" type="url" placeholder="https://" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="vatStatus">VAT registered?</FieldLabel>
          <SelectInput id="vatStatus" name="vatStatus" options={VAT_OPTIONS} />
          <FieldError message={errors.vatStatus} />
        </div>
        <div>
          <FieldLabel htmlFor="invoicingAs">Invoicing as</FieldLabel>
          <SelectInput id="invoicingAs" name="invoicingAs" options={INVOICING_OPTIONS} />
          <FieldError message={errors.invoicingAs} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="additionalInfo" optional>
          Anything else to know
        </FieldLabel>
        <div className="mt-2">
          <TextAreaField id="additionalInfo" name="additionalInfo" rows={3} />
        </div>
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
            <Link href="/" className="font-medium text-brand hover:text-brand-dark">
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

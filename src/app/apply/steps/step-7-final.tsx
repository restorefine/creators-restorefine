"use client";

import { INVOICING_OPTIONS, VAT_OPTIONS } from "../options";
import { FieldError, FieldLabel, SelectInput, TextAreaField, TextField } from "../form-ui";

export function Step7Final({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="space-y-6">
      <div>
        <TextAreaField id="bio" name="bio" label="Bio" rows={4} maxLength={300} />
        <FieldError message={errors.bio} />
        <p className="mt-1.5 text-xs text-slate-500">A short introduction brands will see on your profile.</p>
      </div>

      <div>
        <TextField label="Portfolio or media kit link" optional id="portfolioLink" name="portfolioLink" type="url" inputMode="url" placeholder="yoursite.com/media-kit" />
        <FieldError message={errors.portfolioLink} />
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
        <TextAreaField id="additionalInfo" name="additionalInfo" label="Anything else to know" optional rows={3} />
        <FieldError message={errors.additionalInfo} />
      </div>
    </div>
  );
}

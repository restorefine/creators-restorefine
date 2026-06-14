"use client";

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


    </div>
  );
}

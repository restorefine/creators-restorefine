"use client";

import { AGE_RANGES, COUNTRIES, GENDER_IDENTITIES } from "../options";
import { FieldError, FieldLabel, SelectInput, TextField } from "../form-ui";
import { PHONE_DISALLOWED_RE } from "../validation";

export function Step2About({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
      <div>
        <TextField label="First name" id="firstName" name="firstName" type="text" autoComplete="given-name" maxLength={50} />
        <FieldError message={errors.firstName} />
      </div>
      <div>
        <TextField label="Last name" id="lastName" name="lastName" type="text" autoComplete="family-name" maxLength={50} />
        <FieldError message={errors.lastName} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <TextField label="Email address" id="email" name="email" type="email" autoComplete="email" maxLength={254} />
        <FieldError message={errors.email} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <TextField label="Confirm email" id="confirmEmail" name="confirmEmail" type="email" />
        <FieldError message={errors.confirmEmail} />
      </div>
      <div>
        <TextField
          label="Phone number"
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={20}
          placeholder="+44 7700 900123"
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(PHONE_DISALLOWED_RE, "");
          }}
        />
        <FieldError message={errors.phone} />
      </div>
      <div>
        <TextField label="City" id="city" name="city" type="text" autoComplete="address-level2" maxLength={60} />
        <FieldError message={errors.city} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <FieldLabel htmlFor="country">Country</FieldLabel>
        <SelectInput id="country" name="country" options={COUNTRIES} />
        <FieldError message={errors.country} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <FieldLabel htmlFor="ageRange">Age range</FieldLabel>
        <SelectInput id="ageRange" name="ageRange" options={AGE_RANGES} />
        <p className="mt-1 text-xs text-slate-400">Must be 18 or over to join</p>
        <FieldError message={errors.ageRange} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <FieldLabel htmlFor="genderIdentity" optional>
          Gender identity
        </FieldLabel>
        <SelectInput id="genderIdentity" name="genderIdentity" options={GENDER_IDENTITIES} />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <TextField label="Languages spoken" optional id="languages" name="languages" type="text" placeholder="English, Spanish" />
        <FieldError message={errors.languages} />
      </div>
    </div>
  );
}

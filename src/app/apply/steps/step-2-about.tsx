"use client";

import { AGE_RANGES, COUNTRIES, GENDER_IDENTITIES } from "../options";
import { FieldError, FieldLabel, SelectInput, TextInput } from "../form-ui";

export function Step2About({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <FieldLabel htmlFor="firstName">First name</FieldLabel>
        <TextInput id="firstName" name="firstName" type="text" />
        <FieldError message={errors.firstName} />
      </div>
      <div>
        <FieldLabel htmlFor="lastName">Last name</FieldLabel>
        <TextInput id="lastName" name="lastName" type="text" />
        <FieldError message={errors.lastName} />
      </div>
      <div>
        <FieldLabel htmlFor="email">Email address</FieldLabel>
        <TextInput id="email" name="email" type="email" />
        <FieldError message={errors.email} />
      </div>
      <div>
        <FieldLabel htmlFor="confirmEmail">Confirm email</FieldLabel>
        <TextInput id="confirmEmail" name="confirmEmail" type="email" />
        <FieldError message={errors.confirmEmail} />
      </div>
      <div>
        <FieldLabel htmlFor="phone">Phone number</FieldLabel>
        <TextInput id="phone" name="phone" type="tel" placeholder="+44 7000 000000" />
        <FieldError message={errors.phone} />
      </div>
      <div>
        <FieldLabel htmlFor="city">City</FieldLabel>
        <TextInput id="city" name="city" type="text" />
        <FieldError message={errors.city} />
      </div>
      <div>
        <FieldLabel htmlFor="country">Country</FieldLabel>
        <SelectInput id="country" name="country" options={COUNTRIES} />
        <FieldError message={errors.country} />
      </div>
      <div>
        <FieldLabel htmlFor="ageRange">Age range</FieldLabel>
        <SelectInput id="ageRange" name="ageRange" options={AGE_RANGES} />
        <p className="mt-1 text-xs text-slate-400">Must be 18 or over to join</p>
        <FieldError message={errors.ageRange} />
      </div>
      <div>
        <FieldLabel htmlFor="genderIdentity" optional>
          Gender identity
        </FieldLabel>
        <SelectInput id="genderIdentity" name="genderIdentity" options={GENDER_IDENTITIES} />
      </div>
      <div>
        <FieldLabel htmlFor="languages" optional>
          Languages spoken
        </FieldLabel>
        <TextInput id="languages" name="languages" type="text" placeholder="English, Spanish" />
      </div>
    </div>
  );
}

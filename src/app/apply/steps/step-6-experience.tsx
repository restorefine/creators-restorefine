"use client";

import { useState } from "react";
import { AVAILABILITY_OPTIONS, CAMPAIGN_TYPES, HOURLY_RATE_RANGES } from "../options";
import { ChipCheckbox, FieldError, FieldLabel, SelectInput, TagInput, TextField } from "../form-ui";

export function Step6Experience({ errors }: { errors: Record<string, string> }) {
  const [hasAgent, setHasAgent] = useState("No");

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel optional>Previous brand collaborations</FieldLabel>
        <p className="mt-0.5 text-xs text-slate-500">
          Add the names of brands you&apos;ve worked with, one at a time.
        </p>
        <div className="mt-2">
          <TagInput name="previousBrands" placeholder="Brand name" />
        </div>
      </div>

      <div>
        <FieldLabel optional>Types of campaigns done</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {CAMPAIGN_TYPES.map((option) => (
            <ChipCheckbox key={option} name="campaignTypes" option={option} />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel optional>Available for</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <ChipCheckbox key={option} name="availability" option={option} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <TextField label="Brands/industries you will not work with" optional id="brandsExcluded" name="brandsExcluded" type="text" />
          <FieldError message={errors.brandsExcluded} />
        </div>
        <div>
          <TextField label="Current brand exclusivity" optional id="brandExclusivity" name="brandExclusivity" type="text" />
          <FieldError message={errors.brandExclusivity} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="expectedHourlyRate">Expected hourly rate</FieldLabel>
        <p className="mt-0.5 text-xs text-slate-500">
          Roughly what you&apos;d expect to be paid per hour for brand work.
        </p>
        <div className="mt-2">
          <SelectInput
            id="expectedHourlyRate"
            name="expectedHourlyRate"
            options={HOURLY_RATE_RANGES.map((range) => range.label)}
          />
        </div>
        <FieldError message={errors.expectedHourlyRate} />
      </div>

      <div>
        <FieldLabel htmlFor="hasAgent">Represented by an agent or manager?</FieldLabel>
        <div className="mt-1 max-w-xs">
          <SelectInput
            id="hasAgent"
            name="hasAgent"
            options={["Yes", "No"]}
            defaultValue="No"
            onChange={setHasAgent}
          />
        </div>
        <FieldError message={errors.hasAgent} />
      </div>

      {hasAgent === "Yes" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <TextField label="Agent / manager name" id="agentName" name="agentName" type="text" />
            <FieldError message={errors.agentName} />
          </div>
          <div>
            <TextField label="Agent / manager contact" id="agentContact" name="agentContact" type="text" placeholder="Email or phone" />
            <FieldError message={errors.agentContact} />
          </div>
        </div>
      )}
    </div>
  );
}

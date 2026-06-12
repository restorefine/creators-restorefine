"use client";

import { useState } from "react";
import { AVAILABILITY_OPTIONS, CAMPAIGN_TYPES } from "../options";
import { CheckboxRow, FieldError, FieldLabel, SelectInput, TagInput, TextInput } from "../form-ui";

export function Step6Experience({ errors }: { errors: Record<string, string> }) {
  const [hasAgent, setHasAgent] = useState("");

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
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CAMPAIGN_TYPES.map((option) => (
            <CheckboxRow key={option} name="campaignTypes" value={option} label={option} />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel optional>Available for</FieldLabel>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <CheckboxRow key={option} name="availability" value={option} label={option} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="brandsExcluded" optional>
            Brands/industries you will not work with
          </FieldLabel>
          <TextInput id="brandsExcluded" name="brandsExcluded" type="text" />
        </div>
        <div>
          <FieldLabel htmlFor="brandExclusivity" optional>
            Current brand exclusivity
          </FieldLabel>
          <TextInput id="brandExclusivity" name="brandExclusivity" type="text" />
        </div>
      </div>

      <div className="max-w-xs">
        <FieldLabel htmlFor="expectedHourlyRate">Expected hourly rate (£)</FieldLabel>
        <p className="mt-0.5 text-xs text-slate-500">
          Roughly what you&apos;d expect to be paid per hour for brand work.
        </p>
        <div className="mt-2">
          <TextInput
            id="expectedHourlyRate"
            name="expectedHourlyRate"
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 25"
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
            onChange={setHasAgent}
          />
        </div>
        <FieldError message={errors.hasAgent} />
      </div>

      {hasAgent === "Yes" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="agentName">Agent / manager name</FieldLabel>
            <TextInput id="agentName" name="agentName" type="text" />
            <FieldError message={errors.agentName} />
          </div>
          <div>
            <FieldLabel htmlFor="agentContact">Agent / manager contact</FieldLabel>
            <TextInput id="agentContact" name="agentContact" type="text" placeholder="Email or phone" />
            <FieldError message={errors.agentContact} />
          </div>
        </div>
      )}
    </div>
  );
}

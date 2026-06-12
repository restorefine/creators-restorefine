"use client";

import { useState } from "react";
import { AUDIENCE_AGE_GROUPS, AUDIENCE_GENDER_SPLITS, AUDIENCE_INTERESTS } from "../options";
import { ChipCheckbox, FieldError, FieldLabel, SelectInput, TextInput } from "../form-ui";

export function Step5Audience({ errors }: { errors: Record<string, string> }) {
  const [interestOther, setInterestOther] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="audienceAgeGroup">Primary age group</FieldLabel>
          <SelectInput id="audienceAgeGroup" name="audienceAgeGroup" options={AUDIENCE_AGE_GROUPS} />
          <FieldError message={errors.audienceAgeGroup} />
        </div>
        <div>
          <FieldLabel htmlFor="audienceGenderSplit">Audience gender split</FieldLabel>
          <SelectInput
            id="audienceGenderSplit"
            name="audienceGenderSplit"
            options={AUDIENCE_GENDER_SPLITS}
          />
          <FieldError message={errors.audienceGenderSplit} />
        </div>
        <div>
          <FieldLabel htmlFor="audienceTopCountries">Top 3 countries your audience is based in</FieldLabel>
          <TextInput
            id="audienceTopCountries"
            name="audienceTopCountries"
            type="text"
            placeholder="UK, USA, Ireland"
          />
          <FieldError message={errors.audienceTopCountries} />
        </div>
        <div>
          <FieldLabel htmlFor="audienceTopCities" optional>
            Top cities, if UK-based
          </FieldLabel>
          <TextInput
            id="audienceTopCities"
            name="audienceTopCities"
            type="text"
            placeholder="London, Manchester"
          />
        </div>
      </div>

      <div>
        <FieldLabel optional>Audience interests</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {AUDIENCE_INTERESTS.map((option) =>
            option === "Other" ? (
              <ChipCheckbox
                key={option}
                name="audienceInterests"
                option={option}
                checked={interestOther}
                onChange={setInterestOther}
              />
            ) : (
              <ChipCheckbox key={option} name="audienceInterests" option={option} />
            ),
          )}
        </div>
        {interestOther && (
          <div className="mt-3">
            <TextInput
              id="audienceInterestsOther"
              name="audienceInterestsOther"
              type="text"
              placeholder="Tell us more"
            />
          </div>
        )}
      </div>
    </div>
  );
}

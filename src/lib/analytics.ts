"use client";

import { sendGAEvent } from "@next/third-parties/google";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Event names as they appear in Google Analytics reports. Keep them plain
// English so the reports read clearly without a glossary.
export const ANALYTICS_EVENTS = {
  /** Clicked "Apply to join the network" on the homepage. */
  applyButtonClicked: "apply_button_clicked",
  /** Confirmed they have everything needed and moved on to the form. */
  checklistAccepted: "checklist_accepted",
  /** Opened the application form. */
  applicationStarted: "application_started",
  /** Finished a form step. Sent with step_number and step_name. */
  applicationStepCompleted: "application_step_completed",
  /** Application saved successfully. Mark this as a Key event in GA4. */
  applicationSubmitted: "application_submitted",
} as const;

type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function trackEvent(event: AnalyticsEvent, params?: Record<string, string | number>) {
  if (!GA_ID) return;
  sendGAEvent("event", event, params ?? {});
}

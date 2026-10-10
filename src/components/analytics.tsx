"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";

const STORAGE_KEY = "rcn-cookie-consent";

type Consent = "accepted" | "rejected";

function pushConsentUpdate(value: Consent) {
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("consent", "update", {
    analytics_storage: value === "accepted" ? "granted" : "denied",
  });
}

/**
 * Loads GA4 for public pages. Consent Mode defaults (set in the root layout)
 * keep analytics cookies off until the visitor accepts the banner.
 */
export function Analytics() {
  const pathname = usePathname();
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored === "accepted" || stored === "rejected") {
      pushConsentUpdate(stored);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
      setBannerOpen(true);
    }
  }, []);

  if (!GA_ID || pathname.startsWith("/admin")) return null;

  const choose = (value: Consent) => {
    setBannerOpen(false);
    pushConsentUpdate(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage unavailable (e.g. private browsing) — choice applies for this visit only.
    }
  };

  return (
    <>
      <GoogleAnalytics gaId={GA_ID} />
      {bannerOpen && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:px-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              We use analytics cookies to understand how people find and use this site. Read our{" "}
              <a
                href="https://restorefine.co.uk/legal/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                Cookie Policy
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="flex-1 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark sm:flex-none"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

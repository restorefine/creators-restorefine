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

  const showBanner = bannerOpen && !!GA_ID && !pathname.startsWith("/admin");

  // Lock page scroll while the consent overlay is up
  useEffect(() => {
    if (!showBanner) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showBanner]);

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
      {showBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="cookie-consent-title" className="text-lg font-semibold text-slate-900">
              Can we use analytics cookies?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              They help us understand how people find and use this site. You can apply either way. Read our{" "}
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
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="flex-1 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="flex-1 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
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

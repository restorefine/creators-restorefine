"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptApplyChecklist } from "@/app/apply/access-actions";

const CHECKLIST_ITEMS = [
  "A front headshot and side profile photo",
  "A lifestyle or content shot that shows your aesthetic",
  "Your social handles and approximate follower counts",
  "A short 2 to 3 sentence bio about what you create",
];

export function ApplyChecklistDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleReject() {
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark sm:w-auto"
      >
        Apply to join the network
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-checklist-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <h2 id="apply-checklist-title" className="text-lg font-bold text-slate-900 sm:text-xl">
              Before you start
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Have these ready so you can complete your application in one go:
            </p>

            <ul className="mt-4 space-y-3">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                I don&apos;t have these
              </button>
              <form action={acceptApplyChecklist}>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark sm:w-auto"
                >
                  I have these, continue
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { rateCreator } from "../../actions";

export function StarRating({
  creatorId,
  initialRating,
}: {
  creatorId: string;
  initialRating: number | null;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(initialRating);
  const [isPending, startTransition] = useTransition();

  const display = hovered ?? current ?? 0;

  const handleRate = (star: number) => {
    setCurrent(star);
    startTransition(() => rateCreator(creatorId, star));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Rate this creator"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= display;
          return (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHovered(star)}
              disabled={isPending}
              className="group rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand disabled:cursor-wait"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.5}
                className={`h-7 w-7 transition-all duration-100 ${
                  filled
                    ? "text-amber-400 drop-shadow-sm"
                    : "text-slate-300 group-hover:text-amber-300"
                }`}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </button>
          );
        })}

        {current && (
          <span className="ml-2 text-sm font-semibold text-amber-600">
            {current}/5
          </span>
        )}
        {isPending && (
          <svg
            className="ml-1 h-4 w-4 animate-spin text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
        )}
      </div>
      {!current && (
        <p className="text-xs text-slate-400">Click a star to rate this creator</p>
      )}
    </div>
  );
}

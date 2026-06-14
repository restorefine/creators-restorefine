"use client";

import { useRef, useCallback, useEffect } from "react";

type Photo = {
  label: string;
  url: string | null;
  /** Suggested download filename, e.g. "JaneDoe-Front headshot.jpg" */
  downloadName: string;
};

function LightboxDialog({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open as modal when mounted
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();

    // Light-dismiss fallback for Safari (closedby="any" not yet supported)
    const handleClick = (e: MouseEvent) => {
      if (e.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    };
    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!photo.url) return;
    try {
      const res = await fetch(photo.url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = photo.downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      // Fallback: open in new tab
      window.open(photo.url, "_blank");
    }
  }, [photo]);

  return (
    <dialog
      ref={dialogRef}
      // closedby="any" for browsers that support it (Chrome 134+, Firefox 141+)
      // Safari fallback handled via the click listener above
      closedby="any"
      aria-label={`${photo.label} full view`}
      onClose={onClose}
      className="lightbox-dialog m-auto max-h-[95dvh] max-w-[95dvw] overflow-hidden rounded-2xl bg-transparent p-0 shadow-2xl"
    >
      <div className="relative flex flex-col items-center bg-[#0d0d0d]">
        {/* Header bar */}
        <div className="flex w-full items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-medium text-slate-300">{photo.label}</span>
          <div className="flex items-center gap-2">
            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              title="Download image"
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Download
            </button>

            {/* Close */}
            <form method="dialog">
              <button
                type="submit"
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Full image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url!}
          alt={photo.label}
          className="block max-h-[85dvh] max-w-[95dvw] object-contain"
        />
      </div>
    </dialog>
  );
}

export function PhotoGallery({
  photos,
  fullName,
}: {
  photos: { label: string; url: string | null }[];
  fullName: string;
}) {
  // Build download names: "{FirstLast}-{label}.{ext}"
  // Sanitise name for a safe filename
  const safeName = fullName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "");

  const enriched: Photo[] = photos.map(({ label, url }) => {
    let ext = "jpg";
    if (url) {
      const match = url.split("?")[0].match(/\.([a-zA-Z0-9]+)$/);
      if (match) ext = match[1].toLowerCase();
    }
    return {
      label,
      url,
      downloadName: `${safeName}-${label}.${ext}`,
    };
  });

  return (
    <>
      <style>{`
        /* Lightbox dialog animation */
        .lightbox-dialog {
          opacity: 0;
          transform: scale(0.92);
          transition-property: opacity, transform, display, overlay;
          transition-duration: 0.25s;
          transition-timing-function: ease-out;
          transition-behavior: allow-discrete;
        }
        .lightbox-dialog[open] {
          opacity: 1;
          transform: scale(1);
        }
        @starting-style {
          .lightbox-dialog[open] {
            opacity: 0;
            transform: scale(0.92);
          }
        }
        .lightbox-dialog::backdrop {
          background-color: rgba(0, 0, 0, 0);
          transition:
            display 0.25s allow-discrete,
            overlay 0.25s allow-discrete,
            background-color 0.25s ease-out;
        }
        .lightbox-dialog[open]::backdrop {
          background-color: rgba(0, 0, 0, 0.85);
        }
        @starting-style {
          .lightbox-dialog[open]::backdrop {
            background-color: rgba(0, 0, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lightbox-dialog {
            transform: none;
            transition-duration: 0.1s;
          }
        }
      `}</style>

      <div className="flex flex-wrap gap-6">
        {enriched.map((photo) => (
          <PhotoThumb key={photo.label} photo={photo} />
        ))}
      </div>
    </>
  );
}

function PhotoThumb({ photo }: { photo: Photo }) {
  const openRef = useRef<HTMLButtonElement>(null);
  const isOpen = useRef(false);

  const open = useCallback(() => {
    if (isOpen.current) return;
    isOpen.current = true;
    // We render the dialog via state — use a portal-free approach: append to body
    const container = document.createElement("div");
    document.body.appendChild(container);

    // Lazy import React to render into the container
    import("react-dom/client").then(({ createRoot }) => {
      const root = createRoot(container);
      const close = () => {
        root.unmount();
        container.remove();
        isOpen.current = false;
      };
      root.render(<LightboxDialog photo={photo} onClose={close} />);
    });
  }, [photo]);

  if (!photo.url) {
    return (
      <div key={photo.label}>
        <p className="mb-2 text-xs font-medium text-slate-500">{photo.label}</p>
        <div className="flex aspect-[4/5] w-40 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
          Unavailable
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-500">{photo.label}</p>
      <button
        ref={openRef}
        type="button"
        onClick={open}
        title={`View ${photo.label} full size`}
        className="group relative block overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.label}
          className="aspect-[4/5] w-40 rounded-xl object-cover transition duration-200 group-hover:scale-105 group-hover:brightness-90"
        />
        {/* Hover overlay */}
        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition duration-200 group-hover:bg-black/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="white"
            className="h-7 w-7 opacity-0 drop-shadow transition duration-200 group-hover:opacity-100"
            aria-hidden="true"
          >
            <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" />
          </svg>
        </span>
      </button>
    </div>
  );
}

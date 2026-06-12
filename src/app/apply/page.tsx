import { CreatorApplicationForm } from "./creator-application-form";

export default function ApplyPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-6 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fonts/restorefine-logoblack.svg"
            alt="RestoRefine"
            className="h-12 w-auto"
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <CreatorApplicationForm />
        </div>
      </div>
    </main>
  );
}

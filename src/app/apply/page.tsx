import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APPLY_ACCESS_COOKIE } from "@/lib/apply-access";
import { CreatorApplicationForm } from "./creator-application-form";

export default async function ApplyPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(APPLY_ACCESS_COOKIE)?.value !== "1") {
    redirect("/");
  }

  return (
    <main className="flex flex-1 justify-center bg-white px-4 pb-4 pt-5 sm:items-center sm:py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex justify-center sm:mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fonts/restorefine-logoblack.svg"
            alt="RestoRefine"
            className="h-8 w-auto sm:h-12"
          />
        </div>
        {/* Card chrome only on larger screens; phones get the full width */}
        <div className="sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:p-8 sm:shadow-sm">
          <CreatorApplicationForm />
        </div>
      </div>
    </main>
  );
}

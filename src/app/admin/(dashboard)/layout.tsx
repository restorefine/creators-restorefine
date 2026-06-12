import Link from "next/link";
import { signOut } from "../actions";
import { NavTabs } from "./nav-tabs";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fonts/restorefine-logoblack.svg"
                alt="RestoRefine"
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold text-slate-900">Admin</span>
            </Link>
            <NavTabs />
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

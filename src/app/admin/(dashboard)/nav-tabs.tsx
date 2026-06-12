"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Applications" },
  { href: "/admin/directory", label: "Directory" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active ? "bg-brand-light text-brand" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

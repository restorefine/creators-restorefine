import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [],
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

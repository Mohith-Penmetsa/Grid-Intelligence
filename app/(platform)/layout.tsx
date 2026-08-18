import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

// ─── Platform Metadata ────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Operations",
    template: "%s | GridIntel",
  },
};

// ─── Platform Shell Layout ────────────────────────────────────
/*
  All platform routes share this shell:
  - Fixed sidebar on the left
  - Topbar at the top (with breadcrumb)
  - Scrollable main content area
*/
export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

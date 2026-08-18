import type { Metadata } from "next";
import { APP_FULL_NAME, APP_DESCRIPTION } from "@/lib/constants";

// ─── Marketing Metadata ───────────────────────────────────────

export const metadata: Metadata = {
  title: APP_FULL_NAME,
  description: APP_DESCRIPTION,
};

// ─── Marketing Layout ─────────────────────────────────────────
/*
  Intentionally minimal — the cinematic landing page will control
  its own chrome. No sidebar, no topbar. Clean canvas.
*/
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

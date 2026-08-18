import type { Metadata } from "next";
import { APP_FULL_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { CinematicLanding } from "@/components/landing/CinematicLanding";

// ─── Metadata ─────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `${APP_FULL_NAME} — Electricity Inspection Intelligence`,
  description: APP_DESCRIPTION,
  keywords: [
    "electricity distribution",
    "inspection intelligence",
    "DISCOM",
    "commercial loss detection",
    "transformer analysis",
  ],
};

// ─── Landing Page ─────────────────────────────────────────────
// Server component wrapper — CinematicLanding handles client-side 3D.

export default function HomePage() {
  return <CinematicLanding />;
}

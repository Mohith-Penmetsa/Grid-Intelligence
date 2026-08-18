import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_FULL_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { TooltipProvider } from "@/components/ui/tooltip";

// ─── Fonts ────────────────────────────────────────────────────

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Root Metadata ────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: APP_FULL_NAME,
    template: `%s | GridIntel`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "electricity",
    "DISCOM",
    "inspection",
    "current theft",
    "distribution",
    "grid intelligence",
  ],
  authors: [{ name: "Grid Intelligence Platform" }],
  robots: {
    index: false, // Enterprise internal tool
    follow: false,
  },
};

// ─── Root Layout ──────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh m-0 p-0 antialiased overflow-x-hidden">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

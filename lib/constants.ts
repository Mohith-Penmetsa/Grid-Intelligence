// ============================================================
// Application-wide constants
// Grid Intelligence Platform
// ============================================================

import type { NavGroup } from "@/types";

export const APP_NAME = "GridIntel";
export const APP_FULL_NAME = "Grid Intelligence Platform";
export const APP_DESCRIPTION = "Enterprise electricity distribution inspection intelligence for DISCOM revenue and operations officers.";
export const APP_VERSION = "0.1.0";

export const ROUTES = {
  HOME: "/",
  OPERATIONS: "/operations",
  TRANSFORMERS: "/transformers",
  TRANSFORMER_DETAIL: (id: string) => `/transformers/${id}`,
  CONSUMERS: "/consumers",
  CONSUMER_DETAIL: (id: string) => `/consumers/${id}`,
  MAP: "/map",
  INSPECTIONS: "/inspections",
  INSPECTION_DETAIL: (id: string) => `/inspections/${id}`,
  WORKSPACE: "/workspace",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const;

export const PLATFORM_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Operations Center",
        href: ROUTES.OPERATIONS,
        icon: "LayoutDashboard",
        description: "Command view of all active operations",
      },
      {
        label: "Shared Grid Map",
        href: ROUTES.MAP,
        icon: "Map",
        description: "Spatial view of network risk",
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        label: "Transformer Intelligence",
        href: ROUTES.TRANSFORMERS,
        icon: "Zap",
        description: "Risk-ranked transformer analysis",
      },
      {
        label: "Consumer Intelligence",
        href: ROUTES.CONSUMERS,
        icon: "Users",
        description: "Consumer risk and anomaly signals",
      },
    ],
  },
  {
    label: "Field Operations",
    items: [
      {
        label: "Inspection Center",
        href: ROUTES.INSPECTIONS,
        icon: "ClipboardCheck",
        description: "Manage and track field inspections",
      },
      {
        label: "Inspector Workspace",
        href: ROUTES.WORKSPACE,
        icon: "Briefcase",
        description: "Execution environment for field officers",
      },
    ],
  },
  {
    label: "Analytics & Settings",
    items: [
      {
        label: "Reports",
        href: ROUTES.REPORTS,
        icon: "BarChart3",
        description: "Performance reports and analytics",
      },
      {
        label: "Settings",
        href: ROUTES.SETTINGS,
        icon: "Settings",
        description: "Configure system thresholds",
      },
    ],
  },
];


// ============================================================
// Application-wide constants
// Grid Intelligence Platform
// ============================================================

import type { NavGroup } from "@/types";

// ─── Application Metadata ────────────────────────────────────

export const APP_NAME = "GridIntel";
export const APP_FULL_NAME = "Grid Intelligence Platform";
export const APP_DESCRIPTION =
  "Enterprise electricity distribution inspection intelligence for DISCOM revenue and operations officers.";
export const APP_VERSION = "0.1.0";

// ─── Route Definitions ───────────────────────────────────────

export const ROUTES = {
  // Marketing
  HOME: "/",

  // Platform
  OPERATIONS: "/operations",
  TRANSFORMERS: "/transformers",
  TRANSFORMER_DETAIL: (id: string) => `/transformers/${id}`,
  CONSUMERS: "/consumers",
  CONSUMER_DETAIL: (id: string) => `/consumers/${id}`,
  INSPECTIONS: "/inspections",
  INSPECTION_DETAIL: (id: string) => `/inspections/${id}`,
  REPORTS: "/reports",
} as const;

// ─── Platform Navigation ──────────────────────────────────────

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
    label: "Inspection",
    items: [
      {
        label: "Inspection Center",
        href: ROUTES.INSPECTIONS,
        icon: "ClipboardCheck",
        description: "Manage and track field inspections",
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        label: "Reports",
        href: ROUTES.REPORTS,
        icon: "BarChart3",
        description: "Performance reports and analytics",
      },
    ],
  },
];

// ─── Risk Level Config ────────────────────────────────────────

export const RISK_CONFIG = {
  critical: {
    label: "Critical",
    color: "destructive",
    description: "Immediate inspection required",
  },
  high: {
    label: "High",
    color: "orange",
    description: "Schedule inspection within 48 hours",
  },
  medium: {
    label: "Medium",
    color: "yellow",
    description: "Schedule inspection this week",
  },
  low: {
    label: "Low",
    color: "blue",
    description: "Routine monitoring",
  },
  safe: {
    label: "Safe",
    color: "green",
    description: "No action required",
  },
} as const;

// ─── Inspection Status Config ─────────────────────────────────

export const INSPECTION_STATUS_CONFIG = {
  pending: { label: "Pending", color: "yellow" },
  assigned: { label: "Assigned", color: "blue" },
  in_progress: { label: "In Progress", color: "orange" },
  completed: { label: "Completed", color: "green" },
  cancelled: { label: "Cancelled", color: "gray" },
} as const;

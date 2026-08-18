// ============================================================
// Global TypeScript Type Declarations
// Grid Intelligence Platform
// ============================================================

// ─── Navigation ──────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
  badge?: string | number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Status & Risk ───────────────────────────────────────────

export type RiskLevel = "critical" | "high" | "medium" | "low" | "safe";

export type InspectionStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type AssetStatus = "active" | "inactive" | "maintenance" | "fault";

// ─── Entities ────────────────────────────────────────────────

export interface Feeder {
  id: string;
  name: string;
  zone: string;
  voltage: number; // kV
  status: AssetStatus;
}

export interface Transformer {
  id: string;
  name: string;
  feederId: string;
  zone: string;
  capacity: number; // kVA
  riskLevel: RiskLevel;
  riskScore: number; // 0–100
  commercialLoss: number; // percentage
  connectedConsumers: number;
  status: AssetStatus;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Consumer {
  id: string;
  name: string;
  accountNumber: string;
  transformerId: string;
  zone: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0–100
  consumptionTrend: "increasing" | "decreasing" | "stable" | "anomalous";
  lastReading: string; // ISO date
}

export interface Inspector {
  id: string;
  name: string;
  badge: string;
  zone: string;
  availability: "available" | "on_duty" | "off_duty";
  activeInspections: number;
}

export interface Inspection {
  id: string;
  transformerId?: string;
  consumerId?: string;
  inspectorId?: string;
  status: InspectionStatus;
  priority: RiskLevel;
  scheduledDate?: string; // ISO date
  completedDate?: string; // ISO date
  outcome?: InspectionOutcome;
}

export interface InspectionOutcome {
  theftConfirmed: boolean;
  violationType?: string;
  evidenceCount: number;
  penaltyAmount?: number;
  notes: string;
}

// ─── Risk Signals (Explainability) ───────────────────────────

export interface RiskSignal {
  id: string;
  label: string;
  description: string;
  contribution: number; // 0–100, relative weight
  direction: "positive" | "negative"; // positive = increases risk
  value: string | number;
  unit?: string;
}

// ─── Page Props ───────────────────────────────────────────────

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ─── API Response Shape (future use) ─────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FilterParams {
  riskLevel?: RiskLevel;
  zone?: string;
  status?: string;
  search?: string;
}

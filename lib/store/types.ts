export type RiskLevel = "critical" | "high" | "medium" | "low" | "safe";
export type InspectionStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
export type InspectionPriority = "critical" | "high" | "medium" | "low";

export interface Settings {
  transformerRiskThreshold: number; // e.g. 80 for critical
  consumerRiskThreshold: number; // e.g. 80
  inspectionPriorityThreshold: number; // e.g. 70
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Transformer {
  id: string;
  area: string;
  coordinates: Coordinates;
  input: number;
  techLoss: number;
  consumed: number;
  commLoss: number;
  consumerIds: string[];
  inspectionIds: string[];
}

export interface Consumer {
  id: string;
  transformerId: string;
  meterId: string;
  area: string;
  coordinates: Coordinates;
  expectedConsumption: number;
  actualConsumption: number;
  tamperEvents: number;
}

export interface Officer {
  id: string;
  name: string;
  role: string;
}

export interface EvidenceMedia {
  id: string;
  url: string;
  timestamp: string;
  caption?: string;
}

export interface FieldEvidenceItem {
  id: string;
  key: string;
  label: string;
  status: "pending" | "verified";
  media: EvidenceMedia[];
}

export interface InspectionOutcome {
  id: string;
  inspectionId: string;
  actualFinding: "no_issue" | "meter_issue" | "billing_issue" | "tampering" | "illegal_connection" | "seal_violation" | "other";
  confirmed: boolean;
  timestamp: string;
}

export interface Inspection {
  id: string;
  transformerId: string;
  consumerIds: string[];
  officerId: string | null;
  status: InspectionStatus;
  priority: InspectionPriority;
  triggerReason: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  evidence: FieldEvidenceItem[];
  outcomeId?: string | null;
  
  // Human observations stored natively in inspection state
  fieldObservations?: string;
  
  // Snapshots of the AI prediction at the time of creation (closed-loop)
  actualFinding?: string;
  predictedRiskType?: string;
  predictedRiskScore?: number;
  predictedReasons?: string[];
}

export interface RiskDriver {
  name: string;
  contribution: number;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  drivers: RiskDriver[];
  readinessScore?: number;
}


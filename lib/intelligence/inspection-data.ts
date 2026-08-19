export type InspectionPriority = "critical" | "high" | "medium" | "low";
export type InspectionStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";

export interface FieldEvidenceItem {
  key: string;
  label: string;
  status: "pending" | "flagged" | "verified" | "not_applicable";
  notes?: string;
}

export interface InspectionData {
  id: string;
  consumerId: string;
  triggerReason: string;
  riskScore: number;
  priority: InspectionPriority;
  status: InspectionStatus;
  assignedOfficer: string | null;
  createdAt: string;
  // Field data
  evidence: FieldEvidenceItem[];
  officerNotes?: string;
}

export const MOCK_OFFICERS = [
  "Ravi Kumar",
  "Suresh Babu",
  "Anil Kumar",
  "Priya Rao",
];

export const MOCK_INSPECTIONS: InspectionData[] = [
  {
    id: "INS-2041",
    consumerId: "C-9021",
    triggerReason: "Abnormal consumption deviation",
    riskScore: 95,
    priority: "critical",
    status: "pending",
    assignedOfficer: null,
    createdAt: "2026-08-18T10:30:00Z",
    evidence: [
      { key: "meter_reading", label: "Meter reading verification", status: "pending" },
      { key: "meter_seal", label: "Meter seal / tampering inspection", status: "pending" },
      { key: "service_conn", label: "Service connection inspection", status: "pending" },
      { key: "load_check", label: "Load vs sanctioned load", status: "pending" },
      { key: "physical_wiring", label: "Physical wiring inspection", status: "pending" },
      { key: "bypass_check", label: "Bypass / illegal connection check", status: "pending" },
    ]
  },
  {
    id: "INS-2042",
    consumerId: "C-9044",
    triggerReason: "Historical pattern change",
    riskScore: 78,
    priority: "high",
    status: "assigned",
    assignedOfficer: "Ravi Kumar",
    createdAt: "2026-08-17T14:15:00Z",
    evidence: [
      { key: "meter_reading", label: "Meter reading verification", status: "verified" },
      { key: "meter_seal", label: "Meter seal / tampering inspection", status: "pending" },
      { key: "service_conn", label: "Service connection inspection", status: "pending" },
      { key: "load_check", label: "Load vs sanctioned load", status: "pending" },
      { key: "physical_wiring", label: "Physical wiring inspection", status: "pending" },
      { key: "bypass_check", label: "Bypass / illegal connection check", status: "pending" },
    ]
  },
  {
    id: "INS-2035",
    consumerId: "C-9011",
    triggerReason: "Elevated commercial loss correlation",
    riskScore: 65,
    priority: "high",
    status: "in_progress",
    assignedOfficer: "Suresh Babu",
    createdAt: "2026-08-16T09:00:00Z",
    evidence: [
      { key: "meter_reading", label: "Meter reading verification", status: "verified", notes: "Reading matches" },
      { key: "meter_seal", label: "Meter seal / tampering inspection", status: "flagged", notes: "Seal broken" },
      { key: "service_conn", label: "Service connection inspection", status: "verified" },
      { key: "load_check", label: "Load vs sanctioned load", status: "pending" },
      { key: "physical_wiring", label: "Physical wiring inspection", status: "pending" },
      { key: "bypass_check", label: "Bypass / illegal connection check", status: "pending" },
    ]
  },
  {
    id: "INS-2022",
    consumerId: "C-9088",
    triggerReason: "Routine check",
    riskScore: 22,
    priority: "low",
    status: "completed",
    assignedOfficer: "Priya Rao",
    createdAt: "2026-08-10T11:20:00Z",
    officerNotes: "All seals intact. Normal load.",
    evidence: [
      { key: "meter_reading", label: "Meter reading verification", status: "verified" },
      { key: "meter_seal", label: "Meter seal / tampering inspection", status: "verified" },
      { key: "service_conn", label: "Service connection inspection", status: "verified" },
      { key: "load_check", label: "Load vs sanctioned load", status: "verified" },
      { key: "physical_wiring", label: "Physical wiring inspection", status: "verified" },
      { key: "bypass_check", label: "Bypass / illegal connection check", status: "verified" },
    ]
  },
];


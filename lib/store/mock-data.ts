import { Transformer, Consumer, Inspection, Officer, Settings, InspectionOutcome } from "./types";

export const INITIAL_SETTINGS: Settings = {
  transformerRiskThreshold: 80,
  consumerRiskThreshold: 80,
  inspectionPriorityThreshold: 75,
};

export const MOCK_OFFICERS: Officer[] = [
  { id: "O-01", name: "Ravi Kumar", role: "Inspector" },
  { id: "O-02", name: "Suresh Babu", role: "Inspector" },
  { id: "O-03", name: "Anil Kumar", role: "Inspector" },
  { id: "O-04", name: "Priya Rao", role: "Inspector" },
];

export const INITIAL_TRANSFORMERS: Transformer[] = [
  {
    id: "TR-104",
    area: "Bhimavaram Zone 4",
    coordinates: { lat: 16.5449, lng: 81.5212 },
    input: 1200,
    techLoss: 40,
    consumed: 1080,
    commLoss: 80,
    consumerIds: ["C-104", "C-087", "C-019", "C-201"],
    inspectionIds: ["INS-2041"]
  },
  {
    id: "TR-106",
    area: "Amalapuram Sector 2",
    coordinates: { lat: 16.5770, lng: 82.0039 },
    input: 950,
    techLoss: 30,
    consumed: 880,
    commLoss: 40,
    consumerIds: ["C-9044", "C-302"],
    inspectionIds: ["INS-2042"]
  },
  {
    id: "TR-102",
    area: "Kakinada Industrial",
    coordinates: { lat: 16.9891, lng: 82.2475 },
    input: 3000,
    techLoss: 90,
    consumed: 2880,
    commLoss: 30,
    consumerIds: ["C-9088", "C-444"],
    inspectionIds: ["INS-2022"]
  },
  {
    id: "TR-105",
    area: "Rajahmundry Central",
    coordinates: { lat: 17.0005, lng: 81.8040 },
    input: 2100,
    techLoss: 70,
    consumed: 1980,
    commLoss: 50,
    consumerIds: ["C-9011"],
    inspectionIds: ["INS-2035"]
  }
];

export const INITIAL_CONSUMERS: Consumer[] = [
  { id: "C-104", transformerId: "TR-104", meterId: "MTR-88219A", area: "Bhimavaram Zone 4", coordinates: { lat: 16.5451, lng: 81.5215 }, expectedConsumption: 420, actualConsumption: 85, tamperEvents: 1 },
  { id: "C-087", transformerId: "TR-104", meterId: "MTR-88220A", area: "Bhimavaram Zone 4", coordinates: { lat: 16.5448, lng: 81.5210 }, expectedConsumption: 300, actualConsumption: 120, tamperEvents: 0 },
  { id: "C-019", transformerId: "TR-104", meterId: "MTR-88221A", area: "Bhimavaram Zone 4", coordinates: { lat: 16.5445, lng: 81.5208 }, expectedConsumption: 180, actualConsumption: 90, tamperEvents: 0 },
  { id: "C-201", transformerId: "TR-104", meterId: "MTR-88222A", area: "Bhimavaram Zone 4", coordinates: { lat: 16.5453, lng: 81.5218 }, expectedConsumption: 260, actualConsumption: 245, tamperEvents: 0 },
  { id: "C-9044", transformerId: "TR-106", meterId: "MTR-9044B", area: "Amalapuram Sector 2", coordinates: { lat: 16.5772, lng: 82.0042 }, expectedConsumption: 600, actualConsumption: 410, tamperEvents: 0 },
  { id: "C-302", transformerId: "TR-106", meterId: "MTR-302B", area: "Amalapuram Sector 2", coordinates: { lat: 16.5768, lng: 82.0035 }, expectedConsumption: 320, actualConsumption: 470, tamperEvents: 0 },
  { id: "C-9011", transformerId: "TR-105", meterId: "MTR-9011X", area: "Rajahmundry Central", coordinates: { lat: 17.0010, lng: 81.8045 }, expectedConsumption: 1200, actualConsumption: 1050, tamperEvents: 0 },
  { id: "C-9088", transformerId: "TR-102", meterId: "MTR-9088Y", area: "Kakinada Industrial", coordinates: { lat: 16.9895, lng: 82.2480 }, expectedConsumption: 2800, actualConsumption: 2880, tamperEvents: 0 },
  { id: "C-444", transformerId: "TR-102", meterId: "MTR-444Y", area: "Kakinada Industrial", coordinates: { lat: 16.9888, lng: 82.2470 }, expectedConsumption: 110, actualConsumption: 0, tamperEvents: 0 }
];

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: "INS-2041",
    transformerId: "TR-104",
    consumerIds: ["C-104", "C-087", "C-019"],
    officerId: null,
    status: "pending",
    priority: "critical",
    triggerReason: "Elevated commercial loss & anomalous consumption",
    predictedRiskType: "tampering",
    predictedRiskScore: 95,
    predictedReasons: ["Severe input-output mismatch", "Known tampering hotspots nearby"],
    createdAt: "2026-08-18T10:30:00Z",
    evidence: [
      { id: "ev-1", key: "meter_reading", label: "Meter reading verification", status: "pending", media: [] },
      { id: "ev-2", key: "meter_seal", label: "Meter seal / tampering inspection", status: "pending", media: [] },
      { id: "ev-3", key: "bypass_check", label: "Bypass / illegal connection check", status: "pending", media: [] },
      { id: "ev-add", key: "additional_site_evidence", label: "Additional Site Evidence", status: "pending", media: [] },
    ]
  },
  {
    id: "INS-2042",
    transformerId: "TR-106",
    consumerIds: ["C-9044"],
    officerId: "O-01",
    status: "assigned",
    priority: "high",
    triggerReason: "Historical pattern change",
    createdAt: "2026-08-17T14:15:00Z",
    evidence: [
      { id: "ev-4", key: "meter_reading", label: "Meter reading verification", status: "verified", media: [] },
      { id: "ev-5", key: "meter_seal", label: "Meter seal / tampering inspection", status: "pending", media: [] },
      { id: "ev-add2", key: "additional_site_evidence", label: "Additional Site Evidence", status: "pending", media: [] },
    ]
  },
  {
    id: "INS-2022",
    transformerId: "TR-102",
    consumerIds: ["C-9088"],
    officerId: "O-04",
    status: "completed",
    priority: "low",
    triggerReason: "Routine check",
    createdAt: "2026-08-10T11:20:00Z",
    outcomeId: "OUT-2022",
    actualFinding: "no_issue",
    fieldObservations: "All seals intact. Normal load.",
    predictedRiskType: "no_issue",
    predictedRiskScore: 30,
    evidence: [
      { id: "ev-6", key: "meter_reading", label: "Meter reading verification", status: "verified", media: [] },
      { id: "ev-7", key: "meter_seal", label: "Meter seal / tampering inspection", status: "verified", media: [] },
      { id: "ev-add3", key: "additional_site_evidence", label: "Additional Site Evidence", status: "pending", media: [] },
    ]
  }
];

export const INITIAL_OUTCOMES: InspectionOutcome[] = [
  {
    id: "OUT-2022",
    inspectionId: "INS-2022",
    actualFinding: "no_issue",
    confirmed: true,
    timestamp: "2026-08-10T13:45:00Z"
  }
];



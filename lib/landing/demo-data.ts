// ─── Illustrative Demo Data ───────────────────────────────────
// ALL DATA IN THIS FILE IS ILLUSTRATIVE AND FOR DEMONSTRATION ONLY.
// It is clearly labelled and isolated here so it can be replaced
// by live API data in a future milestone without touching component code.

// ─── Scene 3: Transformer Energy Analysis ─────────────────────

export const DEMO_TRANSFORMER_ENERGY = {
  id: "TR-104",
  label: "Transformer TR-104",
  note: "Illustrative data only",
  input: 1200,
  consumerConsumption: 1080,
  technicalLoss: 40,
  commercialLoss: 80,
  unit: "units",
} as const;

// ─── Scene 5: Transformer Risk Rankings ───────────────────────

export interface DemoTransformerRisk {
  id: string;
  riskScore: number;
  commercialLossPercent: number;
  priority?: number;
}

export const DEMO_TRANSFORMER_RISKS: DemoTransformerRisk[] = [
  { id: "TR-101", riskScore: 31, commercialLossPercent: 4 },
  { id: "TR-102", riskScore: 42, commercialLossPercent: 7 },
  { id: "TR-103", riskScore: 28, commercialLossPercent: 3 },
  { id: "TR-104", riskScore: 95, commercialLossPercent: 21, priority: 1 },
  { id: "TR-105", riskScore: 37, commercialLossPercent: 5 },
  { id: "TR-106", riskScore: 44, commercialLossPercent: 8 },
];

// ─── Scene 6: Consumer Overview ───────────────────────────────

export const DEMO_CONSUMER_OVERVIEW = {
  transformerId: "TR-104",
  totalConsumers: 287,
  focusedCount: 4,
  note: "Illustrative data only",
} as const;

// ─── Scene 7: Explainable Risk Signals ────────────────────────

export interface DemoRiskSignal {
  label: string;
  shortLabel: string;
  contribution: number; // 0–100 weight
  direction: "risk" | "neutral";
}

export const DEMO_CONSUMER_RISK = {
  id: "C-014",
  label: "Consumer C-014",
  riskScore: 94,
  riskLabel: "HIGH",
  note: "Illustrative data only — signals contributing to inspection priority",
  signals: [
    {
      label: "Consumption deviation from historical baseline",
      shortLabel: "Consumption Deviation",
      contribution: 34,
      direction: "risk",
    },
    {
      label: "Transformer commercial loss pattern",
      shortLabel: "Loss Pattern",
      contribution: 28,
      direction: "risk",
    },
    {
      label: "Anomalous reading sequence",
      shortLabel: "Reading Anomaly",
      contribution: 22,
      direction: "risk",
    },
    {
      label: "Tamper event recorded",
      shortLabel: "Tamper Event",
      contribution: 16,
      direction: "risk",
    },
  ] as DemoRiskSignal[],
} as const;

// ─── Scene 8: Priority List ───────────────────────────────────

export interface DemoPriorityItem {
  rank: number;
  consumerId: string;
  riskScore: number;
  riskLabel: "HIGH" | "MEDIUM" | "LOW";
}

export const DEMO_PRIORITY_LIST: DemoPriorityItem[] = [
  { rank: 1, consumerId: "C-014", riskScore: 94, riskLabel: "HIGH" },
  { rank: 2, consumerId: "C-027", riskScore: 91, riskLabel: "HIGH" },
  { rank: 3, consumerId: "C-081", riskScore: 87, riskLabel: "HIGH" },
  { rank: 4, consumerId: "C-112", riskScore: 76, riskLabel: "MEDIUM" },
];

// ─── Scene 9: Inspection Assignment ─────────────────────────

export const DEMO_INSPECTION_CARD = {
  priority: 1,
  transformerId: "TR-104",
  consumerId: "C-014",
  riskPercent: 94,
  note: "Illustrative data only",
} as const;

import { TransformerData, MOCK_TRANSFORMERS } from "./transformer-data";
import { RiskLevel } from "@/types";

export interface AnomalySignal {
  signal: string;
  severity: RiskLevel;
  observedValue: string;
  expectedValue: string;
  contribution: "high" | "medium" | "low";
}

export interface RiskAnalysis {
  data: TransformerData;
  commercialLossPercentage: number;
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  explanation: string;
  factors: { name: string; contribution: number }[];
  anomalies: AnomalySignal[];
}

export function analyzeTransformerRisk(data: TransformerData): RiskAnalysis {
  // Deterministic calculation for now
  const commLossPercentage = (data.commLoss / data.input) * 100;
  const techLossPercentage = (data.techLoss / data.input) * 100;
  const expectedAvailable = data.input - data.techLoss;
  
  let riskScore = 0;
  let riskLevel: RiskLevel = "safe";
  let confidence = 0;

  // Mock ML scoring
  if (commLossPercentage > 5) {
    riskScore = 95;
    riskLevel = "critical";
    confidence = 92;
  } else if (commLossPercentage > 3) {
    riskScore = 75;
    riskLevel = "high";
    confidence = 89;
  } else if (commLossPercentage > 2.5) {
    riskScore = 44;
    riskLevel = "medium";
    confidence = 88;
  } else if (commLossPercentage > 1) {
    riskScore = 42;
    riskLevel = "medium";
    confidence = 85;
  } else if (commLossPercentage > 0.4) {
    riskScore = 37;
    riskLevel = "safe"; // Normal
    confidence = 90;
  } else if (commLossPercentage > 0.3) {
    riskScore = 31;
    riskLevel = "safe";
    confidence = 91;
  } else {
    riskScore = 28;
    riskLevel = "safe";
    confidence = 95;
  }

  // Anomalies
  const anomalies: AnomalySignal[] = [];
  const isHighRisk: boolean = riskLevel === "critical" || riskLevel === "high";
  if (isHighRisk) {
    anomalies.push({
      signal: "Elevated commercial loss",
      severity: "critical",
      observedValue: `${commLossPercentage.toFixed(1)}%`,
      expectedValue: "< 1.5%",
      contribution: "high",
    });
    anomalies.push({
      signal: "Consumption below expected",
      severity: "high",
      observedValue: `${data.consumed} units`,
      expectedValue: `~${expectedAvailable} units`,
      contribution: "high",
    });
  }

  // Factors
  const factors = [];
  if (commLossPercentage > 2) {
    factors.push({ name: "Commercial loss deviation", contribution: 60 });
    factors.push({ name: "Energy reconciliation gap", contribution: 30 });
    factors.push({ name: "Abnormal consumption pattern", contribution: 10 });
  } else {
    factors.push({ name: "Nominal grid operations", contribution: 100 });
  }

  // Explanation
  let explanation = "";
  if (riskLevel === "critical" || riskLevel === "high") {
    explanation = `${data.id} shows a significant unexplained energy gap after accounting for expected technical losses. The transformer records ${data.consumed} units of consumer consumption against approximately ${expectedAvailable} units of expected available energy, leaving ${data.commLoss} units of unexplained commercial loss.`;
  } else if (riskLevel === "medium") {
    explanation = `${data.id} displays moderate commercial losses. The unexplained gap of ${data.commLoss} units represents ${commLossPercentage.toFixed(1)}% of input, which exceeds the baseline threshold for this zone.`;
  } else {
    explanation = `${data.id} is operating within normal expected parameters. Technical losses are nominal and commercial loss (${data.commLoss} units) is negligible.`;
  }

  return {
    data,
    commercialLossPercentage: commLossPercentage,
    riskScore,
    riskLevel,
    confidence,
    explanation,
    factors,
    anomalies,
  };
}

export function getAllAnalyzedTransformers(): RiskAnalysis[] {
  return MOCK_TRANSFORMERS.map(analyzeTransformerRisk).sort((a: RiskAnalysis, b: RiskAnalysis) => b.riskScore - a.riskScore);
}


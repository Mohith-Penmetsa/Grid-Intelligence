import { ConsumerData, MOCK_CONSUMERS } from "./consumer-data";
import { RiskLevel } from "@/types";

export interface ConsumerAnomalySignal {
  signal: string;
  severity: RiskLevel;
  observedValue: string;
  expectedValue: string;
}

export interface ConsumerRiskAnalysis {
  data: ConsumerData;
  deviation: number;
  deviationPercentage: number;
  commercialLossExposure: number;
  riskScore: number;
  riskLevel: RiskLevel;
  anomalies: ConsumerAnomalySignal[];
  factors: { name: string; contribution: number }[];
}

export function analyzeConsumerRisk(data: ConsumerData): ConsumerRiskAnalysis {
  const deviation = data.expectedConsumption - data.actualConsumption;
  const deviationPercentage = data.expectedConsumption > 0 ? (deviation / data.expectedConsumption) * 100 : 0;
  
  // Deterministic scoring for demo
  let riskScore = 0;
  let riskLevel: RiskLevel = "safe";

  if (deviationPercentage > 50) {
    riskScore = 92;
    riskLevel = "critical";
  } else if (deviationPercentage > 30) {
    riskScore = 78;
    riskLevel = "high";
  } else if (deviationPercentage > 15) {
    riskScore = 55;
    riskLevel = "medium";
  } else if (deviationPercentage > 5) {
    riskScore = 32;
    riskLevel = "low";
  } else {
    riskScore = 12;
    riskLevel = "safe";
  }

  // Anomalies
  const anomalies: ConsumerAnomalySignal[] = [];
  if (deviationPercentage > 30) {
    anomalies.push({
      signal: "Sudden consumption pattern change",
      severity: "high",
      observedValue: `${data.actualConsumption} units`,
      expectedValue: `${data.expectedConsumption} units`,
    });
  }
  if (deviation > 100) {
    anomalies.push({
      signal: "High absolute deviation from baseline",
      severity: "critical",
      observedValue: `-${deviation} units`,
      expectedValue: `�20 units max variance`,
    });
  }

  // Factors
  const factors = [];
  if (deviationPercentage > 20) {
    factors.push({ name: "Consumption deviation", contribution: 55 });
    factors.push({ name: "Historical pattern change", contribution: 30 });
    factors.push({ name: "Transformer-level commercial loss correlation", contribution: 15 });
  } else {
    factors.push({ name: "Normal seasonal variance", contribution: 100 });
  }

  return {
    data,
    deviation,
    deviationPercentage,
    commercialLossExposure: deviation > 0 ? deviation : 0,
    riskScore,
    riskLevel,
    anomalies,
    factors,
  };
}

export function getAllAnalyzedConsumers(): ConsumerRiskAnalysis[] {
  return MOCK_CONSUMERS.map(analyzeConsumerRisk).sort((a: ConsumerRiskAnalysis, b: ConsumerRiskAnalysis) => b.riskScore - a.riskScore);
}


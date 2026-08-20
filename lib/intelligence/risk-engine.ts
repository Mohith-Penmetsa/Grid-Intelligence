import { Transformer, Consumer, Inspection, RiskAssessment, Settings, RiskDriver, RiskLevel } from "@/lib/store/types";

export function calculateConsumerRisk(consumer: Consumer, settings: Settings): RiskAssessment {
  const deviation = consumer.expectedConsumption - consumer.actualConsumption;
  const deviationPercentage = consumer.expectedConsumption > 0 ? (deviation / consumer.expectedConsumption) * 100 : 0;
  
  let score = 0;
  let level: RiskLevel = "safe";
  const drivers: RiskDriver[] = [];

  // Deterministic scoring for demo
  if (deviationPercentage > 50 || consumer.tamperEvents > 0) {
    score = Math.max(92, consumer.tamperEvents > 0 ? 98 : 0);
    level = "critical";
  } else if (deviationPercentage > 30) {
    score = 78;
    level = "high";
  } else if (deviationPercentage > 15) {
    score = 55;
    level = "medium";
  } else if (deviationPercentage > 5) {
    score = 32;
    level = "low";
  } else {
    score = 12;
    level = "safe";
  }

  // Adjust by settings
  if (score >= settings.consumerRiskThreshold) {
    level = "critical";
  } else if (score >= settings.consumerRiskThreshold - 20) {
    level = "high";
  }

  if (deviationPercentage > 20) {
    drivers.push({ name: "Consumption deviation", contribution: 55 });
  }
  if (consumer.tamperEvents > 0) {
    drivers.push({ name: "Tamper event reported", contribution: 40 });
  }
  if (drivers.length === 0) {
    drivers.push({ name: "Normal seasonal variance", contribution: 100 });
  }

  return { score, level, drivers };
}

export function calculateTransformerRisk(transformer: Transformer, consumers: Consumer[], settings: Settings): RiskAssessment {
  const commLossPercentage = (transformer.commLoss / transformer.input) * 100;
  
  let score = 0;
  let level: RiskLevel = "safe";
  const drivers: RiskDriver[] = [];

  // Aggregate consumer risk
  const connectedConsumers = consumers.filter(c => c.transformerId === transformer.id);
  const highRiskConsumersCount = connectedConsumers.filter(c => {
    const cRisk = calculateConsumerRisk(c, settings);
    return cRisk.level === "critical" || cRisk.level === "high";
  }).length;

  if (commLossPercentage > 5 || highRiskConsumersCount >= 3) {
    score = 95;
    level = "critical";
  } else if (commLossPercentage > 3 || highRiskConsumersCount >= 1) {
    score = 75;
    level = "high";
  } else if (commLossPercentage > 2.5) {
    score = 44;
    level = "medium";
  } else if (commLossPercentage > 1) {
    score = 42;
    level = "medium";
  } else if (commLossPercentage > 0.4) {
    score = 37;
    level = "low";
  } else {
    score = 28;
    level = "safe";
  }

  // Adjust by settings
  if (score >= settings.transformerRiskThreshold) {
    level = "critical";
  } else if (score >= settings.transformerRiskThreshold - 20) {
    level = "high";
  }

  if (commLossPercentage > 2) {
    drivers.push({ name: "Commercial loss deviation", contribution: 60 });
  }
  if (highRiskConsumersCount > 0) {
    drivers.push({ name: "High-risk connected consumers", contribution: 30 });
  }
  if (drivers.length === 0) {
    drivers.push({ name: "Nominal grid operations", contribution: 100 });
  }

  // Inspection Readiness
  const readinessScore = Math.min(100, score + (highRiskConsumersCount * 5));

  return { score, level, drivers, readinessScore };
}

export function calculateInspectionPriority(transformer: Transformer, risk: RiskAssessment, settings: Settings): "critical" | "high" | "medium" | "low" {
  if (risk.score >= settings.inspectionPriorityThreshold) {
    return "critical";
  }
  if (risk.score >= settings.inspectionPriorityThreshold - 15) {
    return "high";
  }
  if (risk.score >= settings.inspectionPriorityThreshold - 30) {
    return "medium";
  }
  return "low";
}

export function getPriorityConsumers(transformerId: string, consumers: Consumer[], settings: Settings): Consumer[] {
  const connected = consumers.filter(c => c.transformerId === transformerId);
  return connected.sort((a, b) => {
    return calculateConsumerRisk(b, settings).score - calculateConsumerRisk(a, settings).score;
  });
}


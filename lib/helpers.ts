// ============================================================
// Shared utility helpers
// Grid Intelligence Platform
// ============================================================

import type { RiskLevel } from "@/types";

// cn() is already exported from lib/utils.ts (shadcn-generated)
// This file extends it with domain-specific helpers.

/**
 * Formats a risk score (0–100) to a display-friendly string.
 */
export function formatRiskScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Returns the risk level bucket for a given numeric score.
 */
export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  if (score >= 30) return "low";
  return "safe";
}

/**
 * Formats a large number with locale-aware commas.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

/**
 * Formats a currency amount in Indian Rupees.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a percentage value to a fixed decimal string.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats an ISO date string to a human-readable format.
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
}

/**
 * Formats an ISO date string to a relative time label (e.g. "2 days ago").
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(isoDate);
}

/**
 * Truncates a string to a max length, appending ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

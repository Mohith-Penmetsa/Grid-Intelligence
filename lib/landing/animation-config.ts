// ─── Animation Configuration ──────────────────────────────────
// GSAP timeline values, easing presets, duration constants.
// Centralized here so they're easy to tune without digging into components.

export const ANIMATION_CONFIG = {
  // Master timeline total duration (arbitrary units, scrubbed)
  timelineTotal: 100,

  // Scrub lag in seconds (higher = smoother/lazier camera)
  scrubLag: 1,

  // Standard easing presets
  ease: {
    cameraMove: "power2.inOut",
    textReveal: "power3.out",
    textFade: "power2.inOut",
    scaleUp: "back.out(1.4)",
    scaleDown: "power2.in",
    floatIn: "power3.out",
  },

  // Duration (in timeline units) for each transition
  transitions: {
    cameraMove: 8,
    textFade: 3,
    textReveal: 4,
    objectReveal: 5,
    objectFade: 3,
    networkBuild: 10,
  },

  // Intro animation (auto-play before scroll, not scroll-driven)
  intro: {
    pulseDelay: 0.8,
    pulseDuration: 2.0,
    titleRevealDelay: 1.5,
    titleRevealStagger: 0.08,
    subtitleDelay: 2.2,
  },
} as const;

// ─── Scene boundary types ─────────────────────────────────────

export interface SceneRange {
  start: number; // 0–100 in timeline units
  end: number;
}

// Maps scene names to their timeline ranges
export const SCENE_RANGES: Record<string, SceneRange> = {
  intro: { start: 0, end: 5 },
  network: { start: 5, end: 18 },
  transformer: { start: 18, end: 32 },
  loss: { start: 32, end: 41 },
  risk: { start: 41, end: 50 },
  consumer: { start: 50, end: 60 },
  explainable: { start: 60, end: 68 },
  priority: { start: 68, end: 78 },
  inspection: { start: 78, end: 88 },
  closedLoop: { start: 88, end: 100 },
};

// ─── Power flow particle config ──────────────────────────────

export const POWER_FLOW_CONFIG = {
  particlesPerLine: 6,
  particleSize: 0.06,
  baseSpeed: 0.4, // loops per second
  activeSpeed: 0.9,
} as const;

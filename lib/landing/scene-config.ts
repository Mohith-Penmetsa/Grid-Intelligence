// ─── Scene Configuration ──────────────────────────────────────
import * as THREE from "three";

// ─── Color palette ────────────────────────────────────────────

export const COLORS = {
  background: new THREE.Color(0x07111A), // Deep navy / charcoal
  fog: new THREE.Color(0x07111A),
  feeder: new THREE.Color(0x00C8FF),
  feederEmissive: new THREE.Color(0x00C8FF),
  transformer: new THREE.Color(0x283C4D),
  transformerEmissive: new THREE.Color(0x000000),
  transformerHighlight: new THREE.Color(0x39D9FF),
  transformerHighlightEmissive: new THREE.Color(0x39D9FF),
  consumerNormal: new THREE.Color(0x344A5A),
  consumerNormalEmissive: new THREE.Color(0x000000),
  consumerHighlight: new THREE.Color(0xFF6A3D),
  consumerHighlightEmissive: new THREE.Color(0xFF6A3D),
  consumerCritical: new THREE.Color(0xFF453A),
  consumerCriticalEmissive: new THREE.Color(0xFF453A),
  powerFlow: new THREE.Color(0x168BFF),
  powerFlowIntense: new THREE.Color(0x39D9FF),
  connectionNormal: new THREE.Color(0x263746),
  connectionActive: new THREE.Color(0x00C8FF),
  electricBlue: new THREE.Color(0x00C8FF),
  riskAmber: new THREE.Color(0xFFB020),
  safeGreen: new THREE.Color(0x31D17C),
} as const;

// ─── Feeder ───────────────────────────────────────────────────

export const FEEDER_CONFIG = {
  position: new THREE.Vector3(0, 0, 0),
  scale: 0.7,
  glowIntensity: 3.0,
} as const;

// ─── Transformers ─────────────────────────────────────────────

export interface TransformerConfig {
  id: string;
  position: THREE.Vector3;   // home position in the network
  scale: THREE.Vector3;
  riskScore: number;
  isTarget: boolean;
  index: number;
}

export const TRANSFORMER_CONFIGS: TransformerConfig[] = [
  // Distributed along a main avenue (Z axis)
  { id: "TR-101", position: new THREE.Vector3(-2, 0,  15), scale: new THREE.Vector3(0.5, 0.5, 0.5), riskScore: 31, isTarget: false, index: 0 },
  { id: "TR-102", position: new THREE.Vector3( 2, 0,  30), scale: new THREE.Vector3(0.5, 0.5, 0.5), riskScore: 42, isTarget: false, index: 1 },
  { id: "TR-103", position: new THREE.Vector3(-2, 0,  45), scale: new THREE.Vector3(0.5, 0.5, 0.5), riskScore: 28, isTarget: false, index: 2 },
  { id: "TR-104", position: new THREE.Vector3( 2, 0,  60), scale: new THREE.Vector3(0.65, 0.65, 0.65), riskScore: 95, isTarget: true,  index: 3 },
  { id: "TR-105", position: new THREE.Vector3(-2, 0,  75), scale: new THREE.Vector3(0.5, 0.5, 0.5), riskScore: 37, isTarget: false, index: 4 },
  { id: "TR-106", position: new THREE.Vector3( 2, 0,  90), scale: new THREE.Vector3(0.5, 0.5, 0.5), riskScore: 44, isTarget: false, index: 5 },
];

// Target transformer is always index 3 (TR-104)
export const TARGET_TRANSFORMER_INDEX = 3;

// ─── Consumer clusters ────────────────────────────────────────

export const CONSUMERS_PER_CLUSTER = 16;
export const CONSUMER_CLUSTER_RADIUS = 2.2;

// Highlight consumer indices in the target cluster (C-014 etc.)
export const HIGHLIGHT_CONSUMER_INDICES = [0, 3, 7, 11];

// Explicit mapping from Consumer ID (from demo-data) to cluster array index
export const CONSUMER_ID_TO_INSTANCE_INDEX: Record<string, number> = {
  "C-014": 0,
  "C-027": 3,
  "C-081": 7,
  "C-112": 11,
};
// Drive visual focus directly via the mapped identity
export const TARGET_CONSUMER_INDEX = CONSUMER_ID_TO_INSTANCE_INDEX["C-014"];

// ─── Camera keyframes ─────────────────────────────────────────

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_KEYFRAMES: Record<string, CameraKeyframe> = {
  // Scene 1 — Hero: high aerial over substation looking down the main avenue
  intro:       { position: [0,  30, -30], target: [0, 0, 40] },
  hero:        { position: [0,  30, -30], target: [0, 0, 40] },
  
  // Scene 2 — Network: descending to fly along the main avenue power lines
  network:     { position: [0,  10,  10], target: [0, 0, 50] },
  
  // Scene 3 — Transformer: approach physical TR-104 (at Z=60, X=2)
  // Look further right (X=5) so TR-104 sits on the left of the screen.
  transformer: { position: [-3,  4,  55], target: [5, 1, 60] },
  
  // Scene 4 — Loss: closer inspection of TR-104
  loss:        { position: [-1,  2,  58], target: [4, 0.5, 60] },
  
  // Scene 5 — Risk: pull up slightly to see neighboring transformers down the avenue
  risk:        { position: [0,  15,  45], target: [2, 0, 60] },
  
  // Scene 6 — Consumer: fly down the side street branching from TR-104 (+X direction)
  consumer:    { position: [10,  6,  65], target: [15, 0, 60] },
  
  // Scene 7 — Action beat 1: focus on the priority houses along the street
  action:      { position: [15, 2.5, 62], target: [18, 0.5, 60] },
  
  // Scene 8 — Action beat 2: final closing
  // Pull camera back, raise it slightly, and angle UP (Y=6) to push infrastructure 
  // into the lower third of the frame, creating clean negative space in the center.
  action2:     { position: [14, 3.5, 66], target: [22, 6, 58] },
} as const;

// ─── Scroll height ────────────────────────────────────────────
export const SCROLL_HEIGHT_VH = 850;

// ─── Scene thresholds (kept for reference) ────────────────────
export const SCENE_THRESHOLDS = {
  intro: 0,
  network: 0.05,
  networkFly: 0.14,
  transformer: 0.22,
  loss: 0.32,
  risk: 0.41,
  consumer: 0.50,
  explainable: 0.60,
  priority: 0.68,
  inspection: 0.78,
  closedLoop: 0.88,
  end: 1.0,
} as const;

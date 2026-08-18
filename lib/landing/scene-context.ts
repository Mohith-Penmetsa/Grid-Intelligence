"use client";

import { createContext, useContext } from "react";
import type { SceneState } from "@/components/landing/SceneCanvas";

// ─── Scene State Context ──────────────────────────────────────
// Provides the GSAP-driven scene state ref to all 3D child components.
// Using a ref (not state) avoids React re-renders — Three.js components
// read this in their useFrame loops.

export const SceneStateContext = createContext<
  React.RefObject<SceneState> | null
>(null);

export function useSceneState(): React.RefObject<SceneState> {
  const ctx = useContext(SceneStateContext);
  if (!ctx) {
    throw new Error(
      "useSceneState must be used within SceneStateContext.Provider"
    );
  }
  return ctx;
}

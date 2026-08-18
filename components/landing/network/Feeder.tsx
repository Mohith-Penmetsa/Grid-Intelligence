"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "@/lib/landing/scene-config";
import { useSceneState } from "@/lib/landing/scene-context";

// ─── Feeder Component ────────────────────────────────────────
// Represents the top of the distribution hierarchy.
// Reads scene state via context to adjust intensity and visibility.

export function Feeder() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const sceneStateRef = useSceneState();

  const coreMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: 0x2288cc,
      transparent: true,
      opacity: 0.4, // Reduced by 50% for subtlety
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    []
  );

  useFrame((fiberState, delta) => {
    const state = sceneStateRef.current;
    const intensity = state?.feederIntensity ?? 1.0;
    const p = Math.sin(fiberState.clock.elapsedTime * 0.5) * 0.5 + 0.5;

    // Very slow, subtle single-axis rotation for HUD bracket
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.05;
    }

    coreMaterial.opacity = (intensity * 0.5) * (0.3 + p * 0.7);

    if (lightRef.current) {
      lightRef.current.intensity = intensity * 1.5;
    }
    
    // Move out of the way during transformer focus analysis
    if (groupRef.current) {
      const focus = state?.transformerFocusScale ?? 0;
      // Hide completely during transformer focus to let the asset speak for itself
      groupRef.current.scale.setScalar(1 - focus);
      groupRef.current.position.y = -focus * 2.0;
    }
  });

  useEffect(() => {
    return () => {
      coreMaterial.dispose();
    };
  }, [coreMaterial]);

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* Minimalist Structural HUD Brackets (4 Corners) */}
      <group ref={coreRef}>
        {[
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ].map(([x, z], i) => (
          <group key={i} position={[x * 1.8, 0, z * 1.8]}>
            <mesh material={coreMaterial} position={[0, 0.2, 0]}>
              <boxGeometry args={[0.04, 0.4, 0.04]} />
            </mesh>
            <mesh material={coreMaterial} position={[x * -0.15, 0, 0]}>
              <boxGeometry args={[0.3, 0.04, 0.04]} />
            </mesh>
            <mesh material={coreMaterial} position={[0, 0, z * -0.15]}>
              <boxGeometry args={[0.04, 0.04, 0.3]} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Localized subtle glow */}
      <pointLight
        ref={lightRef}
        color={COLORS.electricBlue}
        intensity={1.0}
        distance={6}
        decay={2}
      />
    </group>
  );
}

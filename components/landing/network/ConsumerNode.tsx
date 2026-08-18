"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";
import {
  TRANSFORMER_CONFIGS,
  COLORS,
  CONSUMERS_PER_CLUSTER,
  CONSUMER_CLUSTER_RADIUS,
  TARGET_TRANSFORMER_INDEX,
  HIGHLIGHT_CONSUMER_INDICES,
  TARGET_CONSUMER_INDEX,
} from "@/lib/landing/scene-config";
import { useSceneState } from "@/lib/landing/scene-context";
import { NETWORK_TOPOLOGY } from "@/lib/landing/network-topology";

// ─── Shared Priority Positions ────────────────────────────────
// We export this so ConsumerConnections can read it directly every frame.
export const targetConsumerWorldPositions = Array.from({ length: 16 }, () => new THREE.Vector3());

export const HOME_POSITIONS = NETWORK_TOPOLOGY.flatMap(t => t.houses).map(h => h.position);
export const HOUSE_ROTATIONS = NETWORK_TOPOLOGY.flatMap(t => t.houses).map(h => h.rotationY);

// ─── Seeded pseudo-random ─────────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// (Removed buildInspectionPositions since physical houses should not fly into the air)

export function ConsumerCluster() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const sceneStateRef = useSceneState();

  const totalInstances = TRANSFORMER_CONFIGS.length * CONSUMERS_PER_CLUSTER;
  const { houseGeometry, materials } = useMemo(() => {
    // Wall volume
    const body = new THREE.BoxGeometry(0.35, 0.3, 0.45);
    body.translate(0, 0.15, 0);
    
    // Pitched sloped roof
    const roof = new THREE.ConeGeometry(0.35, 0.15, 4);
    roof.rotateY(Math.PI / 4);
    roof.scale(1, 1, 1.3);
    roof.translate(0, 0.375, 0);
    
    // Front porch/extension
    const porch = new THREE.BoxGeometry(0.15, 0.15, 0.2);
    porch.translate(0, 0.075, 0.25);
    
    // Warm glowing window
    const windowGeom = new THREE.PlaneGeometry(0.1, 0.08);
    windowGeom.translate(0.08, 0.15, 0.226);
    
    // Merge into single lightweight geometry WITH groups
    const geo = mergeBufferGeometries([body, porch, roof, windowGeom], true)!;
    
    const mats = [
      new THREE.MeshStandardMaterial({ color: 0x283C4D, roughness: 0.85, metalness: 0.1 }), // 0: Body (Dark concrete)
      new THREE.MeshStandardMaterial({ color: 0x263746, roughness: 0.85, metalness: 0.1 }), // 1: Porch 
      new THREE.MeshStandardMaterial({ color: 0x101D29, roughness: 0.92, metalness: 0.05 }), // 2: Roof (Dark slate)
      new THREE.MeshStandardMaterial({ color: 0x40596A, emissive: 0x000000, emissiveIntensity: 0.0 }), // 3: Window muted
    ];
    
    return { houseGeometry: geo, materials: mats };
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    HOME_POSITIONS.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.rotation.set(0, HOUSE_ROTATIONS[i], 0);
      dummy.scale.setScalar(0); // Start at 0 scale
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  const _tmpPos = useMemo(() => new THREE.Vector3(), []);
  const _color = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const mesh = meshRef.current;
    const s = sceneStateRef.current;
    if (!mesh || !s) return;

    const reveal = s.consumerReveal;
    const sep = s.consumerSeparation;
    const traj = s.priorityTrajectory;
    const hScale = s.highlightConsumerScale;

    let matrixDirty = false;

    for (let tIdx = 0; tIdx < TRANSFORMER_CONFIGS.length; tIdx++) {
      const isTargetCluster = tIdx === TARGET_TRANSFORMER_INDEX;
      const tcPos = TRANSFORMER_CONFIGS[tIdx].position;

      for (let i = 0; i < CONSUMERS_PER_CLUSTER; i++) {
        const instIdx = tIdx * CONSUMERS_PER_CLUSTER + i;
        const isHighlight = isTargetCluster && HIGHLIGHT_CONSUMER_INDICES.includes(i);
        const isC014 = isTargetCluster && i === TARGET_CONSUMER_INDEX;
        
        const homePos = HOME_POSITIONS[instIdx];
        
        // ── Position ────────────────────────────────────────
        if (isTargetCluster) {
          // Grow from transformer center to home position
          _tmpPos.lerpVectors(tcPos, homePos, reveal);
          
          if (isHighlight && traj > 0) {
             // Secondary motion: vibration to simulate anomaly energy buildup
             if (traj < 0.3 && s.anomalyState > 0) {
               const vib = s.anomalyState * 0.02 * (1 - traj * 3.33);
               if (vib > 0) {
                 _tmpPos.x += (Math.random() - 0.5) * vib;
                 _tmpPos.y += (Math.random() - 0.5) * vib;
               }
             }
          }
          
          targetConsumerWorldPositions[i].copy(_tmpPos);
          dummy.position.copy(_tmpPos);
          dummy.rotation.y = HOUSE_ROTATIONS[instIdx];
        } else {
          // Non-target clusters don't have trajectories
          _tmpPos.lerpVectors(tcPos, homePos, reveal);
          dummy.position.copy(_tmpPos);
          dummy.rotation.y = HOUSE_ROTATIONS[instIdx];
        }

        // ── Scale ────────────────────────────────────────────
        let scl = 0;
        const randomScale = 0.5 + Math.abs(Math.sin(instIdx * 12.34)) * 1.5;
        let targetEmissive = COLORS.consumerNormalEmissive;

        if (!isTargetCluster) {
          scl = reveal * 0.8 * randomScale;
          // Fade away as trajectory starts
          scl *= Math.max(0, 1 - traj * 2);
        } else {
          scl = reveal * 0.85 * randomScale;
          
          let targetIntensity = 0.0;
          let targetOpacity = 1.0;
          let targetScale = scl;

          if (isHighlight) {
            // Highlight consumers (the 4 priority candidates)
            if (s.c014Focus > 0) {
              // Final decision: only C-014 receives full critical highlight
              if (i === TARGET_CONSUMER_INDEX) {
                targetEmissive = COLORS.consumerCriticalEmissive;
                targetIntensity = 2.0;
                targetScale = scl * (1.0 + s.c014Focus * 0.2);
              } else {
                targetEmissive = COLORS.consumerHighlightEmissive;
                targetIntensity = 1.0;
                targetOpacity = 0.4;
              }
            } else if (s.anomalyState > 0) {
              // "Suspicious consumers receive a subtle warm warning color"
              targetEmissive = COLORS.riskAmber;
              targetIntensity = 1.0;
              targetScale = scl * (1.0 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.05 * s.anomalyState);
            } else if (s.consumerSeparation > 0) {
               // "Only the four priority candidates should become highlighted"
               targetEmissive = COLORS.riskAmber;
               targetIntensity = 1.5;
               targetScale = scl * (1.0 + s.consumerSeparation * 0.1);
            }
          } else {
            // Normal consumers fade back during priority focus
            targetOpacity = 1.0 - s.c014Focus * 0.8;
          }
          
          scl = targetScale;
        }
        
        dummy.scale.setScalar(scl);
        dummy.updateMatrix();
        mesh.setMatrixAt(instIdx, dummy.matrix);
        
        // Only apply instance color tints to semantically highlighted objects.
        // Normal consumers MUST use white (1,1,1) so their material colors show correctly.
        // Using black (0,0,0) as instance color would make them invisible under lights.
        if (isTargetCluster && isHighlight && s.consumerSeparation > 0) {
          // Semantic color: amber for suspicious priority consumers
          if (s.c014Focus > 0 && i === TARGET_CONSUMER_INDEX) {
            _color.setHex(0xF05D4E); // Critical red
          } else if (s.c014Focus > 0) {
            _color.setHex(0xA0A0A0); // Faded grey for de-emphasized candidates
          } else {
            _color.setHex(0xF2A65A); // Suspicious amber
          }
        } else {
          _color.setRGB(1, 1, 1); // White = show material colors as-is
        }
        mesh.setColorAt(instIdx, _color);
        matrixDirty = true;
      }
    }

    if (matrixDirty) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  useEffect(() => {
    return () => {
      houseGeometry.dispose();
      materials.forEach(m => m.dispose());
    };
  }, [houseGeometry, materials]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[houseGeometry, materials, totalInstances]}
      castShadow
      receiveShadow
    />
  );
}

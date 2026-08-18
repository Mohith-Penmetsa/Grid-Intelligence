"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { useSceneState } from "@/lib/landing/scene-context";
import { NETWORK_TOPOLOGY } from "@/lib/landing/network-topology";
import { TRANSFORMER_CONFIGS } from "@/lib/landing/scene-config";

// ─── GridEnvironment ──────────────────────────────────────────
// Represents distant, deep electrical infrastructure.
// Provides atmospheric depth without consuming heavy resources.

export function GridEnvironment() {
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  const sceneStateRef = useSceneState();
  
  // ─── Procedural Utility Poles ───
  const { poleGeometry, poleMaterial, poleCount, polePositions, poleRotations } = useMemo(() => {
    // Build a single physical pole geometry
    const shaft = new THREE.CylinderGeometry(0.04, 0.05, 2.5, 6);
    shaft.translate(0, 1.25, 0); // Ground it
    
    const crossarm = new THREE.BoxGeometry(0.8, 0.05, 0.05);
    crossarm.translate(0, 2.2, 0);
    
    const insulator1 = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
    insulator1.translate(-0.35, 2.25, 0);
    
    const insulator2 = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
    insulator2.translate(0.35, 2.25, 0);

    const mergedPole = mergeBufferGeometries([shaft, crossarm, insulator1, insulator2]);
    const geo = mergedPole || shaft; // fallback

    const mat = new THREE.MeshStandardMaterial({
      color: 0x40596A, // Weathered concrete/steel blue-grey
      roughness: 0.85,
      metalness: 0.15
    });

    const positions: THREE.Vector3[] = [];
    const rotations: number[] = [];
    
    NETWORK_TOPOLOGY.forEach(t => {
      t.poles.forEach(p => {
        positions.push(p.position);
        rotations.push(p.rotationY);
      });
    });

    return {
      poleGeometry: geo,
      poleMaterial: mat,
      poleCount: positions.length,
      polePositions: positions,
      poleRotations: rotations
    };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!pointsRef.current) return;
    polePositions.forEach((pos, i) => {
      dummy.position.copy(pos);
      // Align pole crossarm with the road
      dummy.rotation.y = poleRotations[i];
      dummy.updateMatrix();
      pointsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    pointsRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, polePositions]);

  useFrame((fiberState, delta) => {
    const s = sceneStateRef.current;
    if (!s) return;
    
    const focusLevel = Math.max(s.transformerFocusScale, s.c014Focus);
    // Dim poles slightly if heavily zoomed in, but retain physicality
    poleMaterial.opacity = THREE.MathUtils.damp(poleMaterial.opacity, 1.0 - focusLevel * 0.4, 2, delta);
  });
  
  useEffect(() => {
    return () => {
      poleGeometry.dispose();
      poleMaterial.dispose();
    };
  }, [poleGeometry, poleMaterial]);

  return (
    <group>
      {/* Single Y=0 ground plane — matte blue-grey terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <planeGeometry args={[400, 400]} />
         <meshStandardMaterial color={0x263746} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Transformer Service Pads & Primary Roads */}
      {TRANSFORMER_CONFIGS.map((config, i) => {
        const tPos = config.position;
        return (
        <group key={`t-env-${i}`} position={tPos}>
          {/* Concrete service pad at Y=0.04 */}
          <mesh key={`pad-${i}`} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
             <planeGeometry args={[3, 3]} />
             <meshStandardMaterial color={0x344A5A} roughness={0.9} metalness={0.05} />
          </mesh>
          {NETWORK_TOPOLOGY[i]?.branches.map((b, bIdx) => (
            /* Roads at Y=0.02 */
            <mesh key={`road-${b.id}`} rotation={[-Math.PI / 2, 0, Math.atan2(b.direction.x, b.direction.z)]} position={[b.direction.x * 2.0, 0.02, b.direction.z * 2.0]} receiveShadow>
               <planeGeometry args={[1.5, 6.0]} />
               <meshStandardMaterial color={0x344A5A} roughness={0.8} metalness={0.1} />
            </mesh>
          ))}
        </group>
        );
      })}
      
      {/* ── CENTRAL FEEDER PAD ── */}
      {/* Feeder pad at Y=0.04 */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.04, 2.9]} />
        <meshStandardMaterial color={0x344A5A} roughness={0.9} />
      </mesh>
      
      {/* ── SECONDARY INFRASTRUCTURE (Substation Control House / Trenches) ── */}
      {/* Substation building — dark concrete */}
      <mesh position={[-8, 1.5, -12]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 2]} />
        <meshStandardMaterial color={0x283C4D} roughness={0.85} />
      </mesh>
      {/* Cable trench cover at Y=0.06 */}
      <mesh position={[-5, 0.06, -11]} castShadow receiveShadow>
         <boxGeometry args={[6, 0.06, 0.8]} />
         <meshStandardMaterial color={0x344A5A} roughness={0.90} />
      </mesh>

      {/* ── PHYSICAL UTILITY POLES ── */}
      <instancedMesh ref={pointsRef} args={[poleGeometry, poleMaterial, poleCount]} castShadow receiveShadow />
    </group>
  );
}

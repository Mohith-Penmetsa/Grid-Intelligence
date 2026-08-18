"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";
import {
  TRANSFORMER_CONFIGS,
  TARGET_TRANSFORMER_INDEX,
  COLORS
} from "@/lib/landing/scene-config";
import { NETWORK_TOPOLOGY } from "@/lib/landing/network-topology";
import { useSceneState } from "@/lib/landing/scene-context";

// ─── Glowing Analytics Cables ─────────────────────────────────
// These overlap the physical cables but use emissive materials
// that fade in based on the scene narrative.

export function ConsumerConnections() {
  const sceneStateRef = useSceneState();
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const priorityMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { normalGeo, priorityGeo } = useMemo(() => {
    const normalTubes: THREE.TubeGeometry[] = [];
    const priorityTubes: THREE.TubeGeometry[] = [];

    const top = NETWORK_TOPOLOGY[TARGET_TRANSFORMER_INDEX];
    if (!top) return { normalGeo: null, priorityGeo: null };

    // Get pole positions
    const primTops = new Map<number, THREE.Vector3>();
    const svcTops = new Map<number, THREE.Vector3>();
    top.poles.forEach(p => {
      primTops.set(p.globalIndex, p.position.clone().add(new THREE.Vector3(0, 2.3, 0)));
      svcTops.set(p.globalIndex, p.position.clone().add(new THREE.Vector3(0, 1.8, 0)));
    });

    // We don't trace back to the transformer top for analytical cables, just from poles to houses
    // But we could trace the primary branch too! Let's do both.
    const tTop = TRANSFORMER_CONFIGS[TARGET_TRANSFORMER_INDEX].position.clone().add(new THREE.Vector3(0, 0.9, 0));

    top.branches.forEach(branch => {
      let prevPos = tTop;
      branch.poles.forEach(pole => {
        const curPos = primTops.get(pole.globalIndex)!;
        const dist = prevPos.distanceTo(curPos);
        const curve = new THREE.CatmullRomCurve3([
          prevPos,
          new THREE.Vector3((prevPos.x+curPos.x)/2, ((prevPos.y+curPos.y)/2) - 0.06*dist, (prevPos.z+curPos.z)/2),
          curPos
        ]);
        normalTubes.push(new THREE.TubeGeometry(curve, 6, 0.015, 3, false));
        prevPos = curPos;
      });
    });

    top.houses.forEach(house => {
      const polePos = svcTops.get(house.poleId)!;
      const houseRoof = house.position.clone().add(new THREE.Vector3(0, 0.35, 0));
      const dist = polePos.distanceTo(houseRoof);
      const curve = new THREE.CatmullRomCurve3([
          polePos,
          new THREE.Vector3((polePos.x+houseRoof.x)/2, ((polePos.y+houseRoof.y)/2) - 0.12*dist, (polePos.z+houseRoof.z)/2),
          houseRoof
      ]);
      const geo = new THREE.TubeGeometry(curve, 5, 0.01, 3, false);
      if (house.isPriority) {
        priorityTubes.push(geo);
      } else {
        normalTubes.push(geo);
      }
    });

    return {
      normalGeo: normalTubes.length > 0 ? mergeBufferGeometries(normalTubes) : null,
      priorityGeo: priorityTubes.length > 0 ? mergeBufferGeometries(priorityTubes) : null
    };
  }, []);

  useFrame(() => {
    const s = sceneStateRef.current;
    if (!s || !materialRef.current || !priorityMaterialRef.current) return;
    
    // Fade in when consumer analysis starts
    const opacity = s.consumerReveal * 0.8; 
    
    // Normal cables glow cyan, priority glow red/orange based on trajectory
    materialRef.current.opacity = opacity;
    materialRef.current.emissiveIntensity = opacity * 2.0;

    const prioOpacity = s.consumerReveal * 0.9;
    priorityMaterialRef.current.opacity = prioOpacity;
    priorityMaterialRef.current.emissiveIntensity = prioOpacity * 3.0 + s.priorityTrajectory * 2.0;
    
    // Shift color of priority cables as scene progresses
    if (s.priorityTrajectory > 0.5) {
      priorityMaterialRef.current.color = COLORS.consumerCritical;
      priorityMaterialRef.current.emissive = COLORS.consumerCriticalEmissive;
    } else {
      priorityMaterialRef.current.color = COLORS.consumerHighlight;
      priorityMaterialRef.current.emissive = COLORS.consumerHighlightEmissive;
    }
  });

  return (
    <group>
      {normalGeo && (
        <mesh geometry={normalGeo}>
          <meshStandardMaterial 
            ref={materialRef}
            color={COLORS.electricBlue} 
            emissive={COLORS.electricBlue}
            transparent 
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      {priorityGeo && (
        <mesh geometry={priorityGeo}>
          <meshStandardMaterial 
            ref={priorityMaterialRef}
            color={COLORS.consumerHighlight} 
            emissive={COLORS.consumerHighlightEmissive}
            transparent 
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import type { TransformerConfig } from "@/lib/landing/scene-config";
import { COLORS, TARGET_TRANSFORMER_INDEX } from "@/lib/landing/scene-config";
import { useSceneState } from "@/lib/landing/scene-context";

// ─── Scatter directions ───────────────────────────────────────
const SCATTER_OFFSETS: THREE.Vector3[] = [
  new THREE.Vector3(-4.5, 0,  -2),   // TR-101
  new THREE.Vector3(-2.5, 0,   3),   // TR-102
  new THREE.Vector3( 3.5, 0,  -3.5), // TR-103
  new THREE.Vector3(  0,  0,   0),   // TR-104 (target)
  new THREE.Vector3( 3.5, 0,   1.5), // TR-105
  new THREE.Vector3( 1.5, 0,   3.5), // TR-106
];

export function TransformerNode({ config }: { config: TransformerConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const sceneStateRef = useSceneState();
  const _tmpColor = useMemo(() => new THREE.Color(), []);
  
  // Component refs for explosion
  const explosionGroupRef = useRef<THREE.Group>(null);
  const casingFrontRef = useRef<THREE.Mesh>(null);
  const casingBackRef = useRef<THREE.Mesh>(null);
  const casingLeftGroupRef = useRef<THREE.Group>(null);
  const casingRightGroupRef = useRef<THREE.Group>(null);
  const topCoverGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coilLeftRef = useRef<THREE.Group>(null);
  const coilRightRef = useRef<THREE.Group>(null);

  const isTarget = config.index === TARGET_TRANSFORMER_INDEX;
  const homePos = config.position;
  const scatterDir = SCATTER_OFFSETS[config.index];

  const _pos    = useMemo(() => homePos.clone(), [homePos]);
  const _center = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  
  // Physics states for deterministic inertia
  const _phys = useRef({
    casingZ: 0.45,
    casingX: 0.45,
    topY: 0.85,
    coilX: 0.23,
    topRotX: 0,
    topRotZ: 0
  });

  // Materials - Physically Based Rendering constraints
  const casingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0x263B49, // Painted industrial metal
    emissive: 0x000000,
    emissiveIntensity: 0,
    metalness: 0.6,
    roughness: 0.55,
    transparent: true,
  }), []);
  
  const structuralSteelMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0x344A5A, // Steel structure
    metalness: 0.7, 
    roughness: 0.6, 
    transparent: true 
  }), []);

  const rubberMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0x08090a, // Nearly black
    metalness: 0.05, 
    roughness: 0.95, // High roughness rubber
    transparent: true 
  }), []);
  
  const ceramicMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0xf5f5dc, // Warm ceramic/off-white
    metalness: 0.1, 
    roughness: 0.2, // Subtle specular
    transparent: true 
  }), []);
  
  const terminalMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, // Light gray/aluminum
    metalness: 0.9, 
    roughness: 0.3,
    emissive: 0x000000, 
    transparent: true 
  }), []);
  
  const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0x1f232b, 
    emissive: isTarget ? COLORS.electricBlue : 0x000000, 
    emissiveIntensity: 0, 
    metalness: 0.85, 
    roughness: 0.4, 
    transparent: true 
  }), [isTarget]);
  
  const coilMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0xd97a44, // Rich physical copper
    metalness: 1.0, 
    roughness: 0.45, // Slightly brushed/oxidized copper
    transparent: true 
  }), []);

  const _scatterPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const s = sceneStateRef.current;
    const g = groupRef.current;
    if (!s || !g) return;

    if (isTarget) {
      _pos.copy(homePos);
    } else {
      _pos.copy(homePos);
    }
    g.position.copy(_pos);

    if (isTarget) {
      const sc = config.scale.x * (1 + s.transformerFocusScale * 0.8);
      g.scale.setScalar(sc);
    } else {
      const sc = config.scale.x * s.nonTargetScale;
      g.scale.setScalar(sc);
    }
    
    // Opacity
    const opacity = isTarget ? 1 : s.nonTargetOpacity;
    casingMaterial.opacity = opacity;
    structuralSteelMaterial.opacity = opacity;
    rubberMaterial.opacity = opacity;
    ceramicMaterial.opacity = opacity;
    terminalMaterial.opacity = opacity;
    coreMaterial.opacity = opacity;
    coilMaterial.opacity = opacity;

    // ── Exploded View ────────────────────────────────────────
    const explode = isTarget ? s.transformerExplode : 0;
    const e = Math.pow(explode, 1.3);
    
    const targetCasingZ = 0.45 + e * 1.5;
    const targetCasingX = 0.45 + e * 1.5;
    const targetTopY = 0.85 + e * 1.8;
    const targetCoilX = 0.23 + e * 0.45;
    
    const p = _phys.current;
    p.casingZ = THREE.MathUtils.damp(p.casingZ, targetCasingZ, 4.0, delta);
    p.casingX = THREE.MathUtils.damp(p.casingX, targetCasingX, 4.0, delta);
    p.coilX = THREE.MathUtils.damp(p.coilX, targetCoilX, 6.0, delta);
    p.topY = THREE.MathUtils.damp(p.topY, targetTopY, 7.0, delta);

    if (casingFrontRef.current) casingFrontRef.current.position.z = p.casingZ;
    if (casingBackRef.current) casingBackRef.current.position.z = -p.casingZ;
    if (casingLeftGroupRef.current) casingLeftGroupRef.current.position.x = -p.casingX;
    if (casingRightGroupRef.current) casingRightGroupRef.current.position.x = p.casingX;
    if (topCoverGroupRef.current) topCoverGroupRef.current.position.y = p.topY;
    if (coilLeftRef.current) coilLeftRef.current.position.x = -p.coilX;
    if (coilRightRef.current) coilRightRef.current.position.x = p.coilX;
    
    coreMaterial.emissiveIntensity = e * (1.2 + Math.sin(state.clock.elapsedTime * 6) * 0.3);

    if (lightRef.current) {
      if (isTarget) {
        const analysisAmount = s.transformerFocusScale;
        const riskAmount = s.anomalyState;
        
        if (riskAmount > 0) {
          // Suspicious -> Critical (Amber -> Red)
          _tmpColor.lerpColors(new THREE.Color("#F2A65A"), new THREE.Color("#F05D4E"), riskAmount);
          lightRef.current.intensity = riskAmount * 2.5;
        } else if (analysisAmount > 0) {
          // Analyzed (Cyan)
          _tmpColor.copy(COLORS.electricBlue);
          lightRef.current.intensity = analysisAmount * 1.5;
        } else {
          // Target transformer at rest — subtle warm practical glow
          _tmpColor.setHex(0xD4892A);
          lightRef.current.intensity = 0.4;
        }
      } else {
        // Non-target: always-on very subtle warm amber practical light
        // Creates depth and prevents network from being uniformly grey
        _tmpColor.setHex(0xC07020);
        lightRef.current.intensity = 0.15 * (1 - s.transformerFocusScale * 0.8);
      }
      lightRef.current.color.copy(_tmpColor);
      
      if (isTarget) {
        const analysisAmount = s.transformerFocusScale;
        const riskAmount = s.anomalyState;
        terminalMaterial.emissive.copy(_tmpColor);
        terminalMaterial.emissiveIntensity = Math.max(analysisAmount, riskAmount) * 1.5;
        casingMaterial.emissive.copy(COLORS.electricBlue);
        casingMaterial.emissiveIntensity = analysisAmount * 0.05;
      } else {
        terminalMaterial.emissive.setHex(0x000000);
        casingMaterial.emissive.setHex(0x000000);
      }
    }
  });

  return (
    <group ref={groupRef} position={homePos} scale={config.scale}>
      
      {/* ── GROUNDED STRUCTURAL BASE (Does not explode) ── */}
      <group position={[0, 0, 0]}>
        {isTarget ? (
          <>
            {/* Main bottom skid */}
            <RoundedBox args={[1.0, 0.05, 0.8]} position={[0, 0.025, 0]} radius={0.01} smoothness={4} material={structuralSteelMaterial} castShadow receiveShadow />
            {/* C-Channel side rails */}
            <RoundedBox args={[1.1, 0.08, 0.1]} position={[0, 0.04, 0.35]} radius={0.01} smoothness={4} material={structuralSteelMaterial} castShadow />
            <RoundedBox args={[1.1, 0.08, 0.1]} position={[0, 0.04, -0.35]} radius={0.01} smoothness={4} material={structuralSteelMaterial} castShadow />
            {/* Cross braces */}
            <mesh position={[-0.4, 0.04, 0]} material={structuralSteelMaterial} castShadow>
              <boxGeometry args={[0.08, 0.04, 0.7]} />
            </mesh>
            <mesh position={[0.4, 0.04, 0]} material={structuralSteelMaterial} castShadow>
              <boxGeometry args={[0.08, 0.04, 0.7]} />
            </mesh>
          </>
        ) : (
          <mesh position={[0, 0.05, 0]} material={structuralSteelMaterial} castShadow>
            <boxGeometry args={[1.0, 0.1, 0.8]} />
          </mesh>
        )}
      </group>

      {/* ── EXPLODABLE ASSEMBLIES ── */}
      <group ref={explosionGroupRef}>
        {/* Internal Copper Coils - Left (Layered Windings) */}
        <group ref={coilLeftRef} position={[-0.23, 0.45, 0]}>
          <mesh material={coilMaterial} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 0.7, isTarget ? 32 : 12]} />
          </mesh>
          {isTarget && (
            <mesh material={coilMaterial} scale={[1.05, 0.9, 1.05]} castShadow>
               <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
            </mesh>
          )}
        </group>

        {/* Internal Copper Coils - Right (Layered Windings) */}
        <group ref={coilRightRef} position={[0.23, 0.45, 0]}>
          <mesh material={coilMaterial} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 0.7, isTarget ? 32 : 12]} />
          </mesh>
          {isTarget && (
            <mesh material={coilMaterial} scale={[1.05, 0.9, 1.05]} castShadow>
               <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
            </mesh>
          )}
        </group>

        {/* Internal Core (Solid block) */}
        <mesh ref={coreRef} position={[0, 0.45, 0]} material={coreMaterial} castShadow>
          <boxGeometry args={[isTarget ? 0.35 : 0.4, 0.85, 0.3]} />
        </mesh>

        {/* ── OUTER SHELL PANELS ── */}
        
        {/* Front Panel */}
        <mesh ref={casingFrontRef} position={[0, 0.45, 0.45]} material={casingMaterial} castShadow>
          <boxGeometry args={[1.05, 0.8, 0.1]} />
          {/* Panel seams/fasteners could be added here if highly detailed */}
          {isTarget && (
            <group position={[0, 0, 0.05]}>
              <mesh position={[-0.45, 0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
              <mesh position={[0.45, 0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
              <mesh position={[-0.45, -0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
              <mesh position={[0.45, -0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
            </group>
          )}
        </mesh>
        
        {/* Back Panel */}
        <mesh ref={casingBackRef} position={[0, 0.45, -0.45]} material={casingMaterial} castShadow>
          <boxGeometry args={[1.05, 0.8, 0.1]} />
          {isTarget && (
            <group position={[0, 0, -0.05]}>
              <mesh position={[-0.45, 0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
              <mesh position={[0.45, 0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
              <mesh position={[-0.45, -0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
              <mesh position={[0.45, -0.35, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial}><cylinderGeometry args={[0.01, 0.01, 0.02]} /></mesh>
            </group>
          )}
        </mesh>

        {/* Cooling Fins - Left */}
        <group ref={casingLeftGroupRef} position={[-0.45, 0.45, 0]}>
          {isTarget ? (
            <RoundedBox args={[0.15, 0.6, 0.6]} radius={0.02} smoothness={4} material={casingMaterial} castShadow />
          ) : (
            <mesh material={casingMaterial} castShadow><boxGeometry args={[0.15, 0.6, 0.6]} /></mesh>
          )}
          {isTarget && (
            <group>
              {/* Radiator Manifolds (top and bottom pipes connecting fins) */}
              <mesh position={[-0.08, 0.25, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial} castShadow><cylinderGeometry args={[0.03, 0.03, 0.55]} /></mesh>
              <mesh position={[-0.08, -0.25, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial} castShadow><cylinderGeometry args={[0.03, 0.03, 0.55]} /></mesh>
              {/* Cooling Fans (bottom) */}
              <mesh position={[-0.15, -0.35, -0.15]} material={casingMaterial} castShadow><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
              <mesh position={[-0.15, -0.35, 0.15]} material={casingMaterial} castShadow><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
              {/* Heavy industrial radiator bank - Tightly packed thin fins */}
              {Array.from({ length: 14 }).map((_, i) => (
                <mesh key={i} material={casingMaterial} position={[-0.12, 0, -0.32 + i * 0.05]} castShadow>
                  <boxGeometry args={[0.08, 0.55, 0.01]} />
                </mesh>
              ))}
            </group>
          )}
        </group>

        {/* Cooling Fins - Right */}
        <group ref={casingRightGroupRef} position={[0.45, 0.45, 0]}>
          {isTarget ? (
            <RoundedBox args={[0.15, 0.6, 0.6]} radius={0.02} smoothness={4} material={casingMaterial} castShadow />
          ) : (
            <mesh material={casingMaterial} castShadow><boxGeometry args={[0.15, 0.6, 0.6]} /></mesh>
          )}
          {isTarget && (
            <group>
              {/* Radiator Manifolds (top and bottom pipes connecting fins) */}
              <mesh position={[0.08, 0.25, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial} castShadow><cylinderGeometry args={[0.03, 0.03, 0.55]} /></mesh>
              <mesh position={[0.08, -0.25, 0]} rotation={[Math.PI/2, 0, 0]} material={structuralSteelMaterial} castShadow><cylinderGeometry args={[0.03, 0.03, 0.55]} /></mesh>
              {/* Cooling Fans (bottom) */}
              <mesh position={[0.15, -0.35, -0.15]} material={casingMaterial} castShadow><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
              <mesh position={[0.15, -0.35, 0.15]} material={casingMaterial} castShadow><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
              {/* Heavy industrial radiator bank - Tightly packed thin fins */}
              {Array.from({ length: 14 }).map((_, i) => (
                <mesh key={i} material={casingMaterial} position={[0.12, 0, -0.32 + i * 0.05]} castShadow>
                  <boxGeometry args={[0.08, 0.55, 0.01]} />
                </mesh>
              ))}
            </group>
          )}
        </group>
        
        {/* Top Cover */}
        <group ref={topCoverGroupRef} position={[0, 0.9, 0]}>
          {/* Main Cover Plate */}
          {isTarget ? (
            <RoundedBox args={[1.05, 0.1, 1.0]} radius={0.02} smoothness={4} material={casingMaterial} castShadow />
          ) : (
            <mesh material={casingMaterial} castShadow>
              <boxGeometry args={[1.05, 0.1, 1.0]} />
            </mesh>
          )}
          
          {/* Ceramic High-Voltage Bushings (Only on Hero Target) */}
          {isTarget && (
            <group position={[0, 0.05, 0]}>
              {[-0.2, 0, 0.2].map((x, i) => (
                <group key={i} position={[x, 0, -0.15]}>
                  {/* Rubber insulation base */}
                  <mesh position={[0, 0.02, 0]} material={rubberMaterial} castShadow>
                    <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
                  </mesh>
                  {/* Ribbed Ceramic Insulator Stack */}
                  {Array.from({ length: 5 }).map((_, j) => (
                    <mesh key={`c_${j}`} position={[0, 0.08 + j * 0.05, 0]} material={ceramicMaterial} castShadow>
                      <cylinderGeometry args={[0.045 - j*0.004, 0.055 - j*0.004, 0.04, 16]} />
                    </mesh>
                  ))}
                  {/* Metal Terminal Pin */}
                  <mesh position={[0, 0.35, 0]} material={terminalMaterial} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                  </mesh>
                </group>
              ))}

              {/* Conservator Tank (Expansion Tank) */}
              <group position={[0.3, 0.3, 0.35]}>
                {/* Support Pipe */}
                <mesh position={[-0.1, -0.15, 0]} material={structuralSteelMaterial} castShadow>
                   <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                </mesh>
                <mesh position={[0.1, -0.15, 0]} material={structuralSteelMaterial} castShadow>
                   <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                </mesh>
                {/* Main Tank */}
                <mesh rotation={[0, 0, Math.PI/2]} material={casingMaterial} castShadow>
                   <cylinderGeometry args={[0.15, 0.15, 0.8, 24]} />
                </mesh>
                {/* Oil Level Gauge */}
                <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI/2]} material={structuralSteelMaterial} castShadow>
                   <cylinderGeometry args={[0.08, 0.08, 0.02]} />
                </mesh>
              </group>
            </group>
          )}

          {/* Indicator Terminal / Safety Valve */}
          <mesh position={[0, 0.05, 0.2]} material={structuralSteelMaterial} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.15, isTarget ? 16 : 8]} />
          </mesh>
          <mesh position={[0, 0.15, 0.2]} material={isTarget ? coreMaterial : terminalMaterial}>
            <sphereGeometry args={[isTarget ? 0.06 : 0.08, isTarget ? 16 : 8, isTarget ? 16 : 8]} />
          </mesh>
          {/* Practical Transformer Indicator and Warm Pool */}
          <pointLight ref={lightRef} color="#ff8800" intensity={0} distance={15} decay={1.5} position={[0, 1.2, 0.8]} />
        </group>
      </group>
    </group>
  );
}

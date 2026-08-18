"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ConsumerConnections } from "@/components/landing/network/ConsumerConnections";
import { PowerFlow } from "@/components/landing/network/PowerFlow";
import { TRANSFORMER_CONFIGS } from "@/lib/landing/scene-config";
import { SceneStateContext } from "@/lib/landing/scene-context";
import { World } from "@/components/landing3d/World";

// ─── SceneState ───────────────────────────────────────────────
// All numeric values in this object can be tweened by GSAP directly.
// R3F components read them every frame via useSceneState().

export interface SceneState {
  // Master progress
  progress: number;

  // Camera
  cameraTarget: { position: THREE.Vector3; lookAt: THREE.Vector3 };

  // Feeder
  feederIntensity: number;       // emissive intensity multiplier

  // Transformer transforms (per-object scroll-driven physics)
  // Each transformer has a "scatter" value (0=home, 1=scattered-outward)
  // and an "expand" value (0=normal, 1=enlarged/featured)
  transformerScatter: number;    // 0→1: non-target transformers push outward
  transformerFocusScale: number; // 0→1: target transformer scales up
  transformerOpacity: number;    // 1→dimOpacity for non-target transformers
  nonTargetOpacity: number;      // opacity of non-target transformers (0→1)
  nonTargetScale: number;        // scale multiplier of non-target transformers
  transformerExplode: number;    // 0→1: target transformer explodes into parts

  // Connection lines
  connectionOpacity: number;

  // Power flow
  powerFlowIntensity: number;

  // Consumer cluster
  consumerReveal: number;        // 0→1: consumer nodes appear around target transformer
  consumerSeparation: number;    // 0→1: highlight consumers physically move apart
  highlightConsumerScale: number; // scale pulse for highlighted consumers
  priorityTrajectory: number;    // 0→1: priority consumers fly to inspection points
  c014Focus: number;             // 0→1: isolates C-014 from other priority nodes
  
  // Anomaly reveal
  anomalyState: number;          // 0→1: target transformer begins electrical disturbance
}

interface SceneCanvasProps {
  sceneStateRef: React.RefObject<SceneState>;
}

// ─── Camera Driver ────────────────────────────────────────────

function CameraDriver({
  sceneStateRef,
}: {
  sceneStateRef: React.RefObject<SceneState>;
}) {
  const { camera } = useThree();
  const _prevTarget = useRef(new THREE.Vector3());
  const _drift = useRef(new THREE.Vector3());
  const _tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const _tmpLookAt = useMemo(() => new THREE.Vector3(), []);
  const _zeroVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    const s = sceneStateRef.current;
    if (!s) return;
    
    // Detect if camera is transitioning between scenes by checking distance to target
    const distToTarget = camera.position.distanceTo(s.cameraTarget.position);
    const isMoving = distToTarget > 1.0;

    // Apply organic drift only during intentional pauses
    if (!isMoving) {
      const t = state.clock.elapsedTime;
      _drift.current.x = Math.sin(t * 0.4) * 0.06;
      _drift.current.y = Math.cos(t * 0.3) * 0.06;
    } else {
      // Smoothly zero out drift so it doesn't fight the GSAP choreography
      _drift.current.lerp(_zeroVec, 0.1);
    }

    // Heavy cinematic camera inertia (dampen towards target instead of snapping)
    _tmpTarget.copy(s.cameraTarget.position).add(_drift.current);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _tmpTarget.x, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _tmpTarget.y, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _tmpTarget.z, 3.5, delta);
    
    // Smooth LookAt target as well
    _tmpLookAt.set(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    _tmpLookAt.x = THREE.MathUtils.damp(_tmpLookAt.x, s.cameraTarget.lookAt.x, 4.0, delta);
    _tmpLookAt.y = THREE.MathUtils.damp(_tmpLookAt.y, s.cameraTarget.lookAt.y, 4.0, delta);
    _tmpLookAt.z = THREE.MathUtils.damp(_tmpLookAt.z, s.cameraTarget.lookAt.z, 4.0, delta);
    
    camera.lookAt(_tmpLookAt);
  });

  return null;
}

// ─── Scene Content ────────────────────────────────────────────

function SceneContent({ sceneStateRef }: SceneCanvasProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    const s = sceneStateRef.current;
    if (!s || !ambientRef.current) return;
    // Slightly pull ambient back during deep focus moments so highlights pop
    const focusIntensity = Math.max(s.anomalyState, s.c014Focus);
    ambientRef.current.intensity = 0.9 - focusIntensity * 0.25;
  });

  return (
    <group>
      {/* Cinematic Deep navy / charcoal */}
      <color attach="background" args={["#07111A"]} />
      {/* Exponential fog for atmospheric depth */}
      <fogExp2 attach="fog" args={["#07111A", 0.012]} />
      
      {/* ── LIGHTING ── */}
      {/* Low neutral ambient to prevent black crush while allowing contrast */}
      <ambientLight ref={ambientRef} color="#FFFFFF" intensity={0.15} />
      
      {/* Subtle hemisphere for vertical dimension (dark ground, bright sky) */}
      <hemisphereLight args={["#263746", "#07111A", 0.6]} />
      
      {/* Primary key light: strong directional shadow-casting light */}
      <directionalLight
        position={[-12, 18, 8]}
        intensity={2.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-camera-far={150}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Local Storytelling Spotlight — cool cyan/blue key light for TR-104 */}
      <spotLight
        position={[-1, 6, 62]}
        target-position={[2, 0.5, 60]}
        intensity={4.0}
        color="#39D9FF"
        angle={0.65}
        penumbra={0.8}
        distance={25}
        castShadow
      />

      {/* Subtle fill to lift shadows without coloring them */}
      <directionalLight position={[10, 5, -5]} intensity={0.5} color="#40596A" />
      
      {/* Subtle rim light for separation */}
      <directionalLight position={[0, 8, -20]} intensity={1.5} color="#283A48" />

      {/* ── SCENE ── */}
      <World />
      <ConsumerConnections />
      <PowerFlow />

      {/* Bloom: Restrained. Only affects emissive cyan/orange/red. */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={1.2}
          luminanceSmoothing={0.9}
          intensity={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </group>
  );
}

// ─── SceneCanvas ─────────────────────────────────────────────

export function SceneCanvas({ sceneStateRef }: SceneCanvasProps) {
  return (
    <SceneStateContext.Provider value={sceneStateRef}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [4, 5, 18], fov: 52, near: 0.1, far: 200 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.LinearToneMapping,
          toneMappingExposure: 1.0,
          powerPreference: "high-performance"
        }}
        shadows
        style={{ background: "#07111A" }}
        aria-label="Grid Intelligence Platform — cinematic 3D network visualization"
      >
        <CameraDriver sceneStateRef={sceneStateRef} />
        <SceneContent sceneStateRef={sceneStateRef} />
      </Canvas>
    </SceneStateContext.Provider>
  );
}

// ─── Default scene state ──────────────────────────────────────

export function createDefaultSceneState(): SceneState {
  return {
    progress: 0,
    cameraTarget: {
      position: new THREE.Vector3(0, 2, 16),
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    feederIntensity: 0.3,
    transformerScatter: 0,
    transformerFocusScale: 0,
    transformerOpacity: 1,
    nonTargetOpacity: 1,
    nonTargetScale: 1,
    transformerExplode: 0,
    connectionOpacity: 0,
    powerFlowIntensity: 0,
    consumerReveal: 0,
    consumerSeparation: 0,
    highlightConsumerScale: 1,
    priorityTrajectory: 0,
    c014Focus: 0,
    anomalyState: 0,
  };
}

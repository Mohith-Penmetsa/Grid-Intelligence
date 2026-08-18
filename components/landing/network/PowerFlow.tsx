"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  TRANSFORMER_CONFIGS,
  FEEDER_CONFIG,
  COLORS,
  TARGET_TRANSFORMER_INDEX,
} from "@/lib/landing/scene-config";
import { POWER_FLOW_CONFIG } from "@/lib/landing/animation-config";
import { useSceneState } from "@/lib/landing/scene-context";

// ─── PowerFlow ────────────────────────────────────────────────
// Particle points flowing from feeder → each transformer.
// Reads powerFlowIntensity from scene state each frame.

export function PowerFlow() {
  const pointsRef = useRef<THREE.Points>(null);
  const progressRef = useRef<Float32Array | null>(null);
  const sceneStateRef = useSceneState();

  const { paths, totalParticles } = useMemo(() => {
    const p: THREE.CatmullRomCurve3[] = TRANSFORMER_CONFIGS.map((config) => {
      const feeder = FEEDER_CONFIG.position;
      // Go down the main avenue
      const avenueNode = new THREE.Vector3(0, 2.5, config.position.z);
      // Then turn to the transformer
      return new THREE.CatmullRomCurve3([feeder, avenueNode, config.position]);
    });
    return {
      paths: p,
      totalParticles: TRANSFORMER_CONFIGS.length * POWER_FLOW_CONFIG.particlesPerLine,
    };
  }, []);

  const { geometry, particlePaths } = useMemo(() => {
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const progresses = new Float32Array(totalParticles);
    const pIdx: number[] = [];
    const _initVec = new THREE.Vector3();

    let idx = 0;
    paths.forEach((path, pi) => {
      // Create 3 distinct pulses per line, with 5 particles per pulse
      for (let i = 0; i < POWER_FLOW_CONFIG.particlesPerLine; i++) {
        const pulseGroup = Math.floor(i / 5);
        const pulseOffset = (i % 5) * 0.02;
        const t = (pulseGroup * 0.333 + pulseOffset) % 1.0;
        
        path.getPoint(t, _initVec);
        positions[idx * 3 + 0] = _initVec.x;
        positions[idx * 3 + 1] = _initVec.y;
        positions[idx * 3 + 2] = _initVec.z;
        progresses[idx] = t;
        pIdx.push(pi);
        idx++;
      }
    });
    progressRef.current = progresses;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geo, particlePaths: pIdx };
  }, [paths, totalParticles]);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      vertexColors: true,
      size: POWER_FLOW_CONFIG.particleSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  const _tmpFrameVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !progressRef.current) return;
    const s = sceneStateRef.current;
    const intensity = s?.powerFlowIntensity ?? 0;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
    const prog = progressRef.current;
    const speed = POWER_FLOW_CONFIG.baseSpeed + intensity * POWER_FLOW_CONFIG.activeSpeed * 0.4;
    
    const focus = s.transformerFocusScale; // 0 to 1

    for (let i = 0; i < totalParticles; i++) {
      // Modulo arithmetic for grouped energy pulses instead of uniform stream
      // Each path has distinct clusters of particles
      const pulseGroup = Math.floor((i % POWER_FLOW_CONFIG.particlesPerLine) / 5);
      
      const t = prog[i];
      // Subtle acceleration easing: power travels faster in the middle of the line, mimicking resistance near nodes
      const easedSpeed = speed * (0.6 + Math.sin(t * Math.PI) * 0.8);
      
      prog[i] = (prog[i] + delta * easedSpeed * 0.5) % 1;
      const pathIdx = particlePaths[i];
      paths[pathIdx].getPoint(prog[i], _tmpFrameVec);
      posAttr.setXYZ(i, _tmpFrameVec.x, _tmpFrameVec.y, _tmpFrameVec.z);
      
      // Color adjustment: dim non-target paths when focusing
      const isTarget = pathIdx === TARGET_TRANSFORMER_INDEX;
      let r, g, b;
      
      // Calculate individual particle brightness based on its pulse structure
      const pulseBrightness = 0.5 + 0.5 * Math.sin(pulseGroup * 2.0 + t * Math.PI * 4);
      
      if (isTarget) {
        // Target path pulses much brighter during focus
        const targetBoost = 1.0 + focus * 3.0;
        r = COLORS.powerFlowIntense.r * pulseBrightness * targetBoost; 
        g = COLORS.powerFlowIntense.g * pulseBrightness * targetBoost; 
        b = COLORS.powerFlowIntense.b * pulseBrightness * targetBoost;
      } else {
        // Non-target paths recede dramatically during focus
        const dim = Math.max(0.01, 1.0 - focus * 2.0);
        r = COLORS.powerFlowIntense.r * dim * pulseBrightness; 
        g = COLORS.powerFlowIntense.g * dim * pulseBrightness; 
        b = COLORS.powerFlowIntense.b * dim * pulseBrightness;
      }
      colAttr.setXYZ(i, r, g, b);
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Opacity: full on target path if transformer is focused
    material.opacity = Math.min(intensity * 0.8, 0.85);
    material.needsUpdate = true;
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ─── NetworkConnections ───────────────────────────────────────
// Line segments from feeder to transformers.
// Reads connectionOpacity from scene state.

export function NetworkConnections() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const sceneStateRef = useSceneState();

  const geometry = useMemo(() => {
    const verts: number[] = [];
    const colors: number[] = [];
    const feeder = FEEDER_CONFIG.position;
    TRANSFORMER_CONFIGS.forEach((config) => {
      verts.push(feeder.x, feeder.y, feeder.z);
      verts.push(config.position.x, config.position.y, config.position.z);
      // init colors to 0 (will set in useFrame)
      colors.push(0, 0, 0, 0, 0, 0); 
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  const material = useMemo(() =>
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    }), []);

  useFrame(() => {
    const s = sceneStateRef.current;
    if (!s || !linesRef.current) return;
    
    const colAttr = linesRef.current.geometry.attributes.color as THREE.BufferAttribute;
    const focus = s.transformerFocusScale;

    for (let i = 0; i < TRANSFORMER_CONFIGS.length; i++) {
      const isTarget = i === TARGET_TRANSFORMER_INDEX;
      let r, g, b;
      if (isTarget) {
        const boost = 1.0 + focus * 2.0;
        r = COLORS.connectionActive.r * boost; 
        g = COLORS.connectionActive.g * boost; 
        b = COLORS.connectionActive.b * boost;
      } else {
        const dim = Math.max(0.02, 1.0 - focus * 1.8);
        r = COLORS.connectionActive.r * dim; 
        g = COLORS.connectionActive.g * dim; 
        b = COLORS.connectionActive.b * dim;
      }
      colAttr.setXYZ(i * 2, r, g, b);
      colAttr.setXYZ(i * 2 + 1, r, g, b);
    }
    colAttr.needsUpdate = true;

    material.opacity = s.connectionOpacity;
    material.needsUpdate = true;
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  return <lineSegments ref={linesRef} geometry={geometry} material={material} />;
}

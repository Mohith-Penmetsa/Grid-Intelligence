"use client";

import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { TRANSFORMER_CONFIGS, TARGET_TRANSFORMER_INDEX } from "@/lib/landing/scene-config";
import { NETWORK_TOPOLOGY } from "@/lib/landing/network-topology";
import { TransformerNode } from "@/components/landing/network/TransformerNode";

function createHouseGeometry() {
  const body = new THREE.BoxGeometry(0.35, 0.3, 0.45);
  body.translate(0, 0.15, 0);
  
  const roof = new THREE.ConeGeometry(0.35, 0.15, 4);
  roof.rotateY(Math.PI / 4);
  roof.scale(1, 1, 1.3);
  roof.translate(0, 0.375, 0);
  
  const porch = new THREE.BoxGeometry(0.15, 0.15, 0.2);
  porch.translate(0, 0.075, 0.25);
  
  const windowGeom = new THREE.PlaneGeometry(0.1, 0.08);
  windowGeom.translate(0.08, 0.15, 0.226);
  
  return mergeBufferGeometries([body, porch, roof, windowGeom], true)!;
}

function createPoleGeometry() {
  const shaft = new THREE.CylinderGeometry(0.04, 0.05, 2.5, 6);
  shaft.translate(0, 1.25, 0); 
  
  const crossarm = new THREE.BoxGeometry(0.8, 0.05, 0.05);
  crossarm.translate(0, 2.2, 0);
  
  const insulator1 = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
  insulator1.translate(-0.35, 2.25, 0);
  
  const insulator2 = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
  insulator2.translate(0.35, 2.25, 0);

  return mergeBufferGeometries([shaft, crossarm, insulator1, insulator2], true) || shaft;
}

export function World() {
  const houseGeometry = useMemo(createHouseGeometry, []);
  const poleGeometry = useMemo(createPoleGeometry, []);
  
  const houseMaterials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: 0x2A3540, roughness: 0.9, metalness: 0.05 }), // body - dark concrete
    new THREE.MeshStandardMaterial({ color: 0x1B2A36, roughness: 0.85, metalness: 0.05 }), // porch
    new THREE.MeshStandardMaterial({ color: 0x101D29, roughness: 0.8, metalness: 0.1 }), // roof - dark slate
    new THREE.MeshStandardMaterial({ color: 0xFFD1A4, emissive: 0xFF9933, emissiveIntensity: 0.05 }), // window
  ], []);

  const poleMaterial = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: 0x344A5A, roughness: 0.85, metalness: 0.15 }), // shaft
    new THREE.MeshStandardMaterial({ color: 0x283A48, roughness: 0.8, metalness: 0.2 }), // crossarm
    new THREE.MeshStandardMaterial({ color: 0xD0D5D9, roughness: 0.2, metalness: 0.1 }), // insulator 1 ceramic
    new THREE.MeshStandardMaterial({ color: 0xD0D5D9, roughness: 0.2, metalness: 0.1 }), // insulator 2 ceramic
  ], []);

  const housesRef = useRef<THREE.InstancedMesh>(null);
  const polesRef = useRef<THREE.InstancedMesh>(null);

  // Consolidate instances
  const { houseMatrices, poleMatrices, cablesGeometry, roads } = useMemo(() => {
    const d = new THREE.Object3D();
    const hMats: THREE.Matrix4[] = [];
    const pMats: THREE.Matrix4[] = [];
    const tubes: THREE.TubeGeometry[] = [];
    const roadData: { pos: [number, number, number], rot: [number, number, number], scale: [number, number] }[] = [];

    // Main Avenue
    roadData.push({ pos: [0, 0.02, 50], rot: [-Math.PI / 2, 0, 0], scale: [3.0, 150] });

    NETWORK_TOPOLOGY.forEach(t => {
      // Transformer side streets
      t.branches.forEach(b => {
        // Find center of branch
        if (b.poles.length > 0) {
          const first = b.poles[0].position;
          const last = b.poles[b.poles.length - 1].position;
          const dist = first.distanceTo(last) + 6;
          const center = new THREE.Vector3().addVectors(first, last).multiplyScalar(0.5);
          const angle = Math.atan2(b.direction.x, b.direction.z);
          roadData.push({ pos: [center.x, 0.02, center.z], rot: [-Math.PI / 2, 0, angle], scale: [1.5, dist] });
        }

        let prevPolePos: THREE.Vector3 | null = null;

        b.poles.forEach(p => {
          d.position.copy(p.position);
          d.rotation.set(0, p.rotationY, 0);
          d.scale.setScalar(1);
          d.updateMatrix();
          pMats.push(d.matrix.clone());

          // Primary cable connecting poles
          const poleTop = p.position.clone().add(new THREE.Vector3(0, 2.3, 0));
          if (prevPolePos) {
            const curve = new THREE.CatmullRomCurve3([
              prevPolePos,
              new THREE.Vector3((prevPolePos.x+poleTop.x)/2, ((prevPolePos.y+poleTop.y)/2) - 0.2, (prevPolePos.z+poleTop.z)/2),
              poleTop
            ]);
            tubes.push(new THREE.TubeGeometry(curve, 6, 0.015, 3, false));
          }
          prevPolePos = poleTop;
        });
      });

      // Houses and service drops
      t.houses.forEach(h => {
        d.position.copy(h.position);
        d.rotation.set(0, h.rotationY, 0);
        d.scale.setScalar(1);
        d.updateMatrix();
        hMats.push(d.matrix.clone());

        const pole = t.poles.find(p => p.globalIndex === h.poleId);
        if (pole) {
          const poleTop = pole.position.clone().add(new THREE.Vector3(0, 1.8, 0));
          const houseRoof = h.position.clone().add(new THREE.Vector3(0, 0.35, 0));
          const curve = new THREE.CatmullRomCurve3([
            poleTop,
            new THREE.Vector3((poleTop.x+houseRoof.x)/2, ((poleTop.y+houseRoof.y)/2) - 0.1, (poleTop.z+houseRoof.z)/2),
            houseRoof
          ]);
          tubes.push(new THREE.TubeGeometry(curve, 4, 0.008, 3, false));
        }
      });
    });

    return {
      houseMatrices: hMats,
      poleMatrices: pMats,
      cablesGeometry: tubes.length > 0 ? mergeBufferGeometries(tubes) : null,
      roads: roadData
    };
  }, []);

  useEffect(() => {
    if (housesRef.current) {
      houseMatrices.forEach((m, i) => housesRef.current!.setMatrixAt(i, m));
      housesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (polesRef.current) {
      poleMatrices.forEach((m, i) => polesRef.current!.setMatrixAt(i, m));
      polesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [houseMatrices, poleMatrices]);

  return (
    <group>
      {/* Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
         <planeGeometry args={[500, 500]} />
         <meshStandardMaterial color={0x1B2A36} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Roads */}
      {roads.map((r, i) => (
        <mesh key={`road-${i}`} position={new THREE.Vector3(...r.pos)} rotation={new THREE.Euler(...r.rot)} receiveShadow>
           <planeGeometry args={r.scale as [number, number]} />
           <meshStandardMaterial color={0x243746} roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* Transformer Pads & Transformers */}
      {TRANSFORMER_CONFIGS.map((config, i) => (
        <group key={`t-group-${i}`}>
          <mesh position={[config.position.x, 0.04, config.position.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
             <planeGeometry args={[3, 3]} />
             <meshStandardMaterial color={0x243746} roughness={0.9} metalness={0.05} />
          </mesh>
          <TransformerNode config={config} />
        </group>
      ))}

      {/* Substation */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[4, 0.04, 4]} />
        <meshStandardMaterial color={0x243746} roughness={0.9} />
      </mesh>
      <mesh position={[-5, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 4, 8]} />
        <meshStandardMaterial color={0x2A3540} roughness={0.85} />
      </mesh>

      {/* Instanced Geometry */}
      <instancedMesh ref={housesRef} args={[houseGeometry, houseMaterials as any, houseMatrices.length]} castShadow receiveShadow />
      <instancedMesh ref={polesRef} args={[poleGeometry, poleMaterial as any, poleMatrices.length]} castShadow receiveShadow />

      {/* Cables */}
      {cablesGeometry && (
        <mesh geometry={cablesGeometry} castShadow receiveShadow>
          <meshStandardMaterial color={0x1B2A36} roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

import * as THREE from "three";
import { TRANSFORMER_CONFIGS } from "./scene-config";

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export interface HouseTopology {
  id: number;
  globalIndex: number;
  position: THREE.Vector3;
  rotationY: number;
  poleId: number;
  isPriority?: boolean;
}

export interface PoleTopology {
  id: number;
  globalIndex: number;
  position: THREE.Vector3;
  rotationY: number;
  branchId: number;
  isEndNode: boolean;
  distanceFromTransformer: number;
}

export interface BranchTopology {
  id: number;
  direction: THREE.Vector3;
  poles: PoleTopology[];
}

export interface TransformerTopology {
  transformerIndex: number;
  branches: BranchTopology[];
  houses: HouseTopology[];
  poles: PoleTopology[];
}

export function buildNetworkTopology(): TransformerTopology[] {
  const topologies: TransformerTopology[] = [];
  let globalHouseIndex = 0;
  let globalPoleIndex = 0;

  TRANSFORMER_CONFIGS.forEach((config, tIdx) => {
    const branches: BranchTopology[] = [];
    const allHouses: HouseTopology[] = [];
    const allPoles: PoleTopology[] = [];

    // Each transformer feeds one main side street branching off the main avenue.
    // The direction depends on which side of the main avenue the transformer is on.
    const isLeftSide = config.position.x < 0;
    const dirX = isLeftSide ? -1 : 1;
    const dir = new THREE.Vector3(dirX, 0, 0); // Direction of the side street
    
    // We also add a small branching street halfway down
    const numBranches = 2; 

    for (let b = 0; b < numBranches; b++) {
      const branchDir = b === 0 ? dir : new THREE.Vector3(0, 0, 1); // 2nd branch goes parallel to main avenue
      const right = new THREE.Vector3(-branchDir.z, 0, branchDir.x).normalize();
      
      const branchPoles: PoleTopology[] = [];
      const polesPerBranch = b === 0 ? 6 : 3; 

      // Start position for poles
      let currentPos = config.position.clone();
      if (b === 1) {
        // Start the 2nd branch halfway down the first branch
        currentPos.addScaledVector(dir, 3 * 3.5); 
      }

      for (let p = 0; p < polesPerBranch; p++) {
        const seed = tIdx * 100 + b * 10 + p;
        
        // Move pole forward along the street
        const poleSpacing = 3.5 + seededRandom(seed) * 0.5;
        currentPos.addScaledVector(branchDir, poleSpacing);

        const polePos = currentPos.clone();
        polePos.y = -0.15; // Ground level
        
        // Align crossarms perpendicular to the street
        const poleRotationY = Math.atan2(branchDir.x, branchDir.z) + Math.PI / 2;

        const pole: PoleTopology = {
          id: p,
          globalIndex: globalPoleIndex++,
          position: polePos,
          rotationY: poleRotationY, 
          branchId: b,
          isEndNode: p === polesPerBranch - 1,
          distanceFromTransformer: polePos.distanceTo(config.position)
        };
        
        branchPoles.push(pole);
        allPoles.push(pole);

        // Houses per pole
        // To get roughly 64 houses total (6 poles + 3 poles = 9 poles. 9 * 7 = 63 houses)
        const housesPerPole = p === 0 && b === 0 ? 0 : 7; // Leave space near transformer

        for (let h = 0; h < housesPerPole; h++) {
          const side = h % 2 === 0 ? 1 : -1;
          const depthIdx = Math.floor(h / 2); // 0, 1, 2, 3
          
          const setback = 1.0 + seededRandom(seed + h * 5) * 0.2;
          // Stagger houses along the street
          const depthOffset = (depthIdx * 1.2 - 1.8) + (seededRandom(seed + h * 7) - 0.5) * 0.3;
          
          const housePos = polePos.clone().addScaledVector(right, side * setback);
          housePos.addScaledVector(branchDir, depthOffset);
          housePos.y = 0; // strict ground level

          // House faces the road
          const rotationY = Math.atan2(branchDir.x, branchDir.z) + (side === 1 ? -Math.PI/2 : Math.PI/2);

          allHouses.push({
            id: h,
            globalIndex: globalHouseIndex++,
            position: housePos,
            rotationY: rotationY,
            poleId: pole.globalIndex
          });
        }
      }
      
      branches.push({
        id: b,
        direction: branchDir,
        poles: branchPoles
      });
    }

    topologies.push({
      transformerIndex: tIdx,
      branches,
      houses: allHouses,
      poles: allPoles
    });
  });

  // Assign priority to 4 specific houses in the target cluster for storytelling
  const targetCluster = topologies[3]; // TR-104 is index 3
  if (targetCluster && targetCluster.houses.length > 10) {
    targetCluster.houses[4].isPriority = true;
    targetCluster.houses[7].isPriority = true;
    targetCluster.houses[12].isPriority = true;
    // C-014 (our hero consumer)
    targetCluster.houses[14].isPriority = true;
  }

  return topologies;
}

export const NETWORK_TOPOLOGY = buildNetworkTopology();

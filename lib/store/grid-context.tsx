"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Transformer, Consumer, Inspection, Officer, Settings, InspectionOutcome, FieldEvidenceItem } from "./types";
import { INITIAL_TRANSFORMERS, INITIAL_CONSUMERS, INITIAL_INSPECTIONS, MOCK_OFFICERS, INITIAL_SETTINGS, INITIAL_OUTCOMES } from "./mock-data";

interface GridState {
  transformers: Transformer[];
  consumers: Consumer[];
  inspections: Inspection[];
  officers: Officer[];
  outcomes: InspectionOutcome[];
  settings: Settings;
  
  createInspection: (inspection: Omit<Inspection, "id" | "createdAt" | "status">) => void;
  assignOfficer: (inspectionId: string, officerId: string) => void;
  startInspection: (inspectionId: string) => void;
  updateEvidence: (inspectionId: string, evidenceId: string, updates: Partial<FieldEvidenceItem>) => void;
  completeInspection: (inspectionId: string, outcome: Omit<InspectionOutcome, "id" | "timestamp">, fieldObservations: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const GridContext = createContext<GridState | undefined>(undefined);

export function GridProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [transformers, setTransformers] = useState<Transformer[]>(INITIAL_TRANSFORMERS);
  const [consumers, setConsumers] = useState<Consumer[]>(INITIAL_CONSUMERS);
  const [officers] = useState<Officer[]>(MOCK_OFFICERS);
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [outcomes, setOutcomes] = useState<InspectionOutcome[]>(INITIAL_OUTCOMES);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  useEffect(() => {
    const version = localStorage.getItem("grid_version");
    if (version !== "2") {
      localStorage.clear();
      localStorage.setItem("grid_version", "2");
      setIsLoaded(true);
      return;
    }

    const savedInspections = localStorage.getItem("grid_inspections");
    if (savedInspections) setInspections(JSON.parse(savedInspections));
    
    const savedOutcomes = localStorage.getItem("grid_outcomes");
    if (savedOutcomes) setOutcomes(JSON.parse(savedOutcomes));

    const savedSettings = localStorage.getItem("grid_settings");
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("grid_inspections", JSON.stringify(inspections));
    }
  }, [inspections, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("grid_outcomes", JSON.stringify(outcomes));
    }
  }, [outcomes, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("grid_settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const createInspection = (partial: Omit<Inspection, "id" | "createdAt" | "status">) => {
    const newInspection: Inspection = {
      ...partial,
      id: `INS-${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: new Date().toISOString(),
      status: partial.officerId ? "assigned" : "pending",
    };
    setInspections(prev => [newInspection, ...prev]);
  };

  const assignOfficer = (inspectionId: string, officerId: string) => {
    setInspections(prev => prev.map(ins => 
      ins.id === inspectionId 
        ? { ...ins, officerId, status: ins.status === "pending" ? "assigned" : ins.status } 
        : ins
    ));
  };

  const startInspection = (inspectionId: string) => {
    setInspections(prev => prev.map(ins => 
      ins.id === inspectionId ? { ...ins, status: "in_progress" } : ins
    ));
  };

  const updateEvidence = (inspectionId: string, evidenceId: string, updates: Partial<FieldEvidenceItem>) => {
    setInspections(prev => prev.map(ins => {
      if (ins.id === inspectionId) {
        return {
          ...ins,
          evidence: ins.evidence.map(ev => ev.id === evidenceId ? { ...ev, ...updates } : ev)
        };
      }
      return ins;
    }));
  };

  const completeInspection = (inspectionId: string, outcomePartial: Omit<InspectionOutcome, "id" | "timestamp">, fieldObservations: string) => {
    const outcomeId = `OUT-${Math.floor(Math.random() * 9000) + 1000}`;
    const newOutcome: InspectionOutcome = {
      ...outcomePartial,
      id: outcomeId,
      timestamp: new Date().toISOString()
    };
    
    setOutcomes(prev => [...prev, newOutcome]);
    
    setInspections(prev => prev.map(ins => 
      ins.id === inspectionId ? { 
        ...ins, 
        status: "completed", 
        outcomeId,
        fieldObservations,
        actualFinding: outcomePartial.actualFinding
      } : ins
    ));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  if (!isLoaded) return null;

  return (
    <GridContext.Provider value={{
      transformers,
      consumers,
      inspections,
      officers,
      outcomes,
      settings,
      createInspection,
      assignOfficer,
      startInspection,
      updateEvidence,
      completeInspection,
      updateSettings
    }}>
      {children}
    </GridContext.Provider>
  );
}

export function useGridState() {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error("useGridState must be used within a GridProvider");
  }
  return context;
}



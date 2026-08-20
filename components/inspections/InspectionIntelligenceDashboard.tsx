"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InspectionTable } from "./InspectionTable";
import { InspectionDetail } from "./InspectionDetail";
import { useGridState } from "@/lib/store/grid-context";

export function InspectionIntelligenceDashboard() {
  const { inspections } = useGridState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const analysisRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    if (activeFilter === "all") return inspections;
    if (activeFilter === "critical") return inspections.filter(d => d.priority === "critical");
    if (activeFilter === "high") return inspections.filter(d => d.priority === "high");
    if (activeFilter === "pending") return inspections.filter(d => d.status === "pending");
    if (activeFilter === "assigned") return inspections.filter(d => d.status === "assigned");
    if (activeFilter === "in_progress") return inspections.filter(d => d.status === "in_progress");
    if (activeFilter === "completed") return inspections.filter(d => d.status === "completed");
    return inspections;
  }, [inspections, activeFilter]);

  const selectedInspection = useMemo(() => {
    return selectedId ? inspections.find((a) => a.id === selectedId) : null;
  }, [selectedId, inspections]);

  useEffect(() => {
    if (selectedId && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  const stats = {
    pending: inspections.filter(d => d.status === "pending").length,
    critical: inspections.filter(d => d.priority === "critical").length,
    inProgress: inspections.filter(d => d.status === "assigned" || d.status === "in_progress").length,
    completed: inspections.filter(d => d.status === "completed").length,
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      {/* KPI Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Pending</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-amber-500">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Critical Priority</span>
              <div className="h-8 w-8 rounded-full bg-risk-critical/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-risk-critical" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-risk-critical">{stats.critical}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Active / Assigned</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-primary">{stats.inProgress}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Completed</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-emerald-500">{stats.completed}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Table & Filters */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-tight text-foreground/90 uppercase whitespace-nowrap">
            Inspection Queue
          </h2>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 hide-scrollbar w-full xl:w-auto">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mr-2">Filters:</span>
            <div className="flex gap-2">
              {["all", "critical", "high", "pending", "assigned", "in_progress", "completed"].map(f => (
                <Badge 
                  key={f}
                  variant="outline" 
                  className={`cursor-pointer whitespace-nowrap transition-colors uppercase text-[10px] ${activeFilter === f ? "bg-primary/20 text-primary border-primary/50" : "hover:bg-surface-3"}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <InspectionTable 
          data={filteredData}
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
      </section>

      {/* Expandable Analysis Section */}
      <section className="w-full scroll-mt-24" ref={analysisRef}>
        {selectedInspection ? (
          <InspectionDetail 
            inspection={selectedInspection} 
            onClose={() => setSelectedId(null)} 
          />
        ) : (
          <div className="flex h-[120px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
            <p className="text-sm text-muted-foreground">
              Select an inspection to view details and field evidence
            </p>
          </div>
        )}
      </section>
    </div>
  );
}


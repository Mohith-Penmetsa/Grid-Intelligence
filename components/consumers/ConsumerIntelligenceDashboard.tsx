"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, Zap, IndianRupee } from "lucide-react";
import { ConsumerTable } from "./ConsumerTable";
import { ConsumerDetail } from "./ConsumerDetail";
import { getAllAnalyzedConsumers, ConsumerRiskAnalysis } from "@/lib/intelligence/consumer-risk";
import { Badge } from "@/components/ui/badge";

export function ConsumerIntelligenceDashboard() {
  const [selectedConsumerId, setSelectedConsumerId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const analysisRef = useRef<HTMLDivElement>(null);

  const allData = getAllAnalyzedConsumers();

  const filteredData = useMemo(() => {
    if (activeFilter === "critical") return allData.filter(d => d.riskLevel === "critical");
    if (activeFilter === "high") return allData.filter(d => d.riskLevel === "high");
    if (activeFilter === "abnormal") return allData.filter(d => d.deviationPercentage > 20);
    return allData;
  }, [allData, activeFilter]);

  const selectedAnalysis = useMemo(() => {
    return selectedConsumerId ? allData.find((a) => a.data.id === selectedConsumerId) : null;
  }, [selectedConsumerId, allData]);

  useEffect(() => {
    if (selectedConsumerId && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedConsumerId]);

  const stats = {
    total: allData.length,
    highRisk: allData.filter((d) => d.riskLevel === "critical" || d.riskLevel === "high").length,
    abnormal: allData.filter((d) => d.deviationPercentage > 20).length,
    exposure: allData.reduce((acc, curr) => acc + curr.commercialLossExposure, 0),
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* KPI Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Consumers Analyzed</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-foreground">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">High-Risk Consumers</span>
              <div className="h-8 w-8 rounded-full bg-risk-critical/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-risk-critical" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-risk-critical">{stats.highRisk}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Abnormal Consumption</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-amber-500">{stats.abnormal}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border/50">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Estimated Exposure</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-emerald-500">{stats.exposure}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Table */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-tight text-foreground/90 uppercase">
            Consumer Ranking
          </h2>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mr-2">Filters:</span>
            <Badge 
              variant="outline" 
              className={`cursor-pointer whitespace-nowrap transition-colors ${activeFilter === "all" ? "bg-primary/20 text-primary border-primary/50" : "hover:bg-surface-3"}`}
              onClick={() => setActiveFilter("all")}
            >
              All Consumers
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer whitespace-nowrap transition-colors ${activeFilter === "critical" ? "bg-risk-critical/20 text-risk-critical border-risk-critical/50" : "hover:bg-surface-3"}`}
              onClick={() => setActiveFilter("critical")}
            >
              Critical Risk
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer whitespace-nowrap transition-colors ${activeFilter === "abnormal" ? "bg-amber-500/20 text-amber-500 border-amber-500/50" : "hover:bg-surface-3"}`}
              onClick={() => setActiveFilter("abnormal")}
            >
              Abnormal Deviation
            </Badge>
          </div>
        </div>
        
        <ConsumerTable 
          data={filteredData}
          selectedId={selectedConsumerId} 
          onSelect={setSelectedConsumerId} 
        />
      </section>

      {/* Expandable Analysis Section */}
      <section className="w-full scroll-mt-24" ref={analysisRef}>
        {selectedAnalysis ? (
          <ConsumerDetail 
            analysis={selectedAnalysis} 
            onClose={() => setSelectedConsumerId(null)} 
          />
        ) : (
          <div className="flex h-[120px] items-center justify-center rounded-lg border border-border border-dashed bg-surface-2/30">
            <p className="text-sm text-muted-foreground">
              Select a consumer to view intelligence analysis
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

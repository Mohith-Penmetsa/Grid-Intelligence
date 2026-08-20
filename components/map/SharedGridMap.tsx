"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGridState } from "@/lib/store/grid-context";
import { calculateConsumerRisk, calculateTransformerRisk } from "@/lib/intelligence/risk-engine";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fix leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const transformerIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 1px;"></div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

function MapController({ focusId }: { focusId: string | null }) {
  const map = useMap();
  const { transformers, consumers } = useGridState();

  useEffect(() => {
    if (focusId) {
      const t = transformers.find(tr => tr.id === focusId);
      if (t) {
        map.flyTo([t.coordinates.lat, t.coordinates.lng], 16, { duration: 1.5 });
        return;
      }
      const c = consumers.find(co => co.id === focusId);
      if (c) {
        map.flyTo([c.coordinates.lat, c.coordinates.lng], 17, { duration: 1.5 });
      }
    }
  }, [focusId, map, transformers, consumers]);

  return null;
}

export default function SharedGridMap() {
  const { transformers, consumers, inspections, settings } = useGridState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const focusId = searchParams.get("focus");

  const center: [number, number] = [16.5449, 81.5212]; // Default center

  const getRiskColor = (level: string) => {
    if (level === "critical") return "#ef4444"; // red-500
    if (level === "high") return "#f97316"; // orange-500
    if (level === "medium") return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={13} className="h-full w-full z-0" zoomControl={false}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController focusId={focusId} />

        {transformers.map(t => {
          const tRisk = calculateTransformerRisk(t, consumers, settings);
          const tColor = getRiskColor(tRisk.level);
          const tInspections = inspections.filter(i => i.transformerId === t.id && i.status !== "completed");
          
          return (
            <div key={t.id}>
              <Marker position={[t.coordinates.lat, t.coordinates.lng]} icon={transformerIcon(tColor)}>
                <Popup className="custom-popup">
                  <div className="p-1 flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{t.id}</span>
                      <Badge variant="outline" style={{ borderColor: tColor, color: tColor }}>{tRisk.level}</Badge>
                    </div>
                    <span className="text-xs">{t.area}</span>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Comm Loss:</span>
                      <span className="font-semibold">{t.commLoss} U</span>
                    </div>
                    {tInspections.length > 0 && (
                      <span className="text-xs font-semibold text-primary">Active Inspection: {tInspections[0].id}</span>
                    )}
                    <Button size="sm" className="w-full h-7 mt-2" onClick={() => router.push(`/transformers/${t.id}`)}>View Details</Button>
                  </div>
                </Popup>
              </Marker>
              
              {/* Draw lines to consumers */}
              {consumers.filter(c => c.transformerId === t.id).map(c => {
                const cRisk = calculateConsumerRisk(c, settings);
                const cColor = getRiskColor(cRisk.level);
                
                return (
                  <div key={c.id}>
                    <Polyline 
                      positions={[
                        [t.coordinates.lat, t.coordinates.lng],
                        [c.coordinates.lat, c.coordinates.lng]
                      ]}
                      pathOptions={{ color: tColor, weight: 1, opacity: 0.3, dashArray: "4, 6" }}
                    />
                    <Marker position={[c.coordinates.lat, c.coordinates.lng]} icon={createIcon(cColor)}>
                      <Popup>
                        <div className="p-1 flex flex-col gap-2 min-w-[180px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{c.id}</span>
                            <Badge variant="outline" style={{ borderColor: cColor, color: cColor }}>{cRisk.score}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{c.meterId}</span>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Deviation:</span>
                            <span className="font-semibold text-destructive">{c.expectedConsumption - c.actualConsumption} U</span>
                          </div>
                          <Button size="sm" variant="outline" className="w-full h-7 mt-2" onClick={() => router.push(`/consumers/${c.id}`)}>View Profile</Button>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                );
              })}
            </div>
          );
        })}
      </MapContainer>
      
      {/* Legend overlay */}
      <Card className="absolute bottom-6 left-6 z-[1000] p-4 bg-surface-1/90 backdrop-blur border-border/50 shadow-lg">
        <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider">Legend</h4>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#ef4444] rounded border border-white"></div>
            <span>Critical Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#f97316] rounded border border-white"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#f59e0b] rounded border border-white"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#10b981] rounded border border-white"></div>
            <span>Safe / Nominal</span>
          </div>
          <div className="h-px bg-border/50 my-1 w-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-transparent border-2 border-white rounded-[4px] flex items-center justify-center">
              <div className="w-1 h-1 bg-white"></div>
            </div>
            <span>Transformer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-transparent border-2 border-white rounded-full"></div>
            <span>Consumer Node</span>
          </div>
        </div>
      </Card>
    </div>
  );
}


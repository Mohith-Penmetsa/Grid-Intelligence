import { PageShell } from "@/components/shared/PageShell";
import MapWrapper from "@/components/map/MapWrapper";

export default function MapPage() {
  return (
    <PageShell
      title="Shared Grid Map"
      description="Spatial view of network infrastructure, anomalies, and active field operations."
    >
      <div className="h-[calc(100vh-180px)] w-full rounded-xl overflow-hidden border border-border/50 shadow-lg">
        <MapWrapper />
      </div>
    </PageShell>
  );
}


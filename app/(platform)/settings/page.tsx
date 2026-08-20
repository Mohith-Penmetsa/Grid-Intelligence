import { PageShell } from "@/components/shared/PageShell";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <PageShell
      title="System Settings"
      description="Configure risk thresholds and operational intelligence parameters."
    >
      <SettingsPanel />
    </PageShell>
  );
}


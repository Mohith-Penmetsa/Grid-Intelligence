import { PageShell } from "@/components/shared/PageShell";
import { InspectorWorkspace } from "@/components/workspace/InspectorWorkspace";

export default function WorkspacePage() {
  return (
    <PageShell
      title="Inspector Workspace"
      description="Field execution environment for active inspections and evidence collection."
    >
      <InspectorWorkspace />
    </PageShell>
  );
}


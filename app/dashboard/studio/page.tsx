import { DashboardShell } from "../../../components/dashboard-shell";
import { VideoCreationWorkflow } from "../../../components/video-creation-workflow";

export default function StudioPage() {
  return (
    <DashboardShell
      title="Video Studio"
      subtitle="Import listing photos, direct each scene, add branding, and prepare every export format in one guided workflow."
    >
      <VideoCreationWorkflow />
    </DashboardShell>
  );
}

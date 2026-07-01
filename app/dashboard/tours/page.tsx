import { DashboardShell } from "../../../components/dashboard-shell";
import { VirtualTourStudio } from "../../../components/virtual-tour-studio";

export default function ToursPage() {
  return (
    <DashboardShell
      title="Virtual Tour Studio"
      subtitle="Connect listing rooms with interactive hotspots and publish a smooth, mobile-friendly walkthrough."
    >
      <VirtualTourStudio />
    </DashboardShell>
  );
}

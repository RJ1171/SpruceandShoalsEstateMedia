import { Activity, Flag, LifeBuoy, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { DashboardShell } from "../../components/dashboard-shell";
import { Card } from "../../components/ui/card";

const tools: Array<[string, LucideIcon]> = [
  ["User management", Users],
  ["Usage analytics", Activity],
  ["Feature flags", Flag],
  ["System monitoring", ShieldCheck],
  ["Support tools", LifeBuoy],
  ["Content moderation", ShieldCheck]
];

export default function AdminPage() {
  return (
    <DashboardShell title="Admin Panel" subtitle="Operational controls for growth, support, reliability, and responsible content governance.">
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map(([label, Icon]) => (
          <Card key={label} className="p-6">
            <Icon size={24} className="text-gold" />
            <h2 className="mt-4 font-serif text-2xl font-semibold text-pine">{label}</h2>
            <p className="mt-3 text-sm leading-6 text-charcoal/70">Production module placeholder ready for RBAC, audit logs, and metrics instrumentation.</p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

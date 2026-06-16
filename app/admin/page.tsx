import { Activity, DollarSign, Flag, Gauge, LifeBuoy, ServerCog, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { DashboardShell } from "../../components/dashboard-shell";
import { Card } from "../../components/ui/card";
import { estimatedCostPerVideo, estimatedMonthlyCapacity, formatCurrency, grossMargin, operatingSnapshot, packagePlans, videoCostModel } from "../../config/business";

const tools: Array<[string, LucideIcon]> = [
  ["User management", Users],
  ["Usage analytics", Activity],
  ["Feature flags", Flag],
  ["System monitoring", ShieldCheck],
  ["Support tools", LifeBuoy],
  ["Content moderation", ShieldCheck]
];

export default function AdminPage() {
  const capacity = estimatedMonthlyCapacity();
  const starter = packagePlans[0];
  const highestPlan = packagePlans[packagePlans.length - 1];

  return (
    <DashboardShell title="Admin Panel" subtitle="Operational controls for growth, support, reliability, and responsible content governance.">
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          ["Unit cost", formatCurrency(estimatedCostPerVideo), "All-in estimated cost per rendered video.", DollarSign],
          ["Capacity", `${capacity.toLocaleString()} / mo`, `${operatingSnapshot.concurrentRenderSlots} render slots at ${operatingSnapshot.averageRenderMinutes} min average.`, ServerCog],
          ["Starter margin", `${Math.round(grossMargin(starter.price, starter.videos) * 100)}%`, `${starter.name} package after variable video cost.`, Gauge],
          ["Team margin", `${Math.round(grossMargin(highestPlan.price, highestPlan.videos) * 100)}%`, `${highestPlan.name} package after variable video cost.`, Activity]
        ].map(([label, value, copy, Icon]) => (
          <Card key={label as string} className="outline-tile p-5">
            <Icon className="text-gold" size={21} />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/45">{label as string}</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-pine">{value as string}</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/65">{copy as string}</p>
          </Card>
        ))}
      </div>
      <Card className="mb-6 corner-frame p-6">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Cost displacement</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-pine">Benchmark against $80 for 3 videos</h2>
            <p className="mt-3 text-sm leading-6 text-charcoal/65">The current variable estimate is {formatCurrency(estimatedCostPerVideo)} per finished video, or {formatCurrency(estimatedCostPerVideo * videoCostModel.defaultMonthlyVideos)} for a 3-video bundle before fixed operating costs.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Render compute", videoCostModel.renderCompute],
              ["Storage + bandwidth", videoCostModel.storageAndBandwidth],
              ["AI copy + metadata", videoCostModel.aiCopyAndMetadata],
              ["Platform overhead", videoCostModel.platformOverhead]
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md border border-pine/15 bg-cream p-4">
                <p className="text-sm font-semibold text-pine">{label as string}</p>
                <p className="mt-2 font-serif text-2xl font-semibold text-gold">{formatCurrency(value as number)}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
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

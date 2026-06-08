import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-charcoal/60">{label}</p>
      <p className="mt-3 font-serif text-4xl font-semibold text-pine">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gold">{detail}</p>
    </Card>
  );
}

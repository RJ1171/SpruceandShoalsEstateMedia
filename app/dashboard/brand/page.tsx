import { brand } from "../../../config/brand";
import { DashboardShell } from "../../../components/dashboard-shell";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export default function BrandPage() {
  return (
    <DashboardShell title="Brand Center" subtitle="Control logos, colors, fonts, agent details, brokerage details, disclosures, and contact information.">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="corner-frame p-6">
          <h2 className="font-serif text-3xl font-semibold text-pine">Active profile</h2>
          <div className="editorial-rule mt-4" />
          <p className="mt-4 text-sm leading-6 text-charcoal/70">{brand.defaultBrandProfile.agentName}</p>
          <p className="text-sm leading-6 text-charcoal/70">{brand.defaultBrandProfile.brokerageName}</p>
          <div className="mt-6 flex gap-2">
            {Object.entries(brand.colors).slice(0, 6).map(([name, value]) => (
              <span key={name} className="h-11 w-11 rounded-md border border-pine/20 shadow-sm" style={{ backgroundColor: value }} title={name} />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-serif text-3xl font-semibold text-pine">Editable fields</h2>
          <div className="editorial-rule mt-4" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {["Logo", "Primary color", "Display font", "Agent name", "Brokerage", "Phone", "Email", "Compliance disclosure"].map((field) => (
              <label key={field} className="text-sm font-semibold text-pine">
                {field}
                <input className="mt-2 h-11 w-full rounded-md border border-pine/25 bg-cream px-3 text-sm outline-none shadow-inner focus:border-gold focus:bg-white" placeholder={`Update ${field.toLowerCase()}`} />
              </label>
            ))}
          </div>
          <Button className="mt-6">Save brand profile</Button>
        </Card>
      </div>
    </DashboardShell>
  );
}

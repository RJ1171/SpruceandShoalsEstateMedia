import Link from "next/link";
import { BadgeCheck, BarChart3, DollarSign, Gauge, Plus, UploadCloud, Wand2 } from "lucide-react";
import { DashboardShell } from "../../components/dashboard-shell";
import { buttonClassName } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { estimatedCostPerVideo, formatCurrency, grossMargin, operatingSnapshot, packagePlans, videoCostModel } from "../../config/business";

export default function DashboardPage() {
  const threeVideoCost = estimatedCostPerVideo * videoCostModel.defaultMonthlyVideos;
  const displacementSavings = videoCostModel.competitorThreePack - threeVideoCost;

  return (
    <DashboardShell title="Dashboard" subtitle="Monitor listing launches, usage, and the next best actions for the team.">
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          ["Cost / video", formatCurrency(estimatedCostPerVideo), "Estimated render, storage, AI, and platform overhead.", DollarSign],
          ["3-video cost", formatCurrency(threeVideoCost), `Compared with the $${videoCostModel.competitorThreePack} going-rate benchmark.`, BarChart3],
          ["Displacement", formatCurrency(displacementSavings), "Room to undercut market price while protecting margin.", Gauge],
          ["Current usage", `${operatingSnapshot.videosGeneratedMonth}`, "Videos generated this month.", BadgeCheck]
        ].map(([label, value, copy, Icon]) => (
          <Card key={label as string} className="outline-tile p-5">
            <Icon className="text-gold" size={21} />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/45">{label as string}</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-pine">{value as string}</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/65">{copy as string}</p>
          </Card>
        ))}
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          ["Project setup", "Add listing details, photos, and description notes."],
          ["Brand package", "Prepare logos, headshots, colors, and disclosures."],
          ["AI workspace", "Generate copy and scripts after the first project is uploaded."]
        ].map(([title, copy]) => (
          <Card key={title} className="outline-tile p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/40 bg-white">
              <BadgeCheck className="text-gold" size={20} />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-pine">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-charcoal/65">{copy}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="corner-frame p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-3xl font-semibold text-pine">Recent projects</h2>
            <Link href="/dashboard/projects" className={buttonClassName("secondary")}>View all</Link>
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-dashed border-gold/70 bg-cream shadow-inner">
            <div className="grid gap-5 p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div className="aspect-[4/3] rounded-lg border border-pine/20 bg-[linear-gradient(135deg,#0F2C25,#F7F3EA_62%,#C8A45D)] shadow-inner" />
              <div>
                <UploadCloud className="text-gold" size={34} />
                <p className="mt-3 font-semibold text-pine">No projects yet</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-charcoal/65">Create your first listing package by uploading photos, property details, brand assets, and description notes.</p>
                <Link href="/dashboard/studio" className={buttonClassName("primary", "mt-5")}>Start first project <Plus size={16} /></Link>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-serif text-3xl font-semibold text-pine">Quick actions</h2>
          <div className="editorial-rule mt-4" />
          <div className="mt-6 space-y-3">
            <Link href="/dashboard/studio" className={buttonClassName("primary", "w-full justify-start")}><Plus size={16} /> Create project</Link>
            <Link href="/dashboard/media" className={buttonClassName("secondary", "w-full justify-start")}><UploadCloud size={16} /> Upload media</Link>
            <Link href="/dashboard/studio" className={buttonClassName("secondary", "w-full justify-start")}><Wand2 size={16} /> Generate copy</Link>
          </div>
        </Card>
      </div>
      <Card className="mt-6 border-l-4 border-l-gold p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Pricing runway</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-pine">Packages built around margin, not guesswork</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">These are editable working packages. The dashboard keeps the $80 / 3 videos market benchmark visible so pricing can stay anchored to value.</p>
          </div>
          <Link href="/admin" className={buttonClassName("secondary")}>Open admin economics</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {packagePlans.map((plan) => (
            <div key={plan.name} className="rounded-md border border-pine/15 bg-cream p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-pine">{plan.name}</h3>
                  <p className="mt-1 text-sm text-charcoal/55">{plan.audience}</p>
                </div>
                <p className="rounded-md border border-gold/35 bg-white px-3 py-2 text-sm font-bold text-pine">{formatCurrency(plan.price)}/mo</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded bg-white p-3">
                  <p className="text-charcoal/45">Videos</p>
                  <p className="font-semibold text-pine">{plan.videos}/mo</p>
                </div>
                <div className="rounded bg-white p-3">
                  <p className="text-charcoal/45">Gross margin</p>
                  <p className="font-semibold text-pine">{Math.round(grossMargin(plan.price, plan.videos) * 100)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}

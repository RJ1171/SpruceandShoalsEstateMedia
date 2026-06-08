import Link from "next/link";
import { BadgeCheck, Plus, UploadCloud, Wand2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <DashboardShell title="Dashboard" subtitle="Monitor listing launches, usage, and the next best actions for the team.">
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
        <h2 className="font-serif text-3xl font-semibold text-pine">Usage</h2>
        <p className="mt-3 text-sm leading-6 text-charcoal/65">No usage has been recorded yet. Activity will appear after projects are created, media is uploaded, and exports are generated.</p>
      </Card>
    </DashboardShell>
  );
}

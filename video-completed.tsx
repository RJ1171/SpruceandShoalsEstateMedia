import { Music, Rows3, Sparkles, UploadCloud, Video, type LucideIcon } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadWorkspace } from "@/components/upload-workspace";

const workflow: Array<[string, LucideIcon]> = [
  ["Upload property photos", UploadCloud],
  ["Enter property details", Rows3],
  ["Choose template", Video],
  ["Select voice, music, branding", Music],
  ["Generate video", Sparkles],
  ["Preview, edit, export", Video]
];

export default function StudioPage() {
  return (
    <DashboardShell title="Video Studio" subtitle="A guided workflow for upload, property details, templates, voice, music, branding, AI generation, preview, timeline editing, and export.">
      <UploadWorkspace />
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <Card className="p-6">
          <h2 className="font-serif text-3xl font-semibold text-pine">Create video</h2>
          <div className="mt-5 space-y-3">
            {workflow.map(([label, Icon], index) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-pine/10 p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-pine text-xs font-bold text-gold">{index + 1}</span>
                <Icon size={18} className="text-gold" />
                <span className="text-sm font-semibold text-pine">{label}</span>
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full">Generate video</Button>
        </Card>
        <Card className="overflow-hidden">
          <div className="bg-pine p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Preview canvas</p>
            <div className="mt-4 aspect-video rounded-lg border border-white/10 bg-[linear-gradient(135deg,#0F2C25,#F7F3EA_68%,#C8A45D)] shadow-luxury" />
          </div>
          <div className="mt-5">
            <div className="px-6">
              <h2 className="font-serif text-3xl font-semibold text-pine">Timeline editor</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/65">Scene cards will populate from uploaded listing photos and generated copy.</p>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2 px-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-16 rounded-md border border-pine/10 bg-cream shadow-inner" />
              ))}
            </div>
            <div className="mt-5 grid gap-3 px-6 pb-6 md:grid-cols-3">
              {["Scene ordering", "Text overlays", "Logo overlays", "Voiceover", "Music", "Intros and outros", "Vertical", "Horizontal", "Square"].map((tool) => (
                <span key={tool} className="rounded-md border border-pine/10 px-3 py-2 text-sm font-medium text-charcoal/70">{tool}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

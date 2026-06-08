import { FileAudio, Image as ImageIcon, UploadCloud, Video, type LucideIcon } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadWorkspace } from "@/components/upload-workspace";

const libraries: Array<[string, LucideIcon]> = [
  ["Photos", ImageIcon],
  ["Videos", Video],
  ["Audio", FileAudio],
  ["Logos and headshots", ImageIcon]
];

export default function MediaPage() {
  return (
    <DashboardShell title="Media Library" subtitle="Organize photos, generated videos, audio tracks, logos, headshots, and reusable brand assets.">
      <Button><UploadCloud size={16} /> Upload assets</Button>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {libraries.map(([label, Icon]) => (
          <Card key={label} className="outline-tile p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gold/40 bg-white">
              <Icon className="text-gold" size={24} />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-pine">{label}</h2>
            <p className="mt-2 text-sm text-charcoal/65">No assets uploaded yet</p>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <UploadWorkspace compact />
      </div>
    </DashboardShell>
  );
}

import Link from "next/link";
import { Plus, UploadCloud } from "lucide-react";
import { DashboardShell } from "../../../components/dashboard-shell";
import { Button, buttonClassName } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export default function ProjectsPage() {
  return (
    <DashboardShell title="Projects" subtitle="Create, duplicate, archive, and manage listing campaigns from a single operational view.">
      <div className="mb-6 flex flex-wrap gap-3">
        <Button><Plus size={16} /> Create project</Button>
        <Button variant="secondary"><UploadCloud size={16} /> Upload media</Button>
      </div>
      <Card className="corner-frame p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md border border-gold/40 bg-cream">
          <UploadCloud className="text-gold" size={28} />
        </div>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-pine">No listing projects yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-charcoal/65">Start in the studio by uploading listing photos, property details, descriptions, logos, and media assets.</p>
        <Link href="/dashboard/studio" className={buttonClassName("primary", "mt-6")}>Create first project <Plus size={16} /></Link>
      </Card>
    </DashboardShell>
  );
}

import Link from "next/link";
import { BarChart3, FolderKanban, Images, LayoutDashboard, Palette, Shield, Video } from "lucide-react";
import { brand } from "../config/brand";
import { cn } from "@/lib/utils";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Projects", "/dashboard/projects", FolderKanban],
  ["Media", "/dashboard/media", Images],
  ["Brand", "/dashboard/brand", Palette],
  ["Studio", "/dashboard/studio", Video],
  ["Admin", "/admin", Shield]
] as const;

export function DashboardShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-gold/25 bg-forest px-5 py-6 text-offWhite shadow-[12px_0_45px_rgba(15,44,37,0.18)] lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md border border-gold/50 bg-pine font-serif text-xl font-semibold text-gold shadow-sm">S</span>
          <span>
            <span className="block font-serif text-xl font-semibold leading-5">{brand.shortName}</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-offWhite/60">Command Studio</span>
          </span>
        </Link>
        <div className="editorial-rule mt-6" />
        <nav className="mt-10 space-y-2">
          {nav.map(([label, href, Icon]) => (
            <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-semibold text-offWhite/70 hover:border-gold/40 hover:bg-pine hover:text-gold")}>
              <Icon size={18} className="text-gold" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-lg border border-gold/30 bg-pine/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Brand system</p>
          <p className="mt-2 text-sm leading-6 text-offWhite/65">All visible identity is controlled in the brand config.</p>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-pine/20 bg-cream/95 px-5 py-6 shadow-[0_12px_35px_rgba(15,44,37,0.05)] backdrop-blur">
          <div className="mx-auto max-w-7xl border-l border-gold pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Luxury real estate media platform</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-pine">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/70">{subtitle}</p> : null}
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
      </div>
    </div>
  );
}

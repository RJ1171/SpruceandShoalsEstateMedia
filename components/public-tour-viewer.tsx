"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronLeft, Copy, Expand, Mail, Map, Pause, Play, Phone } from "lucide-react";
import { defaultTourProperty, defaultTourRooms } from "./virtual-tour-studio";
import type { PublishedTour } from "../types/virtual-tour";

const directionIcons = { forward: ArrowUp, back: ArrowDown, left: ArrowLeft, right: ArrowRight };

export function PublicTourViewer({ slug }: { slug: string }) {
  const [tour, setTour] = useState<PublishedTour>({ slug, rooms: defaultTourRooms, property: defaultTourProperty, publishedAt: "" });
  const [currentRoomId, setCurrentRoomId] = useState(defaultTourRooms[0].id);
  const [history, setHistory] = useState<string[]>([]);
  const [transition, setTransition] = useState<{ x: number; y: number } | null>(null);
  const [guided, setGuided] = useState(false);
  const [copied, setCopied] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const currentRoom = tour.rooms.find((room) => room.id === currentRoomId) ?? tour.rooms[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`spruce-shoals-published-tour:${slug}`);
      if (!stored) return;
      const parsed = JSON.parse(stored) as PublishedTour;
      if (parsed.rooms?.length) {
        setTour(parsed);
        setCurrentRoomId(parsed.rooms[0].id);
      }
    } catch {
      // Fall back to the featured tour when local preview data is unavailable.
    }
  }, [slug]);

  useEffect(() => {
    if (!guided || !currentRoom || transition) return;
    const timer = window.setTimeout(() => {
      const index = tour.rooms.findIndex((room) => room.id === currentRoom.id);
      const target = tour.rooms[(index + 1) % tour.rooms.length];
      navigateTo(target.id, { x: 50, y: 48 }, false);
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [guided, currentRoomId, tour.rooms, transition]);

  function navigateTo(targetRoomId: string, origin = { x: 50, y: 50 }, recordHistory = true) {
    if (!currentRoom || targetRoomId === currentRoom.id || transition) return;
    setTransition(origin);
    window.setTimeout(() => {
      if (recordHistory) setHistory((items) => [...items, currentRoom.id]);
      setCurrentRoomId(targetRoomId);
      setTransition(null);
    }, 430);
  }

  function goBack() {
    const previous = history.at(-1);
    if (!previous) return;
    setTransition({ x: 50, y: 70 });
    window.setTimeout(() => {
      setCurrentRoomId(previous);
      setHistory((items) => items.slice(0, -1));
      setTransition(null);
    }, 430);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) await viewerRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  }

  if (!currentRoom) return null;

  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <header className="border-b border-gold/30 bg-forest text-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/50 bg-pine font-serif text-lg text-gold">S</span><span><span className="block font-serif text-lg font-semibold">Spruce & Shoals</span><span className="block text-[10px] uppercase tracking-[0.2em] text-white/55">Estate Media</span></span></Link>
          <button onClick={copyLink} className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 px-3 text-sm font-semibold text-white/80 hover:border-gold hover:text-gold"><Copy size={16} /> {copied ? "Copied" : "Share"}</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 border-l border-gold pl-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Interactive property tour</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-pine md:text-5xl">{tour.property.address}</h1>
          <p className="mt-2 text-lg font-semibold text-charcoal/65">{tour.property.price}</p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          <section ref={viewerRef} className="overflow-hidden rounded-lg border border-gold/35 bg-forest shadow-luxury fullscreen:rounded-none">
            <div className="relative aspect-video min-h-[360px] overflow-hidden bg-pine sm:min-h-[520px]">
              <img key={currentRoom.id} src={currentRoom.imageUrl} alt={currentRoom.name} className="public-tour-image pointer-events-none absolute inset-0 h-full w-full object-cover" style={transition ? { transformOrigin: `${transition.x}% ${transition.y}%`, transform: "scale(1.2)", opacity: 0.25 } : undefined} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest/15 via-transparent to-forest/75" />

              {currentRoom.hotspots.map((hotspot) => {
                const Icon = directionIcons[hotspot.direction];
                return <button key={hotspot.id} onClick={() => { setGuided(false); navigateTo(hotspot.targetRoomId, { x: hotspot.x, y: hotspot.y }); }} className="group absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} aria-label={`Go ${hotspot.direction} to ${hotspot.label}`}><span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold bg-forest/85 text-white shadow-[0_6px_24px_rgba(0,0,0,0.38)] backdrop-blur transition group-hover:scale-110"><Icon size={21} /></span><span className="absolute left-1/2 top-14 -translate-x-1/2 whitespace-nowrap rounded border border-white/20 bg-forest/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">{hotspot.label}</span></button>;
              })}

              <div className="absolute left-4 top-4 z-20 rounded-md border border-white/25 bg-forest/75 px-3 py-2 text-white backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Current room</p><p className="mt-0.5 font-serif text-lg font-semibold">{currentRoom.name}</p></div>
              <div className="absolute right-4 top-4 z-20 flex gap-2"><button onClick={goBack} disabled={!history.length} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-forest/75 text-white backdrop-blur disabled:opacity-35" title="Previous room"><ChevronLeft size={19} /></button><button onClick={toggleFullscreen} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-forest/75 text-white backdrop-blur" title="Fullscreen"><Expand size={18} /></button></div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-forest px-4 py-3 text-white">
              <button onClick={() => setGuided((value) => !value)} className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold ${guided ? "bg-gold text-forest" : "border border-white/20 text-white"}`}>{guided ? <Pause size={16} /> : <Play size={16} />} {guided ? "Pause guided tour" : "Start guided tour"}</button>
              <div className="flex min-w-0 flex-1 justify-end gap-2 overflow-x-auto py-1">{currentRoom.hotspots.map((hotspot) => { const Icon = directionIcons[hotspot.direction]; return <button key={hotspot.id} onClick={() => { setGuided(false); navigateTo(hotspot.targetRoomId, { x: hotspot.x, y: hotspot.y }); }} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-white/10 px-3 text-xs font-semibold hover:bg-gold hover:text-forest"><Icon size={15} /> {hotspot.label}</button>; })}</div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Property</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded border border-pine/10 bg-cream p-2"><strong className="block text-pine">{tour.property.beds}</strong><span className="text-[10px] uppercase text-charcoal/45">Beds</span></div><div className="rounded border border-pine/10 bg-cream p-2"><strong className="block text-pine">{tour.property.baths}</strong><span className="text-[10px] uppercase text-charcoal/45">Baths</span></div><div className="rounded border border-pine/10 bg-cream p-2"><strong className="block text-pine">{tour.property.squareFeet}</strong><span className="text-[10px] uppercase text-charcoal/45">Sq ft</span></div></div>
            </div>

            <div className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Room map</p><Map size={17} className="text-pine/45" /></div>
              <div className="mt-4 space-y-2">{tour.rooms.map((room, index) => <button key={room.id} onClick={() => { setGuided(false); navigateTo(room.id); }} className={`flex w-full items-center gap-3 rounded-md border p-2.5 text-left ${currentRoom.id === room.id ? "border-gold bg-cream" : "border-pine/10 hover:border-pine/30"}`}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-xs font-bold text-gold">{index + 1}</span><span className="text-sm font-semibold text-pine">{room.name}</span></button>)}</div>
            </div>

            <div className="rounded-lg border border-gold/35 bg-forest p-5 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Presented by</p><p className="mt-3 font-serif text-2xl font-semibold">{tour.property.agentName}</p><a href={`tel:${tour.property.agentPhone.replace(/[^\d+]/g, "")}`} className="mt-4 flex items-center gap-2 text-sm text-white/75 hover:text-gold"><Phone size={15} /> {tour.property.agentPhone}</a><a href={`mailto:${tour.property.agentEmail}`} className="mt-2 flex items-center gap-2 break-all text-sm text-white/75 hover:text-gold"><Mail size={15} /> {tour.property.agentEmail}</a></div>
          </aside>
        </div>
      </div>

      <style jsx>{`.public-tour-image { animation: publicTourAmbient 12s ease-in-out infinite alternate; transition: transform 430ms cubic-bezier(.22,.61,.36,1), opacity 430ms ease; } @keyframes publicTourAmbient { from { transform: scale(1.015) translate3d(-0.2%,0.1%,0); } to { transform: scale(1.055) translate3d(0.3%,-0.2%,0); } }`}</style>
    </main>
  );
}

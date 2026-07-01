"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  Expand,
  ImagePlus,
  Map,
  Maximize2,
  MousePointer2,
  Move,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2
} from "lucide-react";
import type { HotspotDirection, PublishedTour, TourHotspot, TourProperty, TourRoom } from "../types/virtual-tour";

export const defaultTourRooms: TourRoom[] = [
  {
    id: "entrance",
    name: "Entrance",
    imageUrl: "/images/portfolio/interiors/atlantic-shingle-estate-entrance.png",
    hotspots: [{ id: "entrance-living", x: 50, y: 50, targetRoomId: "living", label: "Living Room", direction: "forward" }]
  },
  {
    id: "living",
    name: "Living Room",
    imageUrl: "/images/portfolio/interiors/atlantic-shingle-estate-living-room.png",
    hotspots: [
      { id: "living-entrance", x: 12, y: 62, targetRoomId: "entrance", label: "Entrance", direction: "back" },
      { id: "living-kitchen", x: 86, y: 54, targetRoomId: "kitchen", label: "Kitchen", direction: "right" }
    ]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    imageUrl: "/images/portfolio/interiors/atlantic-shingle-estate-kitchen.png",
    hotspots: [
      { id: "kitchen-living", x: 12, y: 56, targetRoomId: "living", label: "Living Room", direction: "left" },
      { id: "kitchen-bedroom", x: 88, y: 52, targetRoomId: "bedroom", label: "Primary Bedroom", direction: "forward" }
    ]
  },
  {
    id: "bedroom",
    name: "Primary Bedroom",
    imageUrl: "/images/portfolio/interiors/atlantic-shingle-estate-bedroom.png",
    hotspots: [
      { id: "bedroom-kitchen", x: 12, y: 56, targetRoomId: "kitchen", label: "Kitchen", direction: "back" },
      { id: "bedroom-bath", x: 88, y: 54, targetRoomId: "bath", label: "Primary Bath", direction: "right" }
    ]
  },
  {
    id: "bath",
    name: "Primary Bath",
    imageUrl: "/images/portfolio/interiors/atlantic-shingle-estate-bathroom.png",
    hotspots: [{ id: "bath-bedroom", x: 12, y: 56, targetRoomId: "bedroom", label: "Primary Bedroom", direction: "back" }]
  }
];

export const defaultTourProperty: TourProperty = {
  address: "18 Harbor View Road, Newburyport, MA",
  price: "$1,895,000",
  beds: "4",
  baths: "3.5",
  squareFeet: "3,280",
  agentName: "Rocco Fiacchino",
  agentPhone: "(603) 260-8166",
  agentEmail: "Roccofiacchino@gmail.com"
};

function tourSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "featured-estate";
}

const directionIcons = {
  forward: ArrowUp,
  back: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight
};

function clamp(value: number) {
  return Math.max(3, Math.min(97, value));
}

export function VirtualTourStudio({ embedded = false }: { embedded?: boolean }) {
  const [rooms, setRooms] = useState<TourRoom[]>(defaultTourRooms);
  const [property, setProperty] = useState<TourProperty>(defaultTourProperty);
  const [currentRoomId, setCurrentRoomId] = useState(defaultTourRooms[0].id);
  const [selectedRoomId, setSelectedRoomId] = useState(defaultTourRooms[0].id);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [transition, setTransition] = useState<{ x: number; y: number } | null>(null);
  const [ambientMotion, setAmbientMotion] = useState(true);
  const [mapOpen, setMapOpen] = useState(!embedded);
  const [saved, setSaved] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [draggingHotspotId, setDraggingHotspotId] = useState<string | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);

  const currentRoom = rooms.find((room) => room.id === currentRoomId) ?? rooms[0];
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const selectedHotspot = selectedRoom?.hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null;

  const connections = useMemo(() => rooms.map((room) => ({
    room,
    connected: new Set(room.hotspots.map((hotspot) => hotspot.targetRoomId))
  })), [rooms]);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timer);
  }, [saved]);

  function navigateTo(targetRoomId: string, origin?: { x: number; y: number }) {
    if (targetRoomId === currentRoomId || transition) return;
    setTransition(origin ?? { x: 50, y: 50 });
    window.setTimeout(() => {
      setHistory((items) => [...items, currentRoomId]);
      setCurrentRoomId(targetRoomId);
      setTransition(null);
    }, 430);
  }

  function goBack() {
    const previous = history.at(-1);
    if (!previous || transition) return;
    setTransition({ x: 50, y: 72 });
    window.setTimeout(() => {
      setCurrentRoomId(previous);
      setHistory((items) => items.slice(0, -1));
      setTransition(null);
    }, 430);
  }

  function updateSelectedHotspot(patch: Partial<TourHotspot>) {
    if (!selectedHotspotId) return;
    setRooms((items) => items.map((room) => room.id === selectedRoomId
      ? { ...room, hotspots: room.hotspots.map((hotspot) => hotspot.id === selectedHotspotId ? { ...hotspot, ...patch } : hotspot) }
      : room));
  }

  function pointFromEvent(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100)
    };
  }

  function addHotspot(event: PointerEvent<HTMLDivElement>) {
    if (mode !== "edit" || draggingHotspotId || event.target !== event.currentTarget) return;
    const targetRoom = rooms.find((room) => room.id !== selectedRoomId);
    if (!targetRoom) return;
    const point = pointFromEvent(event);
    const hotspot: TourHotspot = {
      id: crypto.randomUUID(),
      ...point,
      targetRoomId: targetRoom.id,
      label: targetRoom.name,
      direction: "forward"
    };
    setRooms((items) => items.map((room) => room.id === selectedRoomId ? { ...room, hotspots: [...room.hotspots, hotspot] } : room));
    setSelectedHotspotId(hotspot.id);
  }

  function moveHotspot(event: PointerEvent<HTMLDivElement>) {
    if (!draggingHotspotId) return;
    const point = pointFromEvent(event);
    setRooms((items) => items.map((room) => room.id === selectedRoomId
      ? { ...room, hotspots: room.hotspots.map((hotspot) => hotspot.id === draggingHotspotId ? { ...hotspot, ...point } : hotspot) }
      : room));
  }

  function deleteHotspot() {
    if (!selectedHotspotId) return;
    setRooms((items) => items.map((room) => room.id === selectedRoomId
      ? { ...room, hotspots: room.hotspots.filter((hotspot) => hotspot.id !== selectedHotspotId) }
      : room));
    setSelectedHotspotId(null);
  }

  function uploadRooms(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    const additions = files.map((file, index) => ({
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || `Room ${rooms.length + index + 1}`,
      imageUrl: URL.createObjectURL(file),
      hotspots: []
    }));
    setRooms((items) => [...items, ...additions]);
    setSelectedRoomId(additions[0].id);
    setMode("edit");
    event.target.value = "";
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) await tourRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  }

  async function publishTour() {
    const slug = tourSlug(property.address);
    const tour: PublishedTour = { slug, rooms, property, publishedAt: new Date().toISOString() };
    localStorage.setItem(`spruce-shoals-published-tour:${slug}`, JSON.stringify(tour));
    const url = `${window.location.origin}/tour/${slug}`;
    setPublishedUrl(url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // The URL remains visible if clipboard permission is unavailable.
    }
  }

  if (!currentRoom || !selectedRoom) return null;

  const displayRoom = mode === "edit" ? selectedRoom : currentRoom;

  return (
    <div className="space-y-5">
      {!embedded ? <div className="flex flex-col justify-between gap-4 border-b border-pine/15 pb-5 sm:flex-row sm:items-center">
        <div className="inline-flex w-fit rounded-md border border-pine/15 bg-white p-1 shadow-sm">
          {(["view", "edit"] as const).map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`flex h-9 items-center gap-2 rounded px-4 text-sm font-semibold capitalize transition ${mode === item ? "bg-pine text-white" : "text-charcoal/60 hover:text-pine"}`}>
              {item === "view" ? <Maximize2 size={15} /> : <MousePointer2 size={15} />} {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-pine/20 bg-white px-4 text-sm font-semibold text-pine transition hover:border-gold">
            <ImagePlus size={16} /> Add room images
            <input className="sr-only" type="file" accept="image/*" multiple onChange={uploadRooms} />
          </label>
          <button onClick={() => { localStorage.setItem("spruce-shoals-tour", JSON.stringify(rooms.filter((room) => !room.imageUrl.startsWith("blob:")))); setSaved(true); }} className="inline-flex h-10 items-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-forest">
            <Save size={16} /> {saved ? "Saved" : "Save tour"}
          </button>
          <button onClick={publishTour} className="inline-flex h-10 items-center gap-2 rounded-md bg-pine px-4 text-sm font-semibold text-white">
            <Send size={16} /> Publish
          </button>
        </div>
      </div> : null}

      {!embedded && publishedUrl ? <div className="flex flex-col gap-2 rounded-md border border-gold/35 bg-white px-4 py-3 text-sm text-pine sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0 truncate">Published: {publishedUrl}</span><a href={publishedUrl} className="shrink-0 font-semibold text-gold">Open public tour</a></div> : null}

      <div className={`grid gap-5 ${mode === "edit" ? "xl:grid-cols-[240px_minmax(0,1fr)_280px]" : "xl:grid-cols-[minmax(0,1fr)_280px]"}`}>
        {mode === "edit" ? (
          <aside className="rounded-lg border border-pine/15 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Rooms</p>
              <span className="text-xs text-charcoal/45">{rooms.length}</span>
            </div>
            <div className="mt-2 space-y-2">
              {rooms.map((room) => (
                <button key={room.id} onClick={() => { setSelectedRoomId(room.id); setSelectedHotspotId(null); }} className={`flex w-full items-center gap-3 rounded-md border p-2 text-left transition ${selectedRoomId === room.id ? "border-gold bg-cream" : "border-pine/10 hover:border-pine/30"}`}>
                  <img src={room.imageUrl} alt="" className="h-12 w-16 rounded object-cover" />
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-pine">{room.name}</span><span className="text-xs text-charcoal/45">{room.hotspots.length} link{room.hotspots.length === 1 ? "" : "s"}</span></span>
                </button>
              ))}
            </div>
          </aside>
        ) : null}

        <section ref={tourRef} className="relative overflow-hidden rounded-lg border border-gold/35 bg-forest shadow-luxury fullscreen:rounded-none">
          <div
            className="relative aspect-video min-h-[360px] touch-none overflow-hidden bg-pine sm:min-h-[500px]"
            onPointerDown={addHotspot}
            onPointerMove={moveHotspot}
            onPointerUp={() => setDraggingHotspotId(null)}
            onPointerLeave={() => setDraggingHotspotId(null)}
          >
            <img
              key={displayRoom.id}
              src={displayRoom.imageUrl}
              alt={displayRoom.name}
              className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${ambientMotion && mode === "view" ? "tour-ambient" : ""}`}
              style={transition ? { transformOrigin: `${transition.x}% ${transition.y}%`, transform: "scale(1.2)", opacity: 0.25 } : undefined}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest/20 via-transparent to-forest/70" />

            {displayRoom.hotspots.map((hotspot) => {
              const DirectionIcon = directionIcons[hotspot.direction];
              const active = mode === "edit" && hotspot.id === selectedHotspotId;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    if (mode === "edit") {
                      setSelectedHotspotId(hotspot.id);
                      setDraggingHotspotId(hotspot.id);
                    }
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (mode === "view") navigateTo(hotspot.targetRoomId, { x: hotspot.x, y: hotspot.y });
                  }}
                  className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 ${mode === "edit" ? "cursor-move" : "cursor-pointer"}`}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  aria-label={`Go ${hotspot.direction} to ${hotspot.label}`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-white shadow-[0_6px_24px_rgba(0,0,0,0.38)] backdrop-blur transition group-hover:scale-110 ${active ? "border-white bg-gold" : "border-gold bg-forest/85"}`}><DirectionIcon size={21} /></span>
                  <span className="absolute left-1/2 top-14 -translate-x-1/2 whitespace-nowrap rounded border border-white/20 bg-forest/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg">{hotspot.label}</span>
                </button>
              );
            })}

            <div className="absolute left-4 top-4 z-20 rounded-md border border-white/25 bg-forest/75 px-3 py-2 text-white backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Current room</p>
              <p className="mt-0.5 font-serif text-lg font-semibold">{displayRoom.name}</p>
            </div>

            <div className="absolute right-4 top-4 z-20 flex gap-2">
              {mode === "view" ? <button onClick={goBack} disabled={!history.length} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-forest/75 text-white backdrop-blur disabled:opacity-35" title="Previous room"><ChevronLeft size={19} /></button> : null}
              <button onClick={() => setMapOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-forest/75 text-white backdrop-blur xl:hidden" title="Room map"><Map size={18} /></button>
              <button onClick={toggleFullscreen} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-forest/75 text-white backdrop-blur" title="Fullscreen"><Expand size={18} /></button>
            </div>

            {mode === "edit" ? <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-md border border-gold/45 bg-forest/80 px-4 py-2 text-center text-xs font-semibold text-white backdrop-blur"><Plus size={14} className="mr-1 inline text-gold" /> Click empty space to add a hotspot. Drag a hotspot to move it.</div> : null}
          </div>

          {mode === "view" ? (
            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-forest px-4 py-3 text-white">
              <button onClick={goBack} disabled={!history.length} className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold disabled:opacity-35"><ChevronLeft size={17} /> Back</button>
              <div className="flex min-w-0 gap-2 overflow-x-auto py-1">
                {currentRoom.hotspots.map((hotspot) => {
                  const DirectionIcon = directionIcons[hotspot.direction];
                  return <button key={hotspot.id} onClick={() => navigateTo(hotspot.targetRoomId, { x: hotspot.x, y: hotspot.y })} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-white/10 px-3 text-xs font-semibold hover:bg-gold hover:text-forest"><DirectionIcon size={15} /> {hotspot.label}</button>;
                })}
              </div>
              <button onClick={() => setAmbientMotion((value) => !value)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${ambientMotion ? "border-gold text-gold" : "border-white/15 text-white/60"}`} title="Ambient motion"><Move size={17} /></button>
            </div>
          ) : null}
        </section>

        <aside className={`${mapOpen || mode === "edit" ? "block" : "hidden"} space-y-4 xl:block`}>
          {mode === "edit" ? (
            <div className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Hotspot settings</p>
              {selectedHotspot ? (
                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-semibold text-charcoal/60">Label<input value={selectedHotspot.label} onChange={(event) => updateSelectedHotspot({ label: event.target.value })} className="mt-1.5 h-10 w-full rounded-md border border-pine/20 px-3 text-sm text-pine outline-none focus:border-gold" /></label>
                  <label className="block text-xs font-semibold text-charcoal/60">Connected room<select value={selectedHotspot.targetRoomId} onChange={(event) => { const target = rooms.find((room) => room.id === event.target.value); updateSelectedHotspot({ targetRoomId: event.target.value, label: target?.name ?? selectedHotspot.label }); }} className="mt-1.5 h-10 w-full rounded-md border border-pine/20 bg-white px-3 text-sm text-pine outline-none focus:border-gold">{rooms.filter((room) => room.id !== selectedRoomId).map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label>
                  <label className="block text-xs font-semibold text-charcoal/60">Direction<select value={selectedHotspot.direction} onChange={(event) => updateSelectedHotspot({ direction: event.target.value as HotspotDirection })} className="mt-1.5 h-10 w-full rounded-md border border-pine/20 bg-white px-3 text-sm text-pine outline-none focus:border-gold">{(["forward", "back", "left", "right"] as const).map((direction) => <option key={direction} value={direction}>{direction[0].toUpperCase() + direction.slice(1)}</option>)}</select></label>
                  <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/50"><span className="rounded border border-pine/10 bg-cream p-2">X {selectedHotspot.x.toFixed(1)}%</span><span className="rounded border border-pine/10 bg-cream p-2">Y {selectedHotspot.y.toFixed(1)}%</span></div>
                  <button onClick={deleteHotspot} className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 text-sm font-semibold text-red-700"><Trash2 size={16} /> Delete hotspot</button>
                </div>
              ) : <div className="mt-4 rounded-md border border-dashed border-pine/20 bg-cream p-4 text-sm leading-6 text-charcoal/55"><MousePointer2 size={18} className="mb-2 text-gold" /> Select a hotspot to edit its destination, label, and direction.</div>}
            </div>
          ) : null}

          {mode === "edit" ? (
            <div className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Listing details</p>
              <div className="mt-4 space-y-3">
                {([
                  ["Address", "address"], ["Price", "price"], ["Beds", "beds"], ["Baths", "baths"], ["Square feet", "squareFeet"], ["Agent", "agentName"], ["Phone", "agentPhone"], ["Email", "agentEmail"]
                ] as const).map(([label, key]) => <label key={key} className="block text-xs font-semibold text-charcoal/60">{label}<input value={property[key]} onChange={(event) => setProperty((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 h-9 w-full rounded-md border border-pine/20 px-3 text-sm text-pine outline-none focus:border-gold" /></label>)}
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-pine/15 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Room map</p><Map size={17} className="text-pine/45" /></div>
            <div className="relative mt-5 space-y-2 before:absolute before:bottom-4 before:left-[17px] before:top-4 before:w-px before:bg-gold/40">
              {connections.map(({ room, connected }, index) => (
                <button key={room.id} onClick={() => mode === "edit" ? setSelectedRoomId(room.id) : navigateTo(room.id)} className={`relative z-10 flex w-full items-center gap-3 rounded-md border p-2.5 text-left transition ${(mode === "edit" ? selectedRoomId : currentRoomId) === room.id ? "border-gold bg-cream" : "border-pine/10 bg-white hover:border-pine/30"}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-forest text-xs font-bold text-gold">{index + 1}</span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-pine">{room.name}</span><span className="text-[11px] text-charcoal/45">{connected.size} connection{connected.size === 1 ? "" : "s"}</span></span>
                </button>
              ))}
            </div>
            {!embedded ? <button onClick={() => { setRooms(defaultTourRooms); setProperty(defaultTourProperty); setSelectedRoomId(defaultTourRooms[0].id); setCurrentRoomId(defaultTourRooms[0].id); setHistory([]); }} className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-md border border-pine/15 text-xs font-semibold text-pine"><RotateCcw size={14} /> Reset example tour</button> : null}
          </div>
        </aside>
      </div>

      <style jsx>{`
        .tour-ambient { animation: tourAmbient 12s ease-in-out infinite alternate; }
        @keyframes tourAmbient {
          0% { transform: scale(1.015) translate3d(-0.25%, 0.15%, 0); }
          100% { transform: scale(1.055) translate3d(0.35%, -0.25%, 0); }
        }
        img { transition: transform 430ms cubic-bezier(.22,.61,.36,1), opacity 430ms ease; }
      `}</style>
    </div>
  );
}

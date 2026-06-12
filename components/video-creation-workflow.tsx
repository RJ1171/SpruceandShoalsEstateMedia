"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  GripVertical,
  Image as ImageIcon,
  Images,
  Link2,
  Loader2,
  Maximize2,
  MonitorPlay,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Scissors,
  Sparkles,
  UploadCloud,
  UserRound,
  Video,
  WandSparkles,
  X
} from "lucide-react";
import { Button, buttonClassName } from "./ui/button";
import { Card } from "./ui/card";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type Orientation = "landscape" | "portrait" | "square";
type Motion = "Auto" | "Push in" | "Push out" | "Pan left" | "Pan right";
type Enhancement = "Original" | "Brighten" | "Twilight" | "Virtual stage";

type Scene = {
  id: string;
  name: string;
  src: string;
  selected: boolean;
  motion: Motion;
  enhancement: Enhancement;
  focusX: number;
  focusY: number;
};

type ProjectDetails = {
  name: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  description: string;
};

const steps = [
  [1, "Project"],
  [2, "Photos"],
  [3, "Scenes"],
  [4, "Format"],
  [5, "Brand"],
  [6, "Render"]
] as const;

const motions: Motion[] = ["Auto", "Push in", "Push out", "Pan left", "Pan right"];
const enhancements: Enhancement[] = ["Original", "Brighten", "Twilight", "Virtual stage"];

const templates = [
  { id: "coastal", name: "Coastal Editorial", accent: "#C6A15B", surface: "#173F35" },
  { id: "heritage", name: "New England Heritage", accent: "#F7F3EA", surface: "#1F2933" },
  { id: "minimal", name: "Gallery Minimal", accent: "#173F35", surface: "#FFFFFF" }
];

const tracks = ["Harbor Light", "Quiet Arrival", "Open House", "Coastal Drive"];
const voices = ["No voiceover", "Warm advisor", "Editorial narrator", "Bright social"];

function orientationClass(orientation: Orientation) {
  if (orientation === "portrait") return "aspect-[9/16] max-h-[560px]";
  if (orientation === "square") return "aspect-square max-h-[520px]";
  return "aspect-video";
}

function formatPrice(value: string) {
  const number = Number(value.replace(/[^0-9]/g, ""));
  return number ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number) : "Price on request";
}

function createScene(file: File): Scene {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    src: URL.createObjectURL(file),
    selected: true,
    motion: "Auto",
    enhancement: "Original",
    focusX: 50,
    focusY: 50
  };
}

export function VideoCreationWorkflow() {
  const [step, setStep] = useState<Step>(1);
  const [details, setDetails] = useState<ProjectDetails>({
    name: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    description: ""
  });
  const [source, setSource] = useState<"url" | "device" | "dropbox">("url");
  const [listingUrl, setListingUrl] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "error">("idle");
  const [importMessage, setImportMessage] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const [templateId, setTemplateId] = useState("coastal");
  const [music, setMusic] = useState(tracks[0]);
  const [voice, setVoice] = useState(voices[0]);
  const [logoUrl, setLogoUrl] = useState("");
  const [headshotUrl, setHeadshotUrl] = useState("");
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeOutro, setIncludeOutro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [renderProgress, setRenderProgress] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  const selectedScenes = useMemo(() => scenes.filter((scene) => scene.selected), [scenes]);
  const activeScene = scenes.find((scene) => scene.id === activeSceneId) ?? selectedScenes[0];
  const selectedTemplate = templates.find((template) => template.id === templateId) ?? templates[0];
  const currentPreview = selectedScenes[previewIndex % Math.max(selectedScenes.length, 1)];
  const estimatedSeconds = selectedScenes.length * 3 + (includeIntro ? 4 : 0) + (includeOutro ? 4 : 0);
  const canContinue =
    step === 1 ? Boolean(details.name.trim() && details.address.trim()) :
    step === 2 ? scenes.length > 0 :
    step === 3 ? selectedScenes.length > 0 : true;

  useEffect(() => {
    const saved = window.localStorage.getItem("spruce-shoals-video-project");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { details?: ProjectDetails; orientation?: Orientation; templateId?: string };
      if (parsed.details) setDetails(parsed.details);
      if (parsed.orientation) setOrientation(parsed.orientation);
      if (parsed.templateId) setTemplateId(parsed.templateId);
    } catch {
      window.localStorage.removeItem("spruce-shoals-video-project");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("spruce-shoals-video-project", JSON.stringify({ details, orientation, templateId }));
  }, [details, orientation, templateId]);

  useEffect(() => {
    if (!isPlaying || selectedScenes.length < 2) return;
    const timer = window.setInterval(() => setPreviewIndex((index) => (index + 1) % selectedScenes.length), 3000);
    return () => window.clearInterval(timer);
  }, [isPlaying, selectedScenes.length]);

  useEffect(() => {
    if (step !== 6 || renderProgress >= 100) return;
    const timer = window.setInterval(() => setRenderProgress((value) => Math.min(100, value + 4)), 160);
    return () => window.clearInterval(timer);
  }, [step, renderProgress]);

  function updateDetails(field: keyof ProjectDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    setScenes((current) => [...current, ...files.map(createScene)]);
    event.target.value = "";
  }

  function addBrandFile(event: ChangeEvent<HTMLInputElement>, kind: "logo" | "headshot") {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (kind === "logo") setLogoUrl(url);
    else setHeadshotUrl(url);
    event.target.value = "";
  }

  async function importListing() {
    setImportStatus("loading");
    setImportMessage("");

    try {
      const response = await fetch("/api/listings/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: listingUrl })
      });
      const payload = (await response.json()) as { images?: string[]; error?: string };
      if (!response.ok || !payload.images?.length) throw new Error(payload.error || "No listing images found.");

      setScenes((current) => [
        ...current,
        ...payload.images!.map((src, index) => ({
          id: crypto.randomUUID(),
          name: `Listing photo ${index + 1}`,
          src,
          selected: true,
          motion: "Auto" as Motion,
          enhancement: "Original" as Enhancement,
          focusX: 50,
          focusY: 50
        }))
      ]);
      setImportStatus("idle");
      setImportMessage(`${payload.images.length} listing photos imported.`);
    } catch (error) {
      setImportStatus("error");
      setImportMessage(error instanceof Error ? error.message : "Import failed.");
    }
  }

  function updateScene(id: string, update: Partial<Scene>) {
    setScenes((current) => current.map((scene) => scene.id === id ? { ...scene, ...update } : scene));
  }

  function removeScene(id: string) {
    setScenes((current) => current.filter((scene) => scene.id !== id));
  }

  function onDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setScenes((current) => {
      const next = [...current];
      const from = next.findIndex((scene) => scene.id === draggedId);
      const to = next.findIndex((scene) => scene.id === targetId);
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedId(null);
  }

  function advance() {
    if (!canContinue) return;
    if (step === 5) {
      setRenderProgress(0);
      setStep(6);
      return;
    }
    setStep((Math.min(6, step + 1) as Step));
  }

  function downloadProject() {
    const packageData = {
      project: details,
      format: { orientation, resolution, estimatedSeconds },
      scenes: selectedScenes.map(({ id, name, motion, enhancement, focusX, focusY }) => ({ id, name, motion, enhancement, focusX, focusY })),
      branding: { templateId, music, voice, includeIntro, includeOutro }
    };
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${details.name.trim().replace(/\s+/g, "-").toLowerCase() || "listing"}-video-package.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyShareLink() {
    const url = `${window.location.origin}/dashboard/studio?project=${encodeURIComponent(details.name || "listing")}`;
    await navigator.clipboard.writeText(url);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-pine/15 bg-white px-4 py-4 sm:px-6">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {steps.map(([number, label]) => (
              <button
                key={number}
                type="button"
                onClick={() => number <= step && setStep(number)}
                className={`flex min-h-14 items-center gap-3 rounded-md border px-3 text-left transition ${number === step ? "border-gold bg-cream text-pine shadow-sm" : number < step ? "border-pine/20 bg-white text-pine" : "border-pine/10 bg-white text-charcoal/40"}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${number < step ? "bg-pine text-gold" : number === step ? "bg-gold text-pine" : "bg-cream text-charcoal/40"}`}>
                  {number < step ? <Check size={14} /> : number}
                </span>
                <span className="hidden text-xs font-bold uppercase tracking-[0.12em] sm:block">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {step === 1 ? (
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">New listing project</p>
                <h2 className="mt-3 font-serif text-4xl font-semibold text-pine">Start with the property.</h2>
                <p className="mt-4 text-sm leading-7 text-charcoal/65">Name the campaign and add the core facts once. They will feed the intro, captions, voiceover, outro, and export package.</p>
                <div className="mt-6 rounded-md border border-gold/30 bg-cream p-4 text-sm leading-6 text-charcoal/70">
                  <BadgeCheck className="mb-3 text-gold" size={20} />
                  Projects save automatically in this browser. There are no credits, checkout steps, or watermarks.
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Project name", "name", "Seaside launch campaign"],
                  ["Property address", "address", "18 Harbor View Road, Newburyport"],
                  ["List price", "price", "$1,895,000"],
                  ["Bedrooms", "bedrooms", "4"],
                  ["Bathrooms", "bathrooms", "3.5"],
                  ["Square feet", "squareFeet", "3,280"]
                ].map(([label, field, placeholder]) => (
                  <label key={field} className="text-sm font-semibold text-pine">
                    {label}
                    <input
                      value={details[field as keyof ProjectDetails]}
                      onChange={(event) => updateDetails(field as keyof ProjectDetails, event.target.value)}
                      placeholder={placeholder}
                      className="mt-2 h-12 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm outline-none transition focus:border-gold focus:bg-white"
                    />
                  </label>
                ))}
                <label className="sm:col-span-2 text-sm font-semibold text-pine">
                  Property notes
                  <textarea
                    value={details.description}
                    onChange={(event) => updateDetails("description", event.target.value)}
                    placeholder="Water views, renovated chef's kitchen, private dock, weekend open house..."
                    className="mt-2 min-h-32 w-full rounded-md border border-pine/20 bg-cream p-3 text-sm leading-6 outline-none transition focus:border-gold focus:bg-white"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Photo intake</p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold text-pine">Bring in the listing gallery.</h2>
                  <p className="mt-3 text-sm leading-6 text-charcoal/65">Import public listing images or upload originals from your phone, desktop, or cloud folder.</p>
                </div>
                <div className="flex rounded-md border border-pine/15 bg-cream p-1">
                  {(["url", "device", "dropbox"] as const).map((item) => (
                    <button key={item} onClick={() => setSource(item)} className={`rounded px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${source === item ? "bg-pine text-white" : "text-charcoal/55"}`}>
                      {item === "url" ? "Listing URL" : item === "device" ? "Device" : "Dropbox"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
                <div className="rounded-lg border border-pine/15 bg-cream p-5">
                  {source === "url" ? (
                    <div>
                      <Link2 className="text-gold" size={26} />
                      <h3 className="mt-4 font-serif text-2xl font-semibold text-pine">Import a public listing</h3>
                      <p className="mt-2 text-sm leading-6 text-charcoal/60">Paste a Zillow or Realtor.com property URL. We collect public image metadata and create scene cards.</p>
                      <input value={listingUrl} onChange={(event) => setListingUrl(event.target.value)} placeholder="https://www.realtor.com/realestateandhomes-detail/..." className="mt-5 h-12 w-full rounded-md border border-pine/20 bg-white px-3 text-sm outline-none focus:border-gold" />
                      <Button className="mt-3 w-full" onClick={importListing} disabled={!listingUrl.trim() || importStatus === "loading"}>
                        {importStatus === "loading" ? <Loader2 className="animate-spin" size={16} /> : <WandSparkles size={16} />} Import listing photos
                      </Button>
                    </div>
                  ) : (
                    <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gold/60 bg-white p-6 text-center transition hover:border-pine">
                      {source === "dropbox" ? <Images className="text-gold" size={34} /> : <UploadCloud className="text-gold" size={34} />}
                      <span className="mt-4 font-serif text-2xl font-semibold text-pine">{source === "dropbox" ? "Choose from your cloud folder" : "Drop listing photos here"}</span>
                      <span className="mt-2 text-sm leading-6 text-charcoal/60">JPG, PNG, WEBP. Select as many images as you need.</span>
                      <span className={buttonClassName("secondary", "mt-5")}>{source === "dropbox" ? "Open file picker" : "Browse files"}</span>
                      <input className="sr-only" type="file" accept="image/*" multiple onChange={addFiles} />
                    </label>
                  )}
                  {importMessage ? <p className={`mt-4 text-sm ${importStatus === "error" ? "text-red-700" : "text-pine"}`}>{importMessage}</p> : null}
                  <div className="mt-5 border-t border-pine/10 pt-5">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-pine/15 bg-white px-4 py-3 text-sm font-semibold text-pine">
                      <Plus size={16} /> Add photos from device
                      <input className="sr-only" type="file" accept="image/*" multiple onChange={addFiles} />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-semibold text-pine">Imported gallery</h3>
                    <span className="text-sm font-semibold text-charcoal/50">{scenes.length} photos</span>
                  </div>
                  {scenes.length ? (
                    <div className="mt-4 grid max-h-[540px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                      {scenes.map((scene) => (
                        <div key={scene.id} className="group relative overflow-hidden rounded-md border border-pine/15 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={scene.src} alt={scene.name} className="aspect-[4/3] w-full object-cover" />
                          <button onClick={() => removeScene(scene.id)} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-white/95 text-pine shadow-sm" aria-label={`Remove ${scene.name}`}><X size={15} /></button>
                          <p className="truncate px-3 py-2 text-xs font-semibold text-pine">{scene.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 flex min-h-72 flex-col items-center justify-center rounded-lg border border-pine/15 bg-white text-center">
                      <ImageIcon className="text-gold" size={36} />
                      <p className="mt-4 font-semibold text-pine">Your gallery will appear here</p>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-charcoal/55">Import a listing or upload your original photography to continue.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Scene direction</p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold text-pine">Choose the story and direct each shot.</h2>
                  <p className="mt-3 text-sm leading-6 text-charcoal/65">Select images, drag to reorder, set the crop focus, and choose camera motion. Each selected photo becomes a three-second scene.</p>
                </div>
                <div className="rounded-md border border-gold/30 bg-cream px-4 py-3 text-sm font-semibold text-pine">{selectedScenes.length} scenes · about {estimatedSeconds}s</div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {scenes.map((scene, index) => (
                    <div
                      key={scene.id}
                      draggable
                      onDragStart={() => setDraggedId(scene.id)}
                      onDragOver={(event: DragEvent) => event.preventDefault()}
                      onDrop={() => onDrop(scene.id)}
                      className={`overflow-hidden rounded-md border bg-white transition ${scene.selected ? "border-gold shadow-sm" : "border-pine/10 opacity-55"}`}
                    >
                      <button className="relative block w-full text-left" onClick={() => setActiveSceneId(scene.id)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={scene.src} alt={scene.name} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: `${scene.focusX}% ${scene.focusY}%` }} />
                        <span className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded bg-pine px-2 text-xs font-bold text-gold">{index + 1}</span>
                        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-white/90 text-pine"><GripVertical size={15} /></span>
                      </button>
                      <div className="flex items-center justify-between gap-2 p-3">
                        <button onClick={() => updateScene(scene.id, { selected: !scene.selected })} className={`flex h-8 w-8 items-center justify-center rounded-md border ${scene.selected ? "border-pine bg-pine text-gold" : "border-pine/20 text-charcoal/40"}`} aria-label={scene.selected ? "Remove from video" : "Add to video"}>{scene.selected ? <Check size={15} /> : <Plus size={15} />}</button>
                        <span className="truncate text-xs font-semibold text-pine">{scene.motion}</span>
                        <button onClick={() => setActiveSceneId(scene.id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-pine/15 text-pine" aria-label="Edit scene"><Maximize2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="h-fit p-5 xl:sticky xl:top-24">
                  {activeScene ? (
                    <>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Scene controls</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeScene.src} alt={activeScene.name} className="mt-4 aspect-video w-full rounded-md border border-pine/15 object-cover" style={{ objectPosition: `${activeScene.focusX}% ${activeScene.focusY}%` }} />
                      <label className="mt-5 block text-sm font-semibold text-pine">Camera motion
                        <select value={activeScene.motion} onChange={(event) => updateScene(activeScene.id, { motion: event.target.value as Motion })} className="mt-2 h-11 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm">
                          {motions.map((motion) => <option key={motion}>{motion}</option>)}
                        </select>
                      </label>
                      <label className="mt-4 block text-sm font-semibold text-pine">Photo treatment
                        <select value={activeScene.enhancement} onChange={(event) => updateScene(activeScene.id, { enhancement: event.target.value as Enhancement })} className="mt-2 h-11 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm">
                          {enhancements.map((enhancement) => <option key={enhancement}>{enhancement}</option>)}
                        </select>
                      </label>
                      <label className="mt-4 block text-sm font-semibold text-pine">Horizontal focus
                        <input type="range" min="0" max="100" value={activeScene.focusX} onChange={(event) => updateScene(activeScene.id, { focusX: Number(event.target.value) })} className="mt-3 w-full accent-gold" />
                      </label>
                      <label className="mt-4 block text-sm font-semibold text-pine">Vertical focus
                        <input type="range" min="0" max="100" value={activeScene.focusY} onChange={(event) => updateScene(activeScene.id, { focusY: Number(event.target.value) })} className="mt-3 w-full accent-gold" />
                      </label>
                      <button onClick={() => updateScene(activeScene.id, { focusX: 50, focusY: 50, motion: "Auto", enhancement: "Original" })} className="mt-4 flex items-center gap-2 text-sm font-semibold text-charcoal/60"><RotateCcw size={15} /> Reset scene</button>
                    </>
                  ) : <p className="text-sm text-charcoal/60">Select a scene to adjust crop and motion.</p>}
                </Card>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Output settings</p>
                <h2 className="mt-3 font-serif text-4xl font-semibold text-pine">Format it for where people watch.</h2>
                <p className="mt-4 text-sm leading-7 text-charcoal/65">Choose the primary canvas now. You can return and render other formats from the same project without rebuilding the scene order.</p>
                <div className="mt-7 space-y-3">
                  {([
                    ["portrait", "9:16 Portrait", "Instagram Reels, TikTok, Stories"],
                    ["landscape", "16:9 Landscape", "MLS, YouTube, websites"],
                    ["square", "1:1 Square", "Feeds and paid social"]
                  ] as const).map(([value, title, copy]) => (
                    <button key={value} onClick={() => setOrientation(value)} className={`w-full rounded-md border p-4 text-left ${orientation === value ? "border-gold bg-cream shadow-sm" : "border-pine/15 bg-white"}`}>
                      <span className="font-semibold text-pine">{title}</span>
                      <span className="mt-1 block text-sm text-charcoal/55">{copy}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-pine">Resolution</p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(["720p", "1080p"] as const).map((value) => <button key={value} onClick={() => setResolution(value)} className={`h-11 rounded-md border text-sm font-semibold ${resolution === value ? "border-pine bg-pine text-white" : "border-pine/15 bg-white text-pine"}`}>{value}</button>)}
                  </div>
                </div>
              </div>
              <div className="flex min-h-[540px] items-center justify-center rounded-lg border border-pine/15 bg-forest p-7">
                <div className={`${orientationClass(orientation)} relative w-full overflow-hidden rounded-md border border-white/15 bg-pine shadow-2xl`}>
                  {selectedScenes[0] ? <img src={selectedScenes[0].src} alt="Format preview" className="absolute inset-0 h-full w-full object-cover opacity-80" style={{ objectPosition: `${selectedScenes[0].focusX}% ${selectedScenes[0].focusY}%` }} /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{details.bedrooms || "—"} beds · {details.bathrooms || "—"} baths</p>
                    <p className="mt-2 font-serif text-2xl font-semibold">{details.address}</p>
                    <p className="mt-1 text-sm text-white/75">{formatPrice(details.price)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-7 xl:grid-cols-[0.78fr_1.22fr]">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Brand and sound</p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold text-pine">Finish it like a campaign.</h2>
                </div>
                <details open className="rounded-md border border-pine/15 bg-white p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-pine">Templates <ChevronDown size={17} /></summary>
                  <div className="mt-4 grid gap-3">
                    {templates.map((template) => (
                      <button key={template.id} onClick={() => setTemplateId(template.id)} className={`flex items-center gap-3 rounded-md border p-3 text-left ${templateId === template.id ? "border-gold bg-cream" : "border-pine/10"}`}>
                        <span className="h-10 w-14 rounded border" style={{ background: `linear-gradient(135deg, ${template.surface}, ${template.accent})` }} />
                        <span className="text-sm font-semibold text-pine">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </details>
                <details open className="rounded-md border border-pine/15 bg-white p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-pine">Brand assets <ChevronDown size={17} /></summary>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gold/50 bg-cream text-center text-xs font-semibold text-pine">
                      {logoUrl ? <img src={logoUrl} alt="Logo" className="h-14 max-w-[90%] object-contain" /> : <><UploadCloud size={20} className="text-gold" /><span className="mt-2">Upload logo</span></>}
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => addBrandFile(event, "logo")} />
                    </label>
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gold/50 bg-cream text-center text-xs font-semibold text-pine">
                      {headshotUrl ? <img src={headshotUrl} alt="Headshot" className="h-16 w-16 rounded-full object-cover" /> : <><UserRound size={20} className="text-gold" /><span className="mt-2">Upload headshot</span></>}
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => addBrandFile(event, "headshot")} />
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-pine"><input type="checkbox" checked={includeIntro} onChange={(event) => setIncludeIntro(event.target.checked)} className="accent-gold" /> Branded intro</label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-pine"><input type="checkbox" checked={includeOutro} onChange={(event) => setIncludeOutro(event.target.checked)} className="accent-gold" /> Agent outro</label>
                  </div>
                </details>
                <details open className="rounded-md border border-pine/15 bg-white p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-pine">Audio <ChevronDown size={17} /></summary>
                  <label className="mt-4 block text-sm font-semibold text-pine">Music
                    <select value={music} onChange={(event) => setMusic(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm">{tracks.map((track) => <option key={track}>{track}</option>)}</select>
                  </label>
                  <label className="mt-4 block text-sm font-semibold text-pine">Voiceover
                    <select value={voice} onChange={(event) => setVoice(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm">{voices.map((option) => <option key={option}>{option}</option>)}</select>
                  </label>
                </details>
              </div>

              <div className="rounded-lg border border-pine/15 bg-forest p-5 sm:p-7">
                <div className="mb-4 flex items-center justify-between text-white">
                  <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Live preview</p><p className="mt-1 text-sm text-white/60">{selectedTemplate.name} · {music}</p></div>
                  <button onClick={() => setIsPlaying((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-white/10">{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
                </div>
                <div className="flex min-h-[560px] items-center justify-center">
                  <div className={`${orientationClass(orientation)} relative w-full overflow-hidden rounded-md border border-white/15 shadow-2xl`} style={{ backgroundColor: selectedTemplate.surface }}>
                    {currentPreview ? <img src={currentPreview.src} alt="Video preview" className="absolute inset-0 h-full w-full object-cover opacity-85 transition" style={{ objectPosition: `${currentPreview.focusX}% ${currentPreview.focusY}%` }} /> : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    {logoUrl ? <img src={logoUrl} alt="Logo overlay" className="absolute right-4 top-4 h-10 max-w-28 object-contain" /> : <span className="absolute right-4 top-4 border border-white/30 bg-white/10 px-3 py-2 font-serif text-xs font-semibold text-white">Spruce & Shoals</span>}
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: selectedTemplate.accent }}>{formatPrice(details.price)}</p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">{details.address}</h3>
                      <p className="mt-2 text-sm text-white/75">{details.bedrooms || "—"} beds · {details.bathrooms || "—"} baths · {details.squareFeet || "—"} sq ft</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                  {selectedScenes.map((scene, index) => <button key={scene.id} onClick={() => setPreviewIndex(index)} className={`h-14 w-20 shrink-0 overflow-hidden rounded border ${previewIndex === index ? "border-gold" : "border-white/15"}`}><img src={scene.src} alt="" className="h-full w-full object-cover" /></button>)}
                </div>
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="mx-auto max-w-4xl text-center">
              {renderProgress < 100 ? (
                <div className="py-16">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-md border border-gold/40 bg-cream"><Loader2 className="animate-spin text-gold" size={36} /></div>
                  <h2 className="mt-7 font-serif text-4xl font-semibold text-pine">Building your listing video</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-charcoal/60">Preparing {selectedScenes.length} scenes, applying motion, formatting {orientation}, and layering your brand package.</p>
                  <div className="mx-auto mt-8 h-2 max-w-xl overflow-hidden rounded-full bg-pine/10"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${renderProgress}%` }} /></div>
                  <p className="mt-3 text-sm font-semibold text-pine">{renderProgress}%</p>
                </div>
              ) : (
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-pine text-gold"><Check size={30} /></div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gold">Ready to publish</p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold text-pine">Your media package is ready.</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-charcoal/60">The no-paywall workflow is complete. Connect FFmpeg/Mux to replace this prototype render with the final MP4 while preserving the same project package.</p>
                  <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
                    <Card className="p-5"><Video className="text-gold" size={22} /><p className="mt-3 font-semibold text-pine">Full video</p><p className="mt-1 text-sm text-charcoal/55">{orientation} · {resolution} · {estimatedSeconds}s</p></Card>
                    <Card className="p-5"><Scissors className="text-gold" size={22} /><p className="mt-3 font-semibold text-pine">Scene clips</p><p className="mt-1 text-sm text-charcoal/55">{selectedScenes.length} individual clips</p></Card>
                    <Card className="p-5"><MonitorPlay className="text-gold" size={22} /><p className="mt-3 font-semibold text-pine">Share page</p><p className="mt-1 text-sm text-charcoal/55">Client-ready project link</p></Card>
                  </div>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button onClick={downloadProject}><Download size={16} /> Download project package</Button>
                    <Button variant="secondary" onClick={copyShareLink}>{shareCopied ? <Check size={16} /> : <Copy size={16} />} {shareCopied ? "Link copied" : "Copy share link"}</Button>
                    <button onClick={() => { setStep(3); setRenderProgress(0); }} className={buttonClassName("ghost")}><Sparkles size={16} /> Create another version</button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-pine/10 bg-cream px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Button variant="secondary" onClick={() => setStep((Math.max(1, step - 1) as Step))} disabled={step === 1}><ArrowLeft size={16} /> Back</Button>
          <div className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">Saved locally · no payment required</div>
          {step < 6 ? <Button onClick={advance} disabled={!canContinue}>{step === 5 ? "Render video" : "Continue"} <ArrowRight size={16} /></Button> : <a href="/dashboard/projects" className={buttonClassName("secondary")}>View projects <ExternalLink size={16} /></a>}
        </div>
      </Card>
    </div>
  );
}

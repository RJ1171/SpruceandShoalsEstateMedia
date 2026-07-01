import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Captions,
  ChevronDown,
  Clapperboard,
  FileText,
  Image as ImageIcon,
  Layers3,
  Menu,
  Mic2,
  Palette,
  PenLine,
  Play,
  Share2,
  Sparkles,
  UploadCloud,
  Wand2,
  type LucideIcon
} from "lucide-react";
import { brand } from "../config/brand";
import { buttonClassName } from "./ui/button";
import { Card } from "./ui/card";
import { SectionHeading } from "./section-heading";
import { VirtualTourStudio } from "./virtual-tour-studio";

type IconCard = [string, string, LucideIcon];

const trustCards = [
  ["Listing Videos", "Listing-ready video workflows from uploaded photos."],
  ["Social Assets", "Captioned reels, posts, and channel-specific formats."],
  ["Branded Templates", "Reusable visual systems for agents and teams."],
  ["Faster Turnaround", "A calmer path from source files to polished exports."]
];

const services: IconCard[] = [
  ["AI Property Videos", "Create refined listing videos from uploaded photography and details.", Clapperboard],
  ["Listing Photo Enhancement", "Prepare brighter, cleaner, presentation-quality listing imagery.", Wand2],
  ["Social Media Reels", "Package vertical content for Instagram, Facebook, and short-form channels.", Play],
  ["Agent Branding Kits", "Save colors, logos, headshots, disclosures, and advisor details.", Palette],
  ["Property Description Writing", "Draft MLS-friendly, luxury, social, and open house descriptions.", PenLine],
  ["Voiceover & Script Generation", "Prepare narration scripts and brand-consistent voiceover direction.", Mic2],
  ["Open House Content", "Create polished launch assets for showings and weekend promotion.", Building2],
  ["Listing Presentation Assets", "Build client-ready campaign materials from one organized studio.", Layers3]
];

const process = [
  ["Upload listing photos", "Add property photography, video clips, logos, and supporting documents."],
  ["Add property details", "Capture address, price, beds, baths, square footage, and selling points."],
  ["Choose branding and style", "Apply agent identity, brokerage details, colors, and template direction."],
  ["Generate, edit, and export", "Prepare video, descriptions, captions, and launch-ready formats."]
];

const brandPreview = ["Agent logo", "Headshot", "Brand colors", "Brokerage info", "Contact details", "Social handles"];

const features: IconCard[] = [
  ["Custom branding", "Keep every project aligned with your team identity.", Palette],
  ["AI-generated scripts", "Narration and social scripts tailored to listing details.", FileText],
  ["Voiceover options", "Support multiple narration styles and future voice providers.", Mic2],
  ["Multi-format exports", "Prepare vertical, square, and horizontal formats.", Clapperboard],
  ["Social captions", "Generate polished captions and posting copy.", Captions],
  ["MLS-friendly descriptions", "Keep listing copy clear, useful, and editable.", PenLine],
  ["Image enhancement", "Support future correction, staging, and polish workflows.", Wand2],
  ["Organized media library", "Store photos, video, audio, logos, and headshots.", ImageIcon],
  ["Reusable templates", "Create repeatable campaign structures for teams.", Layers3],
  ["Team-ready workflows", "Support agents, teams, brokerages, and media companies.", Share2]
];

const faqs = [
  ["What does Spruce & Shoals Estate Media create?", "The studio helps prepare property videos, listing descriptions, social captions, branded media packages, and presentation assets."],
  ["Is this for individual agents or teams?", "Yes. The experience is designed for solo agents, growing teams, brokerages, and real estate media partners."],
  ["Can I customize the branding?", "Brand profiles can hold logos, colors, typography choices, contact details, social handles, and compliance language."],
  ["Can I export videos for Instagram and Facebook?", "The architecture supports vertical, square, and horizontal output paths for social and listing channels."],
  ["Can I use my own photos and logos?", "Yes. The intake flow accepts listing images, videos, audio, logos, headshots, PDFs, and description notes."],
  ["Can this support multiple listings?", "The project model is built around reusable listing packages and organization-level media libraries."]
];

function ShowcaseCard({ title, label, image, video, description }: { title: string; label: string; image: string; video: string; description: string }) {
  return (
    <Card className="group corner-frame overflow-hidden p-3">
      <div className="aspect-video overflow-hidden rounded-md border border-pine/15 bg-pine">
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={image}
          aria-label={`${title} generated listing video`}
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{label}</p>
        <h3 className="mt-3 font-serif text-2xl font-semibold text-pine">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-charcoal/70">{description}</p>
          <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-pine/55"><Play size={14} className="text-gold" /> 24-second room-to-room property tour</p>
      </div>
    </Card>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-cream">
      <nav className="sticky top-0 z-50 border-b border-gold/25 bg-forest/95 text-offWhite shadow-[0_12px_35px_rgba(15,44,37,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3" aria-label={`${brand.name} home`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-gold/50 bg-pine font-serif text-xl font-semibold text-gold">S</span>
            <span>
              <span className="block font-serif text-xl font-semibold leading-5">{brand.shortName}</span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-offWhite/60">Estate Media</span>
            </span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-offWhite/80 md:flex">
            {brand.navigation.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-gold">{item.label}</a>
            ))}
            <Link href="/create" className={buttonClassName("gold")}>{brand.ctas.primary}</Link>
          </div>
          <details className="relative md:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-gold/40 text-gold">
              <Menu size={20} />
            </summary>
            <div className="absolute right-0 top-14 w-64 rounded-lg border border-gold/30 bg-forest p-4 shadow-luxury">
              {brand.navigation.map((item) => (
                <a key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm text-offWhite/80 hover:bg-pine hover:text-gold">{item.label}</a>
              ))}
              <Link href="/create" className={buttonClassName("gold", "mt-3 w-full")}>{brand.ctas.primary}</Link>
            </div>
          </details>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-[0.9fr_1.1fr] md:pt-20">
        <div className="border-l border-gold pl-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-pine">
            <BadgeCheck size={15} className="text-gold" /> Luxury Listing Media Studio
          </div>
          <h1 className="font-serif text-5xl font-semibold leading-[0.95] text-pine md:text-7xl">
            Refined Real Estate Media for Listings That Deserve More
          </h1>
          <div className="my-7 h-px max-w-sm bg-gradient-to-r from-gold via-pine/25 to-transparent" />
          <p className="max-w-xl text-lg leading-8 text-charcoal/75">
            Spruce & Shoals Estate Media helps agents, teams, and brokerages turn listing photos into polished video, social content, and elevated marketing assets built for today's market.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/create" className={buttonClassName("primary", "w-full sm:w-auto")}>{brand.ctas.heroPrimary} <ArrowRight size={16} /></Link>
            <a href="#portfolio" className={buttonClassName("secondary", "w-full sm:w-auto")}><Play size={16} /> {brand.ctas.heroSecondary}</a>
          </div>
        </div>
        <div className="corner-frame relative rounded-lg border border-pine/20 bg-white p-3 shadow-luxury">
          <Image
            src="/images/luxury-platform-hero.png"
            alt="Luxury coastal listing with estate media previews"
            width={1400}
            height={900}
            priority
            className="aspect-[1.35] w-full rounded-md border border-pine/10 object-cover"
          />
          <Card className="absolute bottom-7 left-7 max-w-sm border-gold/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Media preview</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {["Video", "Social", "MLS"].map((item) => (
                <span key={item} className="rounded-md border border-pine/15 bg-offWhite px-3 py-2 text-xs font-semibold text-pine">{item}</span>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid gap-4 md:grid-cols-4">
          {trustCards.map(([title, copy]) => (
            <Card key={title} className="outline-tile p-5">
              <div className="mb-4 h-1 w-12 bg-gold" />
              <h2 className="font-serif text-2xl font-semibold text-pine">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/70">{copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="services" className="section-frame py-20">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading eyebrow="Services" title="Estate media services for polished listing launches" copy="A full creative workflow for property video, listing copy, agent branding, and social-ready marketing materials." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([title, copy, Icon]) => (
              <Card key={title} className="outline-tile p-5 transition hover:-translate-y-1 hover:border-gold/70">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-gold/40 bg-white"><Icon size={22} className="text-gold" /></div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-pine">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/70">{copy}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading eyebrow="Portfolio" title="A showcase built like a luxury listing presentation" copy="Original coastal property imagery presented with the restraint, clarity, and polish of a high-end listing campaign." />
        <div className="mt-12">
          <VirtualTourStudio embedded />
        </div>
        <div className="mt-16 border-t border-gold/30 pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Generated walkthrough films</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold text-pine md:text-4xl">Room-to-room stories for every listing style</h3>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
            <ShowcaseCard title="Atlantic Shingle Estate" label="Featured residence" image="/images/portfolio/atlantic-shingle-estate.png" video="/videos/portfolio/atlantic-shingle-estate.mp4" description="A cedar-shingled oceanfront retreat framed by native grasses and broad Atlantic views." />
          <ShowcaseCard title="North Shore Modern" label="Architectural story" image="/images/portfolio/north-shore-modern.png" video="/videos/portfolio/north-shore-modern.mp4" description="Modern coastal lines, weathered materials, and floor-to-ceiling views over a quiet rocky cove." />
          <ShowcaseCard title="Maine at Blue Hour" label="Twilight campaign" image="/images/portfolio/maine-blue-hour.png" video="/videos/portfolio/maine-blue-hour.mp4" description="Warm interior light and cool coastal evening tones designed for a memorable launch moment." />
          <ShowcaseCard title="Cape Cod Glass House" label="Lifestyle presentation" image="/images/portfolio/cape-cod-pool-house.png" video="/videos/portfolio/cape-cod-pool-house.mp4" description="A contemporary beach residence composed around glass, water, dunes, and soft coastal daylight." />
        </div>
      </section>

      <section id="process" className="bg-forest py-20 text-offWhite">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading eyebrow="Process" title="A calm studio flow for every listing" copy="Upload, describe, brand, generate, edit, and export from a single focused workspace." className="[&_*]:text-offWhite [&_p:first-child]:!text-gold" />
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {process.map(([title, copy], index) => (
              <div key={title} className="rounded-lg border border-white/15 bg-white/5 p-5 shadow-sm">
                <p className="font-serif text-5xl font-semibold text-gold">{index + 1}</p>
                <h3 className="mt-4 font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-offWhite/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-frame py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="border-l border-gold pl-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Brand Center</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-pine md:text-5xl">Save the details that make every asset feel unmistakably yours.</h2>
            <p className="mt-5 text-base leading-8 text-charcoal/70">A polished dashboard preview for brand identity, brokerage information, contact details, and reusable style controls.</p>
          </div>
          <Card className="corner-frame p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {brandPreview.map((item) => (
                <div key={item} className="outline-tile rounded-md p-4">
                  <BadgeCheck size={18} className="text-gold" />
                  <p className="mt-3 font-semibold text-pine">{item}</p>
                  <div className="mt-3 h-2 rounded-full bg-tan/60" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading eyebrow="Features" title="Built for listing media operations" copy="Everything needed to keep listing assets, AI drafts, brand controls, and media exports organized." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(([title, copy, Icon]) => (
            <Card key={title} className="p-5">
              <Icon size={22} className="text-gold" />
              <h3 className="mt-4 font-semibold text-pine">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/65">{copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
        <SectionHeading eyebrow="FAQ" title="Straight answers before the first listing" />
        <div className="mt-10 divide-y divide-pine/15 rounded-lg border border-pine/20 bg-white px-5 shadow-sm">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-pine">
                {q}
                <ChevronDown size={18} className="text-gold transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-charcoal/70">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-pine px-5 py-20 text-center text-offWhite">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Start the studio</p>
          <h2 className="mx-auto mt-4 font-serif text-4xl font-semibold md:text-6xl">Bring a More Refined Standard to Your Listing Media</h2>
          <div className="gold-rule mx-auto my-7 max-w-md" />
          <p className="mx-auto max-w-2xl text-base leading-8 text-offWhite/75">Create polished property videos, branded assets, and social-ready content from one streamlined studio.</p>
          <Link href="/create" className={buttonClassName("gold", "mt-8")}>{brand.ctas.final} <ArrowRight size={16} /></Link>
        </div>
      </section>

      <footer className="bg-forest px-5 py-12 text-offWhite">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <p className="font-serif text-3xl font-semibold">{brand.name}</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-offWhite/65">{brand.description}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Services</p>
            <div className="mt-4 space-y-2 text-sm text-offWhite/70"><p>Property videos</p><p>Social assets</p><p>Brand kits</p></div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-offWhite/70">
              <p className="font-semibold text-offWhite">{brand.contact.name}</p>
              <a className="block transition hover:text-gold" href="tel:+16032608166">{brand.contact.phone}</a>
              <a className="block break-all transition hover:text-gold" href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
              <a className="block transition hover:text-gold" href="https://www.instagram.com/rocco_f6" target="_blank" rel="noreferrer">@{brand.contact.instagram}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

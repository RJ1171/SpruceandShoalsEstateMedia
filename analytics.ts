import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  className
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-gold">{eyebrow}</p> : null}
      <h2 className="font-serif text-4xl font-semibold leading-tight text-pine md:text-5xl">{title}</h2>
      {copy ? <p className="mt-5 text-base leading-8 text-charcoal/75 md:text-lg">{copy}</p> : null}
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Braces,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";

type DemoCardProps = {
  href: string;
  title: string;
  description: string;
  detail: string;
  cta: string;
  icon: LucideIcon;
  toneClassName: string;
};

const demoCards = [
  {
    href: "/widget",
    title: "Widget Demo",
    description: "Drop-in UI. Fastest path to launch.",
    detail: "Ready-made execution flow for MVPs and prototypes.",
    cta: "Open Widget Demo",
    icon: LayoutTemplate,
    toneClassName: "bg-accent/10 text-accent-ink",
  },
  {
    href: "/sdk",
    title: "SDK Demo",
    description: "Custom flow, validation, and backend control.",
    detail: "Own the request boundary, result shaping, and status checks.",
    cta: "Open SDK Demo",
    icon: Braces,
    toneClassName: "bg-pink/45 text-foreground",
  },
] satisfies DemoCardProps[];

export default function Home() {
  return (
    <div className="py-8 sm:py-12">
      <section className="surface-ring mesh-border relative overflow-hidden rounded-[40px] bg-white/82 px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(247,194,255,0.22),_transparent_30%),radial-gradient(circle_at_left,_rgba(92,103,255,0.12),_transparent_34%)]" />
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/10 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent-ink">
            LI.FI Demo
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Bridge and swap with LI.FI
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Explore two integration paths: Widget for fastest setup, SDK for
              deeper control.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/widget"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(92,103,255,0.22)] transition hover:bg-accent-ink"
            >
              Open Widget Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sdk"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
            >
              Open SDK Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {demoCards.map((card) => (
          <DemoCard key={card.href} {...card} />
        ))}
      </section>
    </div>
  );
}

function DemoCard({
  href,
  title,
  description,
  detail,
  cta,
  icon: Icon,
  toneClassName,
}: DemoCardProps) {
  return (
    <Link
      href={href}
      className="group surface-ring mesh-border relative overflow-hidden rounded-[32px] bg-white/82 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-accent/15 hover:bg-white sm:p-7"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(92,103,255,0.28),_transparent)]" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Demo Path
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm leading-6 text-muted">{description}</p>
          </div>
        </div>
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            toneClassName,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <p className="max-w-xs text-sm leading-6 text-foreground/80">{detail}</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-ink">
          {cta}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

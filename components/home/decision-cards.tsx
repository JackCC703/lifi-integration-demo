import Link from "next/link";
import { ArrowRight, Braces, LayoutTemplate } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

export function DecisionCards() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        eyebrow="Decision card"
        title="Use Widget when you want the fastest path"
        description="A drop-in UI is usually the right answer when you need to validate demand before investing in a custom execution stack."
      >
        <div className="space-y-4 text-sm text-muted">
          <div className="rounded-2xl border border-line bg-pink/35 p-4">
            <LayoutTemplate className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold text-foreground">Best for</p>
            <p className="mt-2 leading-7">
              MVPs, hackathons, side projects, and early-stage product
              experiments that need swap or bridge capability immediately.
            </p>
          </div>
          <Link
            href="/widget"
            className="inline-flex items-center gap-2 font-semibold text-accent-ink"
          >
            Explore the Widget page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Decision card"
        title="Use SDK when you need more control"
        description="The SDK path is where validation, normalization, logging, and status tracking can live in a maintainable way."
      >
        <div className="space-y-4 text-sm text-muted">
          <div className="rounded-2xl border border-line bg-white/75 p-4">
            <Braces className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold text-foreground">Best for</p>
            <p className="mt-2 leading-7">
              Teams that need custom forms, better observability, explicit
              request shaping, and a server boundary for future API key usage.
            </p>
          </div>
          <Link
            href="/sdk"
            className="inline-flex items-center gap-2 font-semibold text-accent-ink"
          >
            Explore the SDK page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionCard>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Layers3, Rocket, ShieldCheck } from "lucide-react";
import {
  PRIMARY_ROUTE,
  WIDGET_ALLOWED_CHAIN_IDS,
} from "@/lib/constants/demo-defaults";
import { SectionCard } from "@/components/shared/section-card";
import { WidgetDemoLoader } from "@/components/widget/widget-demo-loader";

export default function WidgetPage() {
  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-12">
      <section className="surface-ring mesh-border flex flex-col gap-5 rounded-[36px] bg-white/82 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-ink">
            Widget Demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Fastest path to a live LI.FI integration.
          </h1>
          <p className="text-sm leading-6 text-muted sm:text-base">
            Drop in the widget, keep the shell branded, and ship a bridge or
            swap flow with minimal custom code.
          </p>
        </div>

        <Link
          href="/sdk"
          className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white/78 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-white"
        >
          Explore SDK Demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <WidgetDemoLoader />

      <SectionCard
        eyebrow="Why Widget"
        title="Use it when speed matters most"
        description="The widget stays front and center here. Everything else is reduced to the minimum context needed to explain why this path is fast."
      >
        <div className="grid gap-3 text-sm text-muted sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white/78 p-4">
            <Rocket className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold text-foreground">Drop-in UI</p>
            <p className="mt-2 leading-6">
              Ready-made execution flow for MVPs, launches, and prototypes.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white/78 p-4">
            <Layers3 className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold text-foreground">Focused defaults</p>
            <p className="mt-2 leading-6">
              Starts on {PRIMARY_ROUTE.fromLabel} to {PRIMARY_ROUTE.toLabel} with{" "}
              {WIDGET_ALLOWED_CHAIN_IDS.length} curated chains.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white/78 p-4">
            <ShieldCheck className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold text-foreground">Server-ready</p>
            <p className="mt-2 leading-6">
              Easy to launch now, with a clean path to deeper backend control
              later.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

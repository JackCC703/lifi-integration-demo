"use client";

import { LiFiWidget, type WidgetConfig } from "@lifi/widget";
import {
  DEMO_INTEGRATOR,
  PRIMARY_ROUTE,
  WIDGET_ALLOWED_CHAIN_IDS,
  WIDGET_ALLOWED_TOKENS,
  WIDGET_DEFAULTS,
} from "@/lib/constants/demo-defaults";

const widgetConfig: Partial<WidgetConfig> = {
  appearance: "light",
  variant: "wide",
  fromChain: WIDGET_DEFAULTS.fromChain,
  toChain: WIDGET_DEFAULTS.toChain,
  fromToken: WIDGET_DEFAULTS.fromToken,
  toToken: WIDGET_DEFAULTS.toToken,
  chains: {
    allow: [...WIDGET_ALLOWED_CHAIN_IDS],
  },
  tokens: {
    allow: WIDGET_ALLOWED_TOKENS,
  },
  theme: {
    container: {
      borderRadius: "28px",
      border: "1px solid rgba(17, 24, 39, 0.08)",
      boxShadow:
        "0 28px 72px rgba(17, 24, 39, 0.08), 0 8px 24px rgba(92, 103, 255, 0.05)",
    },
  },
};

export function WidgetDemoShell() {
  return (
    <section className="surface-ring mesh-border rounded-[36px] bg-white/88 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-ink">
            Live Widget
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Drop-in LI.FI UI with curated defaults.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-line bg-white/78 px-3 py-1 text-xs font-medium text-muted">
            {PRIMARY_ROUTE.fromLabel} to {PRIMARY_ROUTE.toLabel}
          </div>
          <div className="rounded-full border border-line bg-white/78 px-3 py-1 text-xs font-medium text-muted">
            {WIDGET_ALLOWED_CHAIN_IDS.length} curated chains
          </div>
        </div>
      </div>
      <LiFiWidget integrator={DEMO_INTEGRATOR} config={widgetConfig} />
    </section>
  );
}

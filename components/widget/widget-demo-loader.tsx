"use client";

import dynamic from "next/dynamic";

const WidgetDemoShell = dynamic(
  () =>
    import("@/components/widget/widget-demo-shell").then(
      (module) => module.WidgetDemoShell,
    ),
  {
    ssr: false,
    loading: () => (
      <section className="surface-ring mesh-border rounded-[36px] bg-white/88 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-ink">
          Live Widget
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Loading the LI.FI widget...
        </p>
      </section>
    ),
  },
);

export function WidgetDemoLoader() {
  return <WidgetDemoShell />;
}

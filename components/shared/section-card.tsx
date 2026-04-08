import type { ReactNode } from "react";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      className={[
        "surface-ring mesh-border rounded-[30px] bg-surface-strong p-6 backdrop-blur-xl sm:p-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-ink">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}

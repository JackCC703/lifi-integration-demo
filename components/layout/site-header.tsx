"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/widget", label: "Widget Demo" },
  { href: "/sdk", label: "SDK Demo" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 pt-4 sm:pt-6">
      <div className="surface-ring mesh-border flex flex-col gap-3 rounded-[28px] bg-white/82 px-4 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#5c67ff_0%,_#f7c2ff_100%)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(92,103,255,0.25)]">
            LI
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">
              LI.FI Demo
            </p>
            <p className="text-xs text-muted">
              Widget and SDK
            </p>
          </div>
        </Link>

        <nav className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-none sm:auto-cols-max sm:grid-flow-col">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-accent text-white shadow-[0_12px_30px_rgba(92,103,255,0.22)]"
                    : "border border-transparent bg-white/55 text-muted hover:border-line hover:bg-white hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

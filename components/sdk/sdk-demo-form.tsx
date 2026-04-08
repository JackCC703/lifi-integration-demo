"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft, Route, Sparkles } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  DEMO_FROM_ADDRESS,
  PRIMARY_ROUTE,
  getPreferredTokenAddress,
} from "@/lib/constants/demo-defaults";
import { sdkFormSchema, type SdkFormValues } from "@/lib/lifi/validators";
import type { DemoChain, DemoToken, QuoteMode } from "@/types/lifi";
import { SectionCard } from "@/components/shared/section-card";

const EMPTY_TOKENS: DemoToken[] = [];

type SdkDemoFormProps = {
  chains: DemoChain[];
  tokensByChain: Record<number, DemoToken[]>;
  isBootstrapping: boolean;
  isSubmitting: boolean;
  onEnsureTokens: (chainId: number) => Promise<DemoToken[]>;
  onSubmit: (values: SdkFormValues, mode: QuoteMode) => Promise<void>;
};

export function SdkDemoForm({
  chains,
  tokensByChain,
  isBootstrapping,
  isSubmitting,
  onEnsureTokens,
  onSubmit,
}: SdkDemoFormProps) {
  const [mode, setMode] = useState<QuoteMode>("routes");

  const form = useForm<SdkFormValues>({
    resolver: zodResolver(sdkFormSchema),
    defaultValues: {
      fromChainId: PRIMARY_ROUTE.fromChainId,
      toChainId: PRIMARY_ROUTE.toChainId,
      fromTokenAddress: getPreferredTokenAddress(PRIMARY_ROUTE.fromChainId),
      toTokenAddress: getPreferredTokenAddress(PRIMARY_ROUTE.toChainId),
      amount: "10",
      fromAddress: DEMO_FROM_ADDRESS,
    },
  });

  const fromChainId = useWatch({
    control: form.control,
    name: "fromChainId",
  });
  const toChainId = useWatch({
    control: form.control,
    name: "toChainId",
  });

  const fromTokens = tokensByChain[fromChainId] ?? EMPTY_TOKENS;
  const toTokens = tokensByChain[toChainId] ?? EMPTY_TOKENS;

  useEffect(() => {
    if (fromChainId) {
      void onEnsureTokens(fromChainId);
    }
  }, [fromChainId, onEnsureTokens]);

  useEffect(() => {
    if (toChainId) {
      void onEnsureTokens(toChainId);
    }
  }, [toChainId, onEnsureTokens]);

  useEffect(() => {
    if (!fromTokens.length) {
      return;
    }

    const current = form.getValues("fromTokenAddress");

    if (fromTokens.some((token) => token.address === current)) {
      return;
    }

    const preferred =
      fromTokens.find(
        (token) => token.address === getPreferredTokenAddress(fromChainId),
      ) ?? fromTokens[0];

    if (preferred) {
      startTransition(() => {
        form.setValue("fromTokenAddress", preferred.address, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });
    }
  }, [form, fromChainId, fromTokens]);

  useEffect(() => {
    if (!toTokens.length) {
      return;
    }

    const current = form.getValues("toTokenAddress");

    if (toTokens.some((token) => token.address === current)) {
      return;
    }

    const preferred =
      toTokens.find(
        (token) => token.address === getPreferredTokenAddress(toChainId),
      ) ?? toTokens[0];

    if (preferred) {
      startTransition(() => {
        form.setValue("toTokenAddress", preferred.address, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });
    }
  }, [form, toChainId, toTokens]);

  return (
    <SectionCard
      eyebrow="Request Builder"
      title="Custom request flow"
      description="Submit quote or routes through your own `/api/lifi/*` boundary."
    >
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values, mode);
        })}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("quote")}
            className={[
              "rounded-2xl border px-4 py-4 text-left transition",
              mode === "quote"
                ? "border-accent bg-accent/10 text-foreground"
                : "border-line bg-white/78 text-muted hover:bg-white",
            ].join(" ")}
          >
            <Sparkles className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold">Quote</p>
            <p className="mt-2 text-sm leading-6">
              One recommended answer for a quick preview.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode("routes")}
            className={[
              "rounded-2xl border px-4 py-4 text-left transition",
              mode === "routes"
                ? "border-accent bg-accent/10 text-foreground"
                : "border-line bg-white/78 text-muted hover:bg-white",
            ].join(" ")}
          >
            <Route className="mb-3 h-5 w-5 text-accent-ink" />
            <p className="font-semibold">Routes</p>
            <p className="mt-2 text-sm leading-6">
              Candidate plans with more routing detail and tradeoffs.
            </p>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From chain" error={form.formState.errors.fromChainId?.message}>
            <select
              className={fieldClassName}
              {...form.register("fromChainId", { valueAsNumber: true })}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="To chain" error={form.formState.errors.toChainId?.message}>
            <select
              className={fieldClassName}
              {...form.register("toChainId", { valueAsNumber: true })}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="From token"
            error={form.formState.errors.fromTokenAddress?.message}
          >
            <select className={fieldClassName} {...form.register("fromTokenAddress")}>
              {fromTokens.map((token) => (
                <option key={`${token.chainId}:${token.address}`} value={token.address}>
                  {token.symbol} · {token.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="To token"
            error={form.formState.errors.toTokenAddress?.message}
          >
            <select className={fieldClassName} {...form.register("toTokenAddress")}>
              {toTokens.map((token) => (
                <option key={`${token.chainId}:${token.address}`} value={token.address}>
                  {token.symbol} · {token.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Amount" error={form.formState.errors.amount?.message}>
          <input
            className={fieldClassName}
            inputMode="decimal"
            placeholder="10"
            {...form.register("amount")}
          />
        </Field>

        <Field label="From address" error={form.formState.errors.fromAddress?.message}>
          <input
            className={fieldClassName}
            placeholder="0x..."
            {...form.register("fromAddress")}
          />
        </Field>

        <button
          type="submit"
          disabled={isBootstrapping || isSubmitting || !chains.length}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(92,103,255,0.2)] transition hover:bg-accent-ink disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          <ArrowRightLeft className="h-4 w-4" />
          {isSubmitting
            ? "Querying LI.FI..."
            : mode === "quote"
              ? "Fetch Best Quote"
              : "Fetch Candidate Routes"}
        </button>

        <div className="rounded-2xl border border-dashed border-line bg-white/55 px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted">
          Requests stay behind your own `/api/lifi/*` handlers.
        </div>
      </form>
    </SectionCard>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

const fieldClassName =
  "w-full rounded-[20px] border border-line bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:bg-white";

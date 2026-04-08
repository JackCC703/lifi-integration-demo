"use client";

import { useEffect, useRef, useState } from "react";
import {
  FALLBACK_ROUTE,
  PRIMARY_ROUTE,
} from "@/lib/constants/demo-defaults";
import {
  fetchChains,
  fetchTokens,
  requestQuote,
  requestRoutes,
  toClientError,
} from "@/lib/lifi/client";
import type {
  ApiErrorPayload,
  DemoChain,
  DemoRequestResponse,
  DemoRequestState,
  DemoToken,
  QuoteMode,
} from "@/types/lifi";
import { SectionCard } from "@/components/shared/section-card";
import { SdkDemoForm } from "@/components/sdk/sdk-demo-form";
import { SdkResultPanel } from "@/components/sdk/sdk-result-panel";
import { StatusPanel } from "@/components/sdk/status-panel";
import type { SdkFormValues } from "@/lib/lifi/validators";

export function SdkDemoShell() {
  const tokenCache = useRef<Partial<Record<number, DemoToken[]>>>({});
  const tokenRequests = useRef<Partial<Record<number, Promise<DemoToken[]>>>>({});
  const [chains, setChains] = useState<DemoChain[]>([]);
  const [tokensByChain, setTokensByChain] = useState<Record<number, DemoToken[]>>(
    {},
  );
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<ApiErrorPayload | null>(
    null,
  );
  const [result, setResult] = useState<DemoRequestResponse | null>(null);
  const [requestError, setRequestError] = useState<ApiErrorPayload | null>(null);
  const [requestState, setRequestState] = useState<DemoRequestState>({
    stage: "idle",
    message:
      "Pick a request mode and submit the form to query LI.FI through your own backend boundary.",
    hint:
      "The raw response stays available so an engineer can inspect the full object shape after reading the summary.",
  });

  async function ensureTokens(chainId: number) {
    if (tokenCache.current[chainId]) {
      return tokenCache.current[chainId];
    }

    if (tokenRequests.current[chainId]) {
      return tokenRequests.current[chainId];
    }

    tokenRequests.current[chainId] = fetchTokens(chainId)
      .then((payload) => {
        tokenCache.current[chainId] = payload.tokens;
        setTokensByChain((current) => ({
          ...current,
          [chainId]: payload.tokens,
        }));

        return payload.tokens;
      })
      .finally(() => {
        delete tokenRequests.current[chainId];
      });

    return tokenRequests.current[chainId];
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        const chainPayload = await fetchChains();
        setChains(chainPayload.chains);

        await Promise.all([
          ensureTokens(PRIMARY_ROUTE.fromChainId),
          ensureTokens(PRIMARY_ROUTE.toChainId),
          ensureTokens(FALLBACK_ROUTE.toChainId),
        ]);
      } catch (error) {
        setBootstrapError(toClientError(error));
      } finally {
        setIsBootstrapping(false);
      }
    }

    void bootstrap();
  }, []);

  async function handleRequest(values: SdkFormValues, mode: QuoteMode) {
    setIsSubmitting(true);
    setResult(null);
    setRequestError(null);
    setRequestState({
      stage: "loading",
      message:
        mode === "quote"
          ? "Requesting the best quote from LI.FI..."
          : "Requesting candidate routes from LI.FI...",
      hint:
        "The page only owns UI state. Route handlers own validation, SDK calls, and normalization.",
    });

    try {
      const [fromTokens, toTokens] = await Promise.all([
        ensureTokens(values.fromChainId),
        ensureTokens(values.toChainId),
      ]);
      const fromToken = fromTokens.find(
        (token) => token.address === values.fromTokenAddress,
      );
      const toToken = toTokens.find(
        (token) => token.address === values.toTokenAddress,
      );

      if (!fromToken || !toToken) {
        throw {
          stage: "validation",
          code: "TOKEN_NOT_FOUND",
          message:
            "Selected token metadata is missing. Refresh token lists and try again.",
          suggestion:
            "Pick a token from the dropdown again so the request can be rebuilt with chain-aware token data.",
        } satisfies ApiErrorPayload;
      }

      const payload = {
        fromChain: values.fromChainId,
        toChain: values.toChainId,
        fromToken,
        toToken,
        amount: values.amount,
        fromAddress: values.fromAddress,
      };

      const response =
        mode === "quote"
          ? await requestQuote(payload)
          : await requestRoutes(payload);

      setResult(response);
      setRequestState({
        stage: "success",
        message:
          mode === "quote"
            ? "Best quote received and normalized."
            : "Routes received, ranked, and summarized.",
        hint:
          "Read the summary first, then open the raw JSON if you want the complete LI.FI response shape.",
      });
    } catch (error) {
      const apiError = toClientError(error);

      setRequestError(apiError);
      setRequestState({
        stage: "error",
        message: apiError.message,
        hint: apiError.suggestion,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-12">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-ink">
            SDK Demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Build the LI.FI flow yourself.
          </h1>
          <p className="text-sm leading-6 text-muted sm:text-base">
            Query quote or routes through your own backend boundary, then
            inspect normalized output and transaction status in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted">
          <div className="rounded-full border border-line bg-white/78 px-3 py-1">
            Quote and routes
          </div>
          <div className="rounded-full border border-line bg-white/78 px-3 py-1">
            {PRIMARY_ROUTE.fromLabel} to {PRIMARY_ROUTE.toLabel}
          </div>
          <div className="rounded-full border border-line bg-white/78 px-3 py-1">
            Fallback {FALLBACK_ROUTE.fromLabel} to {FALLBACK_ROUTE.toLabel}
          </div>
        </div>
      </section>

      {bootstrapError ? (
        <SectionCard
          eyebrow="Bootstrap error"
          title="Failed to load LI.FI metadata"
          description={bootstrapError.message}
        >
          <p className="text-sm leading-6 text-muted">{bootstrapError.suggestion}</p>
        </SectionCard>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <SdkDemoForm
          chains={chains}
          tokensByChain={tokensByChain}
          isBootstrapping={isBootstrapping}
          isSubmitting={isSubmitting}
          onEnsureTokens={ensureTokens}
          onSubmit={handleRequest}
        />
        <SdkResultPanel
          result={result}
          requestError={requestError}
          requestState={requestState}
        />
      </section>

      <StatusPanel chains={chains} />
    </div>
  );
}

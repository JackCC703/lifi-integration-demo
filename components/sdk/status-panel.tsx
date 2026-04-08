"use client";

import { Activity, Search } from "lucide-react";
import { useState } from "react";
import { STATUS_HELP_TEXT } from "@/lib/constants/demo-defaults";
import { requestStatus, toClientError } from "@/lib/lifi/client";
import { statusQuerySchema } from "@/lib/lifi/validators";
import type {
  ApiErrorPayload,
  DemoChain,
  DemoStatusResponse,
  DemoRequestState,
} from "@/types/lifi";
import { JsonViewer } from "@/components/shared/json-viewer";
import { SectionCard } from "@/components/shared/section-card";

type StatusPanelProps = {
  chains: DemoChain[];
};

export function StatusPanel({ chains }: StatusPanelProps) {
  const [txHash, setTxHash] = useState("");
  const [fromChain, setFromChain] = useState("");
  const [toChain, setToChain] = useState("");
  const [bridge, setBridge] = useState("");
  const [state, setState] = useState<DemoRequestState>({
    stage: "idle",
    message: "Paste a transaction hash to inspect the LI.FI status endpoint.",
    hint: STATUS_HELP_TEXT,
  });
  const [error, setError] = useState<ApiErrorPayload | null>(null);
  const [result, setResult] = useState<DemoStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = statusQuerySchema.safeParse({
      txHash,
      fromChain: fromChain ? Number(fromChain) : undefined,
      toChain: toChain ? Number(toChain) : undefined,
      bridge: bridge.trim() || undefined,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const apiError = {
        stage: "validation",
        code: "INVALID_STATUS_QUERY",
        message: issue?.message ?? "Invalid status query.",
        suggestion:
          "Provide a valid EVM tx hash. Add chain or bridge filters if the transaction is not found immediately.",
      } satisfies ApiErrorPayload;

      setError(apiError);
      setResult(null);
      setState({
        stage: "error",
        message: apiError.message,
        hint: apiError.suggestion,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setState({
        stage: "loading",
        message: "Checking LI.FI transfer status...",
        hint:
          "Status lookup may return pending, not found, failed, or done depending on indexing and bridge progress.",
      });

      const status = await requestStatus(parsed.data);

      setResult(status);
      setState({
        stage: "success",
        message: `${status.summary.status}${status.summary.substatus ? ` · ${status.summary.substatus}` : ""}`,
        hint: status.summary.note,
      });
    } catch (unknownError) {
      const apiError = toClientError(unknownError);

      setError(apiError);
      setState({
        stage: "error",
        message: apiError.message,
        hint: apiError.suggestion,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SectionCard
      eyebrow="Status Lookup"
      title="Transaction status"
      description="Optional tx hash check for the LI.FI transfer lifecycle."
    >
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-foreground">Transaction hash</span>
            <input
              className={fieldClassName}
              value={txHash}
              onChange={(event) => setTxHash(event.target.value)}
              placeholder="0x..."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">From chain</span>
              <select
                className={fieldClassName}
                value={fromChain}
                onChange={(event) => setFromChain(event.target.value)}
              >
                <option value="">Any</option>
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">To chain</span>
              <select
                className={fieldClassName}
                value={toChain}
                onChange={(event) => setToChain(event.target.value)}
              >
                <option value="">Any</option>
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-foreground">
              Bridge key (optional)
            </span>
            <input
              className={fieldClassName}
              value={bridge}
              onChange={(event) => setBridge(event.target.value)}
              placeholder="across, hop, stargate..."
            />
          </label>

          <p className="text-sm leading-6 text-muted">{STATUS_HELP_TEXT}</p>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(92,103,255,0.2)] transition hover:bg-accent-ink disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            <Search className="h-4 w-4" />
            {isLoading ? "Checking status..." : "Check Status"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-3xl border border-line bg-white/78 p-5">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-accent-ink" />
              <div>
                <p className="text-sm font-semibold text-foreground">Request state</p>
                <p className="text-sm text-muted">{state.message}</p>
              </div>
            </div>
            {state.hint ? (
              <p className="mt-4 text-sm leading-7 text-muted">{state.hint}</p>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm leading-7 text-rose-700">
              <p className="font-semibold text-rose-800">{error.code}</p>
              <p className="mt-2">{error.suggestion}</p>
            </div>
          ) : null}

          {result ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Status" value={result.summary.status} />
                <Metric label="Substatus" value={result.summary.substatus ?? "—"} />
                <Metric label="Tool" value={result.summary.tool ?? "—"} />
                <Metric
                  label="Sending chain"
                  value={`${result.summary.sendingChainId}`}
                />
                <Metric
                  label="Receiving chain"
                  value={
                    result.summary.receivingChainId
                      ? `${result.summary.receivingChainId}`
                      : "—"
                  }
                />
                <Metric label="Sending tx" value={shortenHash(result.summary.sendingTxHash)} />
              </div>

              <div className="rounded-3xl border border-line bg-white/78 p-5 text-sm text-muted">
                <p className="font-semibold text-foreground">Useful links</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={result.summary.sendingTxLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line bg-white px-3 py-2 font-medium text-accent-ink transition hover:border-accent/20 hover:bg-accent/5"
                  >
                    Source explorer
                  </a>
                  {result.summary.receivingTxLink ? (
                    <a
                      href={result.summary.receivingTxLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-white px-3 py-2 font-medium text-accent-ink transition hover:border-accent/20 hover:bg-accent/5"
                    >
                      Destination explorer
                    </a>
                  ) : null}
                  {result.summary.lifiExplorerLink ? (
                    <a
                      href={result.summary.lifiExplorerLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-white px-3 py-2 font-medium text-accent-ink transition hover:border-accent/20 hover:bg-accent/5"
                    >
                      LI.FI explorer
                    </a>
                  ) : null}
                </div>
              </div>

              <JsonViewer data={result.raw} />
            </>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/75 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-7 text-foreground">{value}</p>
    </div>
  );
}

function shortenHash(value: string) {
  if (value.length < 14) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

const fieldClassName =
  "w-full rounded-[20px] border border-line bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:bg-white";

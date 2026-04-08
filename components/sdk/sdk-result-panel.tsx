import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Route,
  Sparkles,
} from "lucide-react";
import { JsonViewer } from "@/components/shared/json-viewer";
import { SectionCard } from "@/components/shared/section-card";
import type {
  ApiErrorPayload,
  DemoQuoteResponse,
  DemoRequestResponse,
  DemoRequestState,
  DemoRoutesResponse,
} from "@/types/lifi";

type SdkResultPanelProps = {
  result: DemoRequestResponse | null;
  requestError: ApiErrorPayload | null;
  requestState: DemoRequestState;
};

const stateTone = {
  idle: {
    icon: Clock3,
    title: "Ready to query",
    className: "bg-white/75 text-muted",
  },
  loading: {
    icon: Clock3,
    title: "Request in flight",
    className: "bg-accent/10 text-accent-ink",
  },
  success: {
    icon: CheckCircle2,
    title: "Request succeeded",
    className: "bg-emerald-50 text-emerald-700",
  },
  error: {
    icon: AlertTriangle,
    title: "Request failed",
    className: "bg-rose-50 text-rose-700",
  },
} as const;

export function SdkResultPanel({
  result,
  requestError,
  requestState,
}: SdkResultPanelProps) {
  const tone = stateTone[requestState.stage];
  const StateIcon = tone.icon;

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Request state"
        title={tone.title}
        description={requestState.message}
      >
        <div className={`rounded-2xl border border-line p-4 ${tone.className}`}>
          <div className="flex items-center gap-3">
            <StateIcon className="h-5 w-5" />
            <p className="font-semibold">{requestState.message}</p>
          </div>
          {requestState.hint ? (
            <p className="mt-3 text-sm leading-7">{requestState.hint}</p>
          ) : null}
        </div>
      </SectionCard>

      {requestError ? (
        <SectionCard
          eyebrow="Error state"
          title={requestError.code}
          description={requestError.message}
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-700">
              <p className="font-semibold text-rose-800">Suggested next step</p>
              <p className="mt-2">{requestError.suggestion}</p>
            </div>
            {requestError.details ? (
              <JsonViewer data={requestError.details} title="Error details" />
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {result ? <ResultSummary result={result} /> : <EmptyState />}
    </div>
  );
}

function EmptyState() {
  return (
    <SectionCard
      eyebrow="Normalized output"
      title="Awaiting a LI.FI response"
      description="Submit the form to inspect the summary first and the raw JSON second."
    >
      <div className="rounded-2xl border border-dashed border-line bg-white/60 p-6 text-sm leading-7 text-muted">
        The panel stays intentionally empty until a request completes so it is
        obvious which data came from the current query.
      </div>
    </SectionCard>
  );
}

function ResultSummary({ result }: { result: DemoRequestResponse }) {
  if (result.mode === "quote") {
    return <QuoteSummary result={result} />;
  }

  return <RoutesSummary result={result} />;
}

function QuoteSummary({ result }: { result: DemoQuoteResponse }) {
  return (
    <SectionCard
      eyebrow="Best quote"
      title={result.summary.pathLabel}
      description="One recommended LI.FI answer returned through your own backend boundary."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Tool" value={result.summary.tool} icon={Sparkles} />
        <MetricCard label="Input" value={result.summary.enteredAmount} icon={Sparkles} />
        <MetricCard
          label="Estimated received"
          value={result.summary.estimatedToAmount}
          icon={Sparkles}
        />
        <MetricCard
          label="Minimum received"
          value={result.summary.minimumToAmount}
          icon={Sparkles}
        />
        <MetricCard
          label="Execution duration"
          value={result.summary.executionDuration}
          icon={Sparkles}
        />
        <MetricCard label="Gas cost" value={result.summary.gasCostUSD} icon={Sparkles} />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white/75 p-4">
        <p className="font-semibold text-foreground">Included steps</p>
        <div className="mt-4 space-y-3">
          {result.summary.includedSteps.map((step) => (
            <div
              key={step.id}
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted"
            >
              <p className="font-semibold text-foreground">
                {step.tool} · {step.type}
              </p>
              <p className="mt-2">
                Chain {step.fromChainId} {step.fromTokenSymbol} → Chain{" "}
                {step.toChainId} {step.toTokenSymbol}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <JsonViewer data={result.raw} />
      </div>
    </SectionCard>
  );
}

function RoutesSummary({ result }: { result: DemoRoutesResponse }) {
  return (
    <SectionCard
      eyebrow="Candidate routes"
      title={result.summary.pathLabel}
      description="Compare candidate plans before choosing a route."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Route count" value={`${result.summary.routeCount}`} icon={Route} />
        <MetricCard
          label="Unavailable routes"
          value={`${result.summary.unavailableRouteCount}`}
          icon={AlertTriangle}
        />
        <MetricCard label="Best tool path" value={result.summary.bestTool} icon={Route} />
        <MetricCard
          label="Best received amount"
          value={result.summary.bestToAmount}
          icon={Sparkles}
        />
      </div>

      <div className="mt-6 space-y-4">
        {result.summary.candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-3xl border border-line bg-white/80 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
                  Candidate route
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {candidate.toolPath}
                </p>
              </div>
              <div className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
                {candidate.steps.length} steps
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Estimated received" value={candidate.estimatedToAmount} />
              <MetricCard label="Minimum received" value={candidate.minimumToAmount} />
              <MetricCard label="Gas cost" value={candidate.gasCostUSD} />
              <MetricCard label="Fees" value={candidate.feeCostUSD} />
            </div>

            <div className="mt-4 space-y-3">
              {candidate.steps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-muted"
                >
                  <p className="font-semibold text-foreground">
                    {step.tool} · {step.type}
                  </p>
                  <p className="mt-2">
                    Chain {step.fromChainId} {step.fromTokenSymbol} → Chain{" "}
                    {step.toChainId} {step.toTokenSymbol}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <JsonViewer data={result.raw} />
      </div>
    </SectionCard>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/75 p-4">
      {Icon ? <Icon className="mb-3 h-4 w-4 text-accent-ink" /> : null}
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-7 text-foreground">{value}</p>
    </div>
  );
}

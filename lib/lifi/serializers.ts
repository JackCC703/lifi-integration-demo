import {
  type DemoSdkRequestPayload,
  type DemoChain,
  type DemoQuoteResponse,
  type DemoRouteCandidate,
  type DemoRouteStep,
  type DemoRoutesResponse,
  type DemoStatusResponse,
  type DemoToken,
} from "@/types/lifi";
import {
  CHAIN_LABELS,
  PREFERRED_TOKEN_BY_CHAIN,
  TOKEN_PRIORITY,
} from "@/lib/constants/demo-defaults";
import type {
  ExtendedChain,
  LiFiStep,
  Route,
  RoutesRequest,
  RoutesResponse,
  StatusResponse,
  Step,
  Token,
} from "@lifi/sdk";
import { formatUnits, parseUnits } from "viem";

export function serializeChain(chain: ExtendedChain): DemoChain {
  return {
    id: chain.id,
    key: chain.key,
    name: CHAIN_LABELS[chain.id] ?? chain.name.replace(" One", ""),
    logoURI: chain.logoURI,
    nativeTokenSymbol: chain.nativeToken.symbol,
  };
}

export function pickDemoTokens(chainId: number, tokens: Token[]): DemoToken[] {
  const deduped = new Map<string, Token>();

  for (const token of tokens) {
    const address = token.address.toLowerCase();

    if (!deduped.has(address)) {
      deduped.set(address, token);
    }
  }

  return [...deduped.values()]
    .sort((left, right) => scoreToken(chainId, right) - scoreToken(chainId, left))
    .slice(0, 12)
    .map((token) => serializeToken(chainId, token));
}

export function buildQuoteRequest(payload: DemoSdkRequestPayload) {
  return {
    fromAddress: payload.fromAddress,
    fromChain: payload.fromChain,
    toChain: payload.toChain,
    fromToken: payload.fromToken.address,
    toToken: payload.toToken.address,
    fromAmount: parseUnits(payload.amount, payload.fromToken.decimals).toString(),
  };
}

export function buildRoutesRequest(payload: DemoSdkRequestPayload): RoutesRequest {
  return {
    fromAddress: payload.fromAddress,
    fromChainId: payload.fromChain,
    toChainId: payload.toChain,
    fromTokenAddress: payload.fromToken.address,
    toTokenAddress: payload.toToken.address,
    fromAmount: parseUnits(payload.amount, payload.fromToken.decimals).toString(),
    options: {
      order: "CHEAPEST",
      slippage: 0.005,
    },
  };
}

export function serializeQuoteResponse(quote: LiFiStep): DemoQuoteResponse {
  return {
    mode: "quote",
    summary: {
      pathLabel: `${getChainName(quote.action.fromChainId)} ${quote.action.fromToken.symbol} -> ${getChainName(quote.action.toChainId)} ${quote.action.toToken.symbol}`,
      tool: quote.toolDetails.name ?? quote.tool,
      enteredAmount: formatTokenAmount(
        quote.action.fromAmount,
        quote.action.fromToken.decimals,
        quote.action.fromToken.symbol,
      ),
      estimatedToAmount: formatTokenAmount(
        quote.estimate?.toAmount,
        quote.action.toToken.decimals,
        quote.action.toToken.symbol,
      ),
      minimumToAmount: formatTokenAmount(
        quote.estimate?.toAmountMin,
        quote.action.toToken.decimals,
        quote.action.toToken.symbol,
      ),
      executionDuration: formatDuration(quote.estimate?.executionDuration),
      gasCostUSD: formatUsd(sumUsd(quote.estimate?.gasCosts)),
      feeCostUSD: formatUsd(sumUsd(quote.estimate?.feeCosts)),
      approvalAddress: quote.estimate?.approvalAddress ?? null,
      includedSteps: quote.includedSteps.map(serializeStep),
    },
    raw: quote,
  };
}

export function serializeRoutesResponse(routes: RoutesResponse): DemoRoutesResponse {
  const bestRoute = routes.routes[0];

  return {
    mode: "routes",
    summary: {
      pathLabel: bestRoute
        ? `${getChainName(bestRoute.fromChainId)} ${bestRoute.fromToken.symbol} -> ${getChainName(bestRoute.toChainId)} ${bestRoute.toToken.symbol}`
        : "No route available",
      routeCount: routes.routes.length,
      unavailableRouteCount:
        routes.unavailableRoutes.failed.length +
        routes.unavailableRoutes.filteredOut.length,
      bestTool: bestRoute
        ? bestRoute.steps.map((step) => step.toolDetails.name ?? step.tool).join(" -> ")
        : "—",
      bestToAmount: bestRoute
        ? formatTokenAmount(
            bestRoute.toAmount,
            bestRoute.toToken.decimals,
            bestRoute.toToken.symbol,
          )
        : "—",
      candidates: routes.routes.slice(0, 3).map(serializeRoute),
    },
    raw: routes,
  };
}

export function serializeStatusResponse(status: StatusResponse): DemoStatusResponse {
  const receiving =
    "receiving" in status && status.receiving ? status.receiving : undefined;
  const receivingTransaction =
    receiving && hasTransactionShape(receiving) ? receiving : undefined;

  return {
    summary: {
      status: status.status,
      substatus: status.substatus ?? null,
      substatusMessage: status.substatusMessage ?? null,
      tool: "tool" in status ? status.tool : null,
      sendingChainId: status.sending.chainId,
      sendingTxHash: status.sending.txHash,
      sendingTxLink: status.sending.txLink,
      receivingChainId: receiving?.chainId ?? null,
      receivingTxHash: receivingTransaction?.txHash ?? null,
      receivingTxLink: receivingTransaction?.txLink ?? null,
      lifiExplorerLink:
        "lifiExplorerLink" in status ? status.lifiExplorerLink : null,
      bridgeExplorerLink:
        "bridgeExplorerLink" in status ? status.bridgeExplorerLink ?? null : null,
      note: getStatusNote(status),
    },
    raw: status,
  };
}

function serializeToken(chainId: number, token: Token): DemoToken {
  return {
    chainId,
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    logoURI: token.logoURI,
    priceUSD: token.priceUSD,
    recommended:
      token.address.toLowerCase() ===
        (PREFERRED_TOKEN_BY_CHAIN[chainId] ?? "").toLowerCase() ||
      TOKEN_PRIORITY.includes(token.symbol as (typeof TOKEN_PRIORITY)[number]),
  };
}

function serializeStep(step: Step | LiFiStep): DemoRouteStep {
  return {
    id: step.id,
    type: step.type,
    tool: step.toolDetails.name ?? step.tool,
    fromChainId: step.action.fromChainId,
    toChainId: step.action.toChainId,
    fromTokenSymbol: step.action.fromToken.symbol,
    toTokenSymbol: step.action.toToken.symbol,
  };
}

function serializeRoute(route: Route): DemoRouteCandidate {
  return {
    id: route.id,
    toolPath: route.steps.map((step) => step.toolDetails.name ?? step.tool).join(" -> "),
    estimatedToAmount: formatTokenAmount(
      route.toAmount,
      route.toToken.decimals,
      route.toToken.symbol,
    ),
    minimumToAmount: formatTokenAmount(
      route.toAmountMin,
      route.toToken.decimals,
      route.toToken.symbol,
    ),
    gasCostUSD: formatUsd(route.gasCostUSD),
    feeCostUSD: formatUsd(sumFeeUsd(route)),
    steps: route.steps.map(serializeStep),
  };
}

function scoreToken(chainId: number, token: Token) {
  let score = 0;
  const symbolRank = TOKEN_PRIORITY.indexOf(
    token.symbol as (typeof TOKEN_PRIORITY)[number],
  );

  if (symbolRank >= 0) {
    score += 100 - symbolRank * 5;
  }

  if (
    token.address.toLowerCase() ===
    (PREFERRED_TOKEN_BY_CHAIN[chainId] ?? "").toLowerCase()
  ) {
    score += 120;
  }

  const price = Number(token.priceUSD);

  if (Number.isFinite(price)) {
    score += Math.min(price, 20);
  }

  return score;
}

function formatTokenAmount(
  amount: string | undefined,
  decimals: number,
  symbol: string,
) {
  if (!amount) {
    return "—";
  }

  return `${trimDecimals(formatUnits(BigInt(amount), decimals))} ${symbol}`;
}

function formatUsd(value: number | string | undefined | null) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: numeric >= 100 ? 0 : 2,
  }).format(numeric);
}

function formatDuration(seconds: number | undefined) {
  if (!seconds) {
    return "—";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.round(seconds / 60);
  return `${minutes}m`;
}

function trimDecimals(value: string, precision = 6) {
  const [integer, decimal] = value.split(".");

  if (!decimal) {
    return integer;
  }

  const trimmed = decimal.slice(0, precision).replace(/0+$/, "");

  return trimmed ? `${integer}.${trimmed}` : integer;
}

function sumUsd(items: { amountUSD: string }[] | undefined) {
  return items?.reduce((total, item) => total + Number(item.amountUSD || 0), 0) ?? 0;
}

function sumFeeUsd(route: Route) {
  return route.steps.reduce((total, step) => {
    return total + (sumUsd(step.estimate?.feeCosts) || 0);
  }, 0);
}

function getChainName(chainId: number) {
  return CHAIN_LABELS[chainId] ?? `Chain ${chainId}`;
}

function getStatusNote(status: StatusResponse) {
  if (status.status === "PENDING") {
    return "The transfer is still being indexed or waiting on destination settlement. Retry in 15-30 seconds if you need an updated state.";
  }

  if (status.status === "NOT_FOUND") {
    return "The transaction was not found yet. It may still be pending indexing, or the bridge key may be missing for a cross-chain transfer.";
  }

  if (status.status === "FAILED") {
    return "LI.FI found the transaction but the transfer did not complete successfully. Inspect the bridge and explorer links for the exact failure reason.";
  }

  return "Status lookup completed. Use the explorer links to inspect both source and destination transactions.";
}

function hasTransactionShape(value: object): value is {
  txHash: string;
  txLink: string;
} {
  return (
    "txHash" in value &&
    typeof value.txHash === "string" &&
    "txLink" in value &&
    typeof value.txLink === "string"
  );
}

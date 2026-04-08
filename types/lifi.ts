export type DemoChain = {
  id: number;
  key: string;
  name: string;
  logoURI?: string;
  nativeTokenSymbol: string;
};

export type DemoToken = {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: string;
  recommended?: boolean;
};

export type QuoteMode = "quote" | "routes";

export type DemoSdkRequestPayload = {
  fromChain: number;
  toChain: number;
  fromToken: DemoToken;
  toToken: DemoToken;
  amount: string;
  fromAddress: string;
};

export type DemoStatusQuery = {
  txHash: string;
  fromChain?: number;
  toChain?: number;
  bridge?: string;
};

export type ApiErrorPayload = {
  stage: "validation" | "upstream" | "result";
  code: string;
  message: string;
  suggestion: string;
  details?: Record<string, unknown>;
};

export type DemoRequestState = {
  stage: "idle" | "loading" | "success" | "error";
  message: string;
  hint?: string;
};

export type DemoRouteStep = {
  id: string;
  type: string;
  tool: string;
  fromChainId: number;
  toChainId: number;
  fromTokenSymbol: string;
  toTokenSymbol: string;
};

export type DemoRouteCandidate = {
  id: string;
  toolPath: string;
  estimatedToAmount: string;
  minimumToAmount: string;
  gasCostUSD: string;
  feeCostUSD: string;
  steps: DemoRouteStep[];
};

export type DemoQuoteResponse = {
  mode: "quote";
  summary: {
    pathLabel: string;
    tool: string;
    enteredAmount: string;
    estimatedToAmount: string;
    minimumToAmount: string;
    executionDuration: string;
    gasCostUSD: string;
    feeCostUSD: string;
    approvalAddress: string | null;
    includedSteps: DemoRouteStep[];
  };
  raw: unknown;
};

export type DemoRoutesResponse = {
  mode: "routes";
  summary: {
    pathLabel: string;
    routeCount: number;
    unavailableRouteCount: number;
    bestTool: string;
    bestToAmount: string;
    candidates: DemoRouteCandidate[];
  };
  raw: unknown;
};

export type DemoStatusResponse = {
  summary: {
    status: string;
    substatus: string | null;
    substatusMessage: string | null;
    tool: string | null;
    sendingChainId: number;
    sendingTxHash: string;
    sendingTxLink: string;
    receivingChainId: number | null;
    receivingTxHash: string | null;
    receivingTxLink: string | null;
    lifiExplorerLink: string | null;
    bridgeExplorerLink: string | null;
    note: string;
  };
  raw: unknown;
};

export type DemoRequestResponse = DemoQuoteResponse | DemoRoutesResponse;

export type ChainsResponsePayload = {
  chains: DemoChain[];
};

export type TokensResponsePayload = {
  chainId: number;
  tokens: DemoToken[];
};

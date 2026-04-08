import type {
  ApiErrorPayload,
  ChainsResponsePayload,
  DemoRequestResponse,
  DemoSdkRequestPayload,
  DemoStatusQuery,
  DemoStatusResponse,
  TokensResponsePayload,
} from "@/types/lifi";

class LiFiApiError extends Error {
  constructor(public payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "LiFiApiError";
  }
}

export async function fetchChains() {
  return parseResponse<ChainsResponsePayload>(
    await fetch("/api/lifi/chains", {
      cache: "no-store",
    }),
  );
}

export async function fetchTokens(chainId: number) {
  return parseResponse<TokensResponsePayload>(
    await fetch(`/api/lifi/tokens?chain=${chainId}`, {
      cache: "no-store",
    }),
  );
}

export async function requestQuote(payload: DemoSdkRequestPayload) {
  return parseResponse<DemoRequestResponse>(
    await fetch("/api/lifi/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export async function requestRoutes(payload: DemoSdkRequestPayload) {
  return parseResponse<DemoRequestResponse>(
    await fetch("/api/lifi/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export async function requestStatus(payload: DemoStatusQuery) {
  const searchParams = new URLSearchParams({
    txHash: payload.txHash,
  });

  if (payload.fromChain) {
    searchParams.set("fromChain", String(payload.fromChain));
  }

  if (payload.toChain) {
    searchParams.set("toChain", String(payload.toChain));
  }

  if (payload.bridge) {
    searchParams.set("bridge", payload.bridge);
  }

  return parseResponse<DemoStatusResponse>(
    await fetch(`/api/lifi/status?${searchParams.toString()}`, {
      cache: "no-store",
    }),
  );
}

export function toClientError(error: unknown): ApiErrorPayload {
  if (error instanceof LiFiApiError) {
    return error.payload;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "stage" in error &&
    "code" in error &&
    "message" in error &&
    "suggestion" in error
  ) {
    return error as ApiErrorPayload;
  }

  if (error instanceof Error) {
    return {
      stage: "upstream",
      code: error.name || "UNKNOWN_ERROR",
      message: error.message,
      suggestion: "Retry the request. If the issue persists, inspect the route handlers or LI.FI response shape.",
    };
  }

  return {
    stage: "upstream",
    code: "UNKNOWN_ERROR",
    message: "Unexpected error.",
    suggestion: "Retry the request and inspect the network response if it happens again.",
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new LiFiApiError(
      payload?.error ?? {
        stage: "upstream",
        code: "HTTP_ERROR",
        message: `Request failed with status ${response.status}.`,
        suggestion: "Retry the request and inspect the backend logs if it keeps failing.",
      },
    );
  }

  return payload as T;
}

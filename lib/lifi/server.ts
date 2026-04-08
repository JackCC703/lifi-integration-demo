import "server-only";

import { createConfig } from "@lifi/sdk";
import { ZodError } from "zod";
import { lifiConfig } from "@/lib/lifi/config";
import type { ApiErrorPayload } from "@/types/lifi";

let configured = false;

const memoryCache = new Map<string, { expiresAt: number; value: unknown }>();

export function ensureLiFiConfig() {
  if (configured) {
    return;
  }

  createConfig({
    integrator: lifiConfig.integrator,
    apiKey: lifiConfig.apiKey,
    preloadChains: false,
    routeOptions: {
      order: "CHEAPEST",
      slippage: 0.005,
    },
  });

  configured = true;
}

export async function withMemoryCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
) {
  const cached = memoryCache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const value = await loader();

  memoryCache.set(key, {
    expiresAt: Date.now() + ttlMs,
    value,
  });

  return value;
}

export function toApiError(
  error: unknown,
  stage: ApiErrorPayload["stage"],
): ApiErrorPayload {
  if (error instanceof ZodError) {
    return {
      stage: "validation",
      code: "INVALID_REQUEST",
      message: error.issues[0]?.message ?? "Invalid request payload.",
      suggestion:
        "Check the input fields and try again. The request did not pass local validation.",
      details: {
        name: error.name,
        issues: error.issues,
      },
    };
  }

  let message = getErrorMessage(error);
  const lowered = message.toLowerCase();

  let resolvedStage = stage;
  let code = getErrorCode(error);
  let suggestion =
    "Retry the request. If the issue persists, inspect the LI.FI response and server logs.";

  if (
    lowered.includes("required parameter") ||
    lowered.includes("invalid wallet") ||
    lowered.includes("wallet address") ||
    lowered.includes("must be") ||
    lowered.includes("amount")
  ) {
    resolvedStage = "validation";
    code = "INVALID_REQUEST";
    suggestion =
      "Check chains, tokens, amount formatting, and the wallet address before retrying.";
  }

  if (lowered.includes("no route")) {
    resolvedStage = "result";
    code = "NO_ROUTE";
    suggestion =
      "Try the fallback path or relax constraints such as chain and token choices.";
  }

  if (lowered.includes("bridge") && lowered.includes("required")) {
    resolvedStage = "validation";
    code = "MISSING_BRIDGE";
    suggestion =
      "Add the bridge key for cross-chain status queries if LI.FI cannot infer it.";
  }

  if (lowered.includes("rate") || lowered.includes("429")) {
    resolvedStage = "upstream";
    code = "RATE_LIMITED";
    suggestion =
      "Retry after a short pause. If this happens often, add a server-side API key to increase rate limits.";
  }

  if (lowered.includes("not found")) {
    code = "NOT_FOUND";
    suggestion =
      "The transaction may still be indexing. Retry in 15-30 seconds or add chain and bridge filters.";
  }

  if (lowered.includes("not an evm transaction")) {
    resolvedStage = "validation";
    code = "INVALID_TX_HASH";
    message = "LI.FI rejected the hash because it is not a valid EVM transaction.";
    suggestion =
      "Use a real EVM transaction hash from the source chain. Random hashes and non-EVM hashes will not resolve.";
  }

  return {
    stage: resolvedStage,
    code,
    message,
    suggestion,
    details: getErrorDetails(error),
  };
}

export function getHttpStatusForError(error: ApiErrorPayload) {
  if (error.stage === "validation") {
    return 400;
  }

  if (error.code === "NO_ROUTE" || error.code === "NOT_FOUND") {
    return 404;
  }

  if (error.code === "RATE_LIMITED") {
    return 429;
  }

  return 500;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unexpected LI.FI error.";
}

function getErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code !== "undefined"
  ) {
    return String(error.code);
  }

  if (error instanceof Error && error.name) {
    return error.name;
  }

  return "LIFI_ERROR";
}

function getErrorDetails(error: unknown) {
  if (!(typeof error === "object" && error !== null)) {
    return undefined;
  }

  const details: Record<string, unknown> = {};

  if ("name" in error && typeof error.name === "string") {
    details.name = error.name;
  }

  if ("message" in error && typeof error.message === "string") {
    details.message = error.message;
  }

  if ("code" in error && typeof error.code !== "undefined") {
    details.code = String(error.code);
  }

  if ("status" in error && typeof error.status !== "undefined") {
    details.status = String(error.status);
  }

  return Object.keys(details).length ? details : undefined;
}

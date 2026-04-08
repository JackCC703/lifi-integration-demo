import { ChainType, getTokens } from "@lifi/sdk";
import { NextResponse } from "next/server";
import { pickDemoTokens } from "@/lib/lifi/serializers";
import {
  ensureLiFiConfig,
  getHttpStatusForError,
  toApiError,
  withMemoryCache,
} from "@/lib/lifi/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chainId = Number(searchParams.get("chain"));

  if (!Number.isFinite(chainId) || chainId <= 0) {
    const error = toApiError(
      new Error('Query parameter "chain" must be a valid positive number.'),
      "validation",
    );

    return NextResponse.json(
      { error },
      { status: getHttpStatusForError(error) },
    );
  }

  try {
    ensureLiFiConfig();

    const tokens = await withMemoryCache(
      `tokens:${chainId}`,
      1000 * 60 * 30,
      async () => {
        const data = await getTokens({
          chains: [chainId],
          chainTypes: [ChainType.EVM],
        });

        return pickDemoTokens(chainId, data.tokens[chainId] ?? []);
      },
    );

    return NextResponse.json({
      chainId,
      tokens,
    });
  } catch (error) {
    const apiError = toApiError(error, "upstream");

    return NextResponse.json(
      { error: apiError },
      { status: getHttpStatusForError(apiError) },
    );
  }
}

import { ChainType, getChains } from "@lifi/sdk";
import { NextResponse } from "next/server";
import { SUPPORTED_CHAIN_IDS } from "@/lib/constants/demo-defaults";
import { serializeChain } from "@/lib/lifi/serializers";
import {
  ensureLiFiConfig,
  getHttpStatusForError,
  toApiError,
  withMemoryCache,
} from "@/lib/lifi/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    ensureLiFiConfig();

    const chains = await withMemoryCache("chains", 1000 * 60 * 30, async () => {
      const data = await getChains({ chainTypes: [ChainType.EVM] });

      return data
        .filter((chain) => SUPPORTED_CHAIN_IDS.includes(chain.id as (typeof SUPPORTED_CHAIN_IDS)[number]))
        .sort(
          (left, right) =>
            SUPPORTED_CHAIN_IDS.indexOf(left.id as (typeof SUPPORTED_CHAIN_IDS)[number]) -
            SUPPORTED_CHAIN_IDS.indexOf(right.id as (typeof SUPPORTED_CHAIN_IDS)[number]),
        )
        .map(serializeChain);
    });

    return NextResponse.json({ chains });
  } catch (error) {
    const apiError = toApiError(error, "upstream");

    return NextResponse.json(
      { error: apiError },
      { status: getHttpStatusForError(apiError) },
    );
  }
}

import { getStatus } from "@lifi/sdk";
import { NextResponse } from "next/server";
import { serializeStatusResponse } from "@/lib/lifi/serializers";
import {
  ensureLiFiConfig,
  getHttpStatusForError,
  toApiError,
} from "@/lib/lifi/server";
import { statusQuerySchema } from "@/lib/lifi/validators";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    ensureLiFiConfig();

    const { searchParams } = new URL(request.url);
    const payload = statusQuerySchema.parse({
      txHash: searchParams.get("txHash"),
      fromChain: searchParams.get("fromChain")
        ? Number(searchParams.get("fromChain"))
        : undefined,
      toChain: searchParams.get("toChain")
        ? Number(searchParams.get("toChain"))
        : undefined,
      bridge: searchParams.get("bridge") || undefined,
    });

    const status = await getStatus(payload);

    return NextResponse.json(serializeStatusResponse(status));
  } catch (error) {
    const apiError = toApiError(error, "result");

    return NextResponse.json(
      { error: apiError },
      { status: getHttpStatusForError(apiError) },
    );
  }
}

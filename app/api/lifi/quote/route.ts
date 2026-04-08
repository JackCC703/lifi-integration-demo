import { getQuote } from "@lifi/sdk";
import { NextResponse } from "next/server";
import {
  buildQuoteRequest,
  serializeQuoteResponse,
} from "@/lib/lifi/serializers";
import {
  ensureLiFiConfig,
  getHttpStatusForError,
  toApiError,
} from "@/lib/lifi/server";
import { sdkRequestSchema } from "@/lib/lifi/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    ensureLiFiConfig();

    const payload = sdkRequestSchema.parse(await request.json());
    const quote = await getQuote(buildQuoteRequest(payload));

    return NextResponse.json(serializeQuoteResponse(quote));
  } catch (error) {
    const apiError = toApiError(
      error,
      error instanceof Error && error.message.includes("route")
        ? "result"
        : "upstream",
    );

    return NextResponse.json(
      { error: apiError },
      { status: getHttpStatusForError(apiError) },
    );
  }
}

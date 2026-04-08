import { getRoutes } from "@lifi/sdk";
import { NextResponse } from "next/server";
import { buildRoutesRequest, serializeRoutesResponse } from "@/lib/lifi/serializers";
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
    const routes = await getRoutes(buildRoutesRequest(payload));

    if (!routes.routes.length) {
      const error = toApiError(
        new Error(
          "No route found for the selected token pair. Try the fallback path or reduce constraints.",
        ),
        "result",
      );

      return NextResponse.json(
        { error },
        { status: getHttpStatusForError(error) },
      );
    }

    return NextResponse.json(serializeRoutesResponse(routes));
  } catch (error) {
    const apiError = toApiError(error, "upstream");

    return NextResponse.json(
      { error: apiError },
      { status: getHttpStatusForError(apiError) },
    );
  }
}

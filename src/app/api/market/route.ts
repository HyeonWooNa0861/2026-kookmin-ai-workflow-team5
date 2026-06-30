import { NextResponse } from "next/server";
import { getMarketPayload } from "@/lib/marketService";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getMarketPayload();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

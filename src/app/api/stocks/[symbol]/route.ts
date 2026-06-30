import { NextResponse } from "next/server";
import { getStockPayload } from "@/lib/marketService";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { symbol } = await params;
  const payload = await getStockPayload(symbol);

  if (!payload) {
    return NextResponse.json({ message: "Stock not found" }, { status: 404 });
  }

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
    }
  });
}

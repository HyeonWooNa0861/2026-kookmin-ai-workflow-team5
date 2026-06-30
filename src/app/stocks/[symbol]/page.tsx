import { notFound } from "next/navigation";
import { StockDetailClient } from "@/components/StockDetailClient";
import type { StockPayload } from "@/lib/marketService";
import { getStockBySymbol, stocks } from "@/lib/mockData";

type StockPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export function generateStaticParams() {
  return stocks.map((stock) => ({
    symbol: stock.symbol
  }));
}

export async function generateMetadata({ params }: StockPageProps) {
  const { symbol } = await params;
  const stock = getStockBySymbol(symbol);

  if (!stock) {
    return {
      title: "종목 없음 - AWS Charting"
    };
  }

  return {
    title: `${stock.name} 위험 분석 - AWS Charting`,
    description: `${stock.name}의 차트, SML, PER, RSI와 비체계적 위험 뉴스`
  };
}

export default async function StockDetailPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const stock = getStockBySymbol(symbol);

  if (!stock) {
    notFound();
  }

  const initialData: StockPayload = {
    stock,
    source: "mock",
    updatedAt: new Date().toISOString(),
    message: "API 조회 전 초기 mock data입니다."
  };

  return (
    <main className="page">
      <div className="shell">
        <StockDetailClient initialData={initialData} />
      </div>
    </main>
  );
}

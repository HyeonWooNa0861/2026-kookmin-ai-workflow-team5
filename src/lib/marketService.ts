import { hydrateStockWithAlphaVantage } from "./alphaVantageClient";
import { fetchSystematicNews, fetchUnsystematicNews } from "./news";
import {
  getStockBySymbol,
  marketIndex,
  stocks,
  systematicNews,
  type Stock
} from "./mockData";

export type DataSource = "mock" | "live" | "mixed";

export type MarketPayload = {
  marketIndex: typeof marketIndex;
  systematicNews: typeof systematicNews;
  stocks: Stock[];
  source: DataSource;
  updatedAt: string;
  message: string;
};

export type StockPayload = {
  stock: Stock;
  source: DataSource;
  updatedAt: string;
  message: string;
};

function getTimestamp() {
  return new Date().toISOString();
}

function resolveSource(liveStocks: Stock[]) {
  const changedCount = liveStocks.filter((stock, index) => {
    const fallback = stocks[index];

    return (
      stock.currentPrice !== fallback.currentPrice ||
      stock.chart.at(-1)?.close !== fallback.chart.at(-1)?.close
    );
  }).length;

  if (changedCount === stocks.length) {
    return "live";
  }

  if (changedCount > 0) {
    return "mixed";
  }

  return "mock";
}

function messageFromSource(source: DataSource) {
  if (source === "live") {
    return "Alpha Vantage/Google News RSS에서 주기적으로 조회한 발표용 데이터입니다.";
  }

  if (source === "mixed") {
    return "일부 항목은 API 조회값이고, 실패한 항목은 mock data로 보완했습니다.";
  }

  return "API 키가 없거나 조회에 실패해 mock data로 표시 중입니다.";
}

export async function getMarketPayload(): Promise<MarketPayload> {
  const liveStocks = await Promise.all(
    stocks.map((stock) => hydrateStockWithAlphaVantage(stock))
  );
  const source = resolveSource(liveStocks);
  const liveSystematicNews = await fetchSystematicNews(
    "S&P 500 interest rates dollar AI semiconductor",
    "sys-live"
  ).catch(() => systematicNews);

  return {
    marketIndex: {
      ...marketIndex,
      updatedAt: new Date().toLocaleString("ko-KR")
    },
    systematicNews: liveSystematicNews,
    stocks: liveStocks,
    source,
    updatedAt: getTimestamp(),
    message: messageFromSource(source)
  };
}

export async function getStockPayload(symbol: string): Promise<StockPayload | null> {
  const fallbackStock = getStockBySymbol(symbol);

  if (!fallbackStock) {
    return null;
  }

  const liveStock = await hydrateStockWithAlphaVantage(fallbackStock);
  const stockNews = await fetchUnsystematicNews(
    fallbackStock.name,
    fallbackStock.symbol
  ).catch(() => fallbackStock.news);
  const isLive =
    liveStock.currentPrice !== fallbackStock.currentPrice ||
    liveStock.chart.at(-1)?.close !== fallbackStock.chart.at(-1)?.close;
  const source: DataSource = isLive ? "mixed" : "mock";

  return {
    stock: {
      ...liveStock,
      news: stockNews
    },
    source,
    updatedAt: getTimestamp(),
    message: messageFromSource(source)
  };
}

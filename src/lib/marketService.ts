import {
  hydrateStockWithAlphaVantage,
  shouldRequestAlphaVantage
} from "./alphaVantageClient";
import { hydrateMarketIndexWithFred } from "./fredClient";
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

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function hydrateStocksSequentially() {
  const hydratedStocks: Stock[] = [];
  let hasMadeAlphaVantageRequest = false;

  for (const [index, stock] of stocks.entries()) {
    const willRequestAlphaVantage = shouldRequestAlphaVantage(stock.symbol);

    if (willRequestAlphaVantage && hasMadeAlphaVantageRequest) {
      await wait(1200);
    }

    hydratedStocks.push(await hydrateStockWithAlphaVantage(stock));

    if (willRequestAlphaVantage) {
      hasMadeAlphaVantageRequest = true;
    }
  }

  return hydratedStocks;
}

function resolveSourceWithIndex(liveStocks: Stock[], liveMarketIndex: typeof marketIndex) {
  const liveStockCount = liveStocks.filter((stock, index) => {
    const fallback = stocks[index];

    return (
      stock.currentPrice !== fallback.currentPrice ||
      stock.chart.at(-1)?.close !== fallback.chart.at(-1)?.close
    );
  }).length;
  const hasLiveIndex =
    liveMarketIndex.code !== marketIndex.code ||
    liveMarketIndex.currentValue !== marketIndex.currentValue ||
    liveMarketIndex.chart.at(-1)?.value !== marketIndex.chart.at(-1)?.value;
  const changedCount = liveStockCount + (hasLiveIndex ? 1 : 0);
  const totalCount = stocks.length + 1;

  if (changedCount === totalCount) {
    return "live";
  }

  if (changedCount > 0) {
    return "mixed";
  }

  return "mock";
}

function messageFromSource(source: DataSource) {
  if (source === "live") {
    return "FRED/Alpha Vantage/Google News RSS에서 주기적으로 조회한 발표용 데이터입니다.";
  }

  if (source === "mixed") {
    return "일부 항목은 API/RSS 조회값이고, 실패한 항목은 mock data로 보완했습니다.";
  }

  return "API 키가 없거나 조회에 실패해 mock data로 표시 중입니다.";
}

export async function getMarketPayload(): Promise<MarketPayload> {
  const [liveMarketIndex, liveStocks] = await Promise.all([
    hydrateMarketIndexWithFred(),
    hydrateStocksSequentially()
  ]);
  const source = resolveSourceWithIndex(liveStocks, liveMarketIndex);
  const liveSystematicNews = await fetchSystematicNews(
    "S&P 500 interest rates dollar AI semiconductor",
    "sys-live"
  ).catch(() => systematicNews);

  return {
    marketIndex: liveMarketIndex,
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
  const source: DataSource = isLive ? "live" : "mock";

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

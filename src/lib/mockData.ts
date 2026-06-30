export type Sentiment = "positive" | "negative" | "neutral";

export type CandlePoint = {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  sentiment: Sentiment;
  impact: "호재" | "악재" | "중립";
  summary: string;
  url: string;
};

export type StockMetricSet = {
  sml: {
    beta: number;
    expectedReturn: number;
    marketReturn: number;
    riskFreeRate: number;
    alpha: number;
  };
  per: {
    value: number;
    sectorAverage: number;
  };
  rsi: {
    value: number;
  };
};

export type Stock = {
  symbol: string;
  name: string;
  market: "NASDAQ" | "NYSE";
  sector: string;
  currentPrice: number;
  priceChangePercent: number;
  riskScore: number;
  volatility: number;
  chart: CandlePoint[];
  metrics: StockMetricSet;
  highlights: {
    positive: string;
    negative: string;
  };
  news: NewsItem[];
};

type ClosePoint = {
  label: string;
  close: number;
};

function createCandles(points: ClosePoint[], spread: number): CandlePoint[] {
  return points.map((point, index) => {
    const previousClose =
      points[index - 1]?.close ?? Number((point.close - spread * 0.4).toFixed(2));
    const open = previousClose;
    const high = Number((Math.max(open, point.close) + spread).toFixed(2));
    const low = Number((Math.min(open, point.close) - spread).toFixed(2));

    return {
      label: point.label,
      open,
      high,
      low,
      close: point.close
    };
  });
}

export const marketIndex = {
  code: "S&P 500",
  name: "S&P 500",
  currentValue: 5487.03,
  changePercent: 0.42,
  updatedAt: "2026-06-30 09:30",
  summary:
    "AI 인프라 투자와 금리 인하 기대가 대형 기술주 중심의 투자심리를 지지한 데모 데이터입니다.",
  chart: createCandles(
    [
      { label: "6/17", close: 5412.8 },
      { label: "6/18", close: 5398.4 },
      { label: "6/19", close: 5421.2 },
      { label: "6/20", close: 5448.6 },
      { label: "6/23", close: 5460.1 },
      { label: "6/24", close: 5442.7 },
      { label: "6/25", close: 5471.3 },
      { label: "6/26", close: 5480.8 },
      { label: "6/27", close: 5469.5 },
      { label: "6/30", close: 5487.03 }
    ],
    14
  )
};

export const systematicNews: NewsItem[] = [
  {
    id: "sys-1",
    title: "미국 장기금리 안정 기대가 성장주 부담을 낮춤",
    source: "Mock Macro Brief",
    date: "2026-06-30",
    sentiment: "positive",
    impact: "호재",
    summary:
      "금리가 급등하지 않는 환경은 미래 이익 비중이 큰 기술주 밸류에이션에 우호적입니다.",
    url: "https://example.com/mock-news/us-rates-growth"
  },
  {
    id: "sys-2",
    title: "달러 강세는 해외 매출 비중이 큰 기업의 환산 이익 부담",
    source: "Mock FX Desk",
    date: "2026-06-30",
    sentiment: "negative",
    impact: "악재",
    summary:
      "미국 대형주는 해외 매출 비중이 높아 달러 강세가 실적 환산에 부담으로 작용할 수 있습니다.",
    url: "https://example.com/mock-news/us-dollar-risk"
  },
  {
    id: "sys-3",
    title: "AI 인프라 투자 확대로 반도체와 클라우드 수요 기대 지속",
    source: "Mock Tech Watch",
    date: "2026-06-29",
    sentiment: "positive",
    impact: "호재",
    summary:
      "데이터센터 투자 증가는 반도체, 클라우드, 소프트웨어 기업에 공통 호재로 분류됩니다.",
    url: "https://example.com/mock-news/ai-infra-demand"
  }
];

export const stocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    market: "NASDAQ",
    sector: "Consumer Electronics",
    currentPrice: 214.1,
    priceChangePercent: 0.62,
    riskScore: 42,
    volatility: 19,
    chart: createCandles(
      [
        { label: "6/17", close: 207.4 },
        { label: "6/18", close: 208.6 },
        { label: "6/19", close: 207.9 },
        { label: "6/20", close: 210.1 },
        { label: "6/23", close: 211.8 },
        { label: "6/24", close: 210.7 },
        { label: "6/25", close: 212.9 },
        { label: "6/26", close: 213.4 },
        { label: "6/27", close: 212.8 },
        { label: "6/30", close: 214.1 }
      ],
      1.8
    ),
    metrics: {
      sml: {
        beta: 1.12,
        expectedReturn: 9.1,
        marketReturn: 7.8,
        riskFreeRate: 4.3,
        alpha: 0.2
      },
      per: {
        value: 29.4,
        sectorAverage: 31.2
      },
      rsi: {
        value: 57
      }
    },
    highlights: {
      positive: "서비스 매출과 자사주 매입",
      negative: "하드웨어 교체 수요 둔화"
    },
    news: [
      {
        id: "AAPL-1",
        title: "서비스 매출 비중 확대가 이익 안정성 기대를 높임",
        source: "Mock US Equity Brief",
        date: "2026-06-30",
        sentiment: "positive",
        impact: "호재",
        summary:
          "구독과 앱스토어 매출이 늘면 하드웨어 경기 변동의 영향을 일부 줄일 수 있습니다.",
        url: "https://example.com/mock-news/apple-services"
      },
      {
        id: "AAPL-2",
        title: "스마트폰 교체 주기 장기화는 단기 성장 부담",
        source: "Mock Device Tracker",
        date: "2026-06-29",
        sentiment: "negative",
        impact: "악재",
        summary:
          "신제품 수요가 예상보다 약하면 매출 성장률과 밸류에이션 부담을 함께 확인해야 합니다.",
        url: "https://example.com/mock-news/apple-device-demand"
      }
    ]
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    market: "NASDAQ",
    sector: "Cloud Software",
    currentPrice: 452.3,
    priceChangePercent: 0.38,
    riskScore: 39,
    volatility: 17,
    chart: createCandles(
      [
        { label: "6/17", close: 441.8 },
        { label: "6/18", close: 444.1 },
        { label: "6/19", close: 443.6 },
        { label: "6/20", close: 446.9 },
        { label: "6/23", close: 449.5 },
        { label: "6/24", close: 448.2 },
        { label: "6/25", close: 450.8 },
        { label: "6/26", close: 453.1 },
        { label: "6/27", close: 450.6 },
        { label: "6/30", close: 452.3 }
      ],
      3.6
    ),
    metrics: {
      sml: {
        beta: 0.96,
        expectedReturn: 8.1,
        marketReturn: 7.8,
        riskFreeRate: 4.3,
        alpha: 0.5
      },
      per: {
        value: 34.8,
        sectorAverage: 36.4
      },
      rsi: {
        value: 61
      }
    },
    highlights: {
      positive: "클라우드와 AI 소프트웨어 수요",
      negative: "높은 기대치에 따른 실적 민감도"
    },
    news: [
      {
        id: "MSFT-1",
        title: "클라우드 AI 수요가 장기 성장 기대를 지지",
        source: "Mock Cloud Note",
        date: "2026-06-30",
        sentiment: "positive",
        impact: "호재",
        summary:
          "기업용 클라우드와 AI 기능 판매가 함께 늘면 반복 매출 기반이 강화됩니다.",
        url: "https://example.com/mock-news/microsoft-cloud-ai"
      },
      {
        id: "MSFT-2",
        title: "AI 인프라 투자 비용 증가는 마진 확인 요인",
        source: "Mock Margin Watch",
        date: "2026-06-28",
        sentiment: "negative",
        impact: "악재",
        summary:
          "데이터센터 투자가 빨라질수록 매출 성장과 비용 증가의 균형을 확인해야 합니다.",
        url: "https://example.com/mock-news/microsoft-ai-capex"
      }
    ]
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    market: "NASDAQ",
    sector: "Semiconductors",
    currentPrice: 126.7,
    priceChangePercent: 1.46,
    riskScore: 61,
    volatility: 32,
    chart: createCandles(
      [
        { label: "6/17", close: 119.8 },
        { label: "6/18", close: 121.6 },
        { label: "6/19", close: 120.9 },
        { label: "6/20", close: 123.2 },
        { label: "6/23", close: 125.9 },
        { label: "6/24", close: 124.1 },
        { label: "6/25", close: 127.4 },
        { label: "6/26", close: 128.2 },
        { label: "6/27", close: 124.9 },
        { label: "6/30", close: 126.7 }
      ],
      2.4
    ),
    metrics: {
      sml: {
        beta: 1.72,
        expectedReturn: 12.4,
        marketReturn: 7.8,
        riskFreeRate: 4.3,
        alpha: 0.7
      },
      per: {
        value: 42.5,
        sectorAverage: 35.7
      },
      rsi: {
        value: 66
      }
    },
    highlights: {
      positive: "AI 가속기 수요와 데이터센터 성장",
      negative: "높은 변동성과 밸류에이션 부담"
    },
    news: [
      {
        id: "NVDA-1",
        title: "데이터센터 GPU 수요가 실적 기대를 견인",
        source: "Mock Semiconductor Note",
        date: "2026-06-30",
        sentiment: "positive",
        impact: "호재",
        summary:
          "AI 학습과 추론 수요가 늘면 고성능 GPU 매출 기대가 높아질 수 있습니다.",
        url: "https://example.com/mock-news/nvidia-datacenter"
      },
      {
        id: "NVDA-2",
        title: "공급망과 고객 집중도는 변동성 요인",
        source: "Mock Supply Watch",
        date: "2026-06-29",
        sentiment: "negative",
        impact: "악재",
        summary:
          "대형 고객의 주문 변화나 공급 차질은 고성장 종목의 주가 변동성을 키울 수 있습니다.",
        url: "https://example.com/mock-news/nvidia-supply-risk"
      }
    ]
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    market: "NASDAQ",
    sector: "Electric Vehicles",
    currentPrice: 189.4,
    priceChangePercent: -0.84,
    riskScore: 70,
    volatility: 38,
    chart: createCandles(
      [
        { label: "6/17", close: 198.2 },
        { label: "6/18", close: 195.4 },
        { label: "6/19", close: 193.8 },
        { label: "6/20", close: 196.1 },
        { label: "6/23", close: 192.5 },
        { label: "6/24", close: 190.7 },
        { label: "6/25", close: 193.2 },
        { label: "6/26", close: 191.8 },
        { label: "6/27", close: 190.1 },
        { label: "6/30", close: 189.4 }
      ],
      4.1
    ),
    metrics: {
      sml: {
        beta: 2.05,
        expectedReturn: 14.1,
        marketReturn: 7.8,
        riskFreeRate: 4.3,
        alpha: -0.5
      },
      per: {
        value: 58.3,
        sectorAverage: 24.6
      },
      rsi: {
        value: 41
      }
    },
    highlights: {
      positive: "자율주행과 에너지 사업 기대",
      negative: "전기차 가격 경쟁과 높은 변동성"
    },
    news: [
      {
        id: "TSLA-1",
        title: "자율주행 소프트웨어 기대가 장기 성장 서사를 지지",
        source: "Mock Auto Tech Brief",
        date: "2026-06-30",
        sentiment: "positive",
        impact: "호재",
        summary:
          "소프트웨어 매출이 확대되면 자동차 제조 마진 의존도를 낮출 수 있습니다.",
        url: "https://example.com/mock-news/tesla-autonomy"
      },
      {
        id: "TSLA-2",
        title: "전기차 가격 경쟁은 단기 마진 부담",
        source: "Mock EV Watch",
        date: "2026-06-28",
        sentiment: "negative",
        impact: "악재",
        summary:
          "판매량 방어를 위한 가격 인하는 매출 성장에도 이익률을 압박할 수 있습니다.",
        url: "https://example.com/mock-news/tesla-price-competition"
      }
    ]
  }
];

export function getStockBySymbol(symbol: string) {
  return stocks.find((stock) => stock.symbol === symbol.toUpperCase());
}

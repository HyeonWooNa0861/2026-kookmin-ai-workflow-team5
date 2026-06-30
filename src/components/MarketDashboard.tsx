"use client";

import { useCallback, useEffect, useState } from "react";
import { LineChart } from "@/components/LineChart";
import { NewsList } from "@/components/NewsList";
import { StockCard } from "@/components/StockCard";
import { formatIndex, formatPercent } from "@/lib/format";
import type { MarketPayload } from "@/lib/marketService";

type MarketDashboardProps = {
  initialData: MarketPayload;
};

const refreshIntervalMs = 60 * 1000;

export function MarketDashboard({ initialData }: MarketDashboardProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const refreshMarket = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/market", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`market api failed: ${response.status}`);
      }

      const payload = (await response.json()) as MarketPayload;

      setData(payload);
      setLastError(null);
    } catch {
      setLastError("API 조회 실패로 mock data를 유지 중입니다.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const firstRefresh = window.setTimeout(() => {
      void refreshMarket();
    }, 0);
    const timer = window.setInterval(() => {
      void refreshMarket();
    }, refreshIntervalMs);

    return () => {
      window.clearTimeout(firstRefresh);
      window.clearInterval(timer);
    };
  }, [refreshMarket]);

  return (
    <>
      <header className="topBar">
        <div>
          <p className="eyebrow">AWS Charting</p>
          <h1>미국 주식 위험 대시보드</h1>
        </div>
        <div className="statusActions">
          <p className={`dataBadge ${data.source}`}>{data.source === "mock" ? "mock data" : "API data"}</p>
          <button className="ghostButton" disabled={isRefreshing} onClick={refreshMarket} type="button">
            {isRefreshing ? "조회 중" : "새로고침"}
          </button>
        </div>
      </header>

      <section className="dataStatus" aria-live="polite">
        <span>{data.message}</span>
        <span>{new Date(data.updatedAt).toLocaleString("ko-KR")}</span>
        {lastError ? <span className="negativeText">{lastError}</span> : null}
      </section>

      <section className="heroGrid">
        <LineChart
          points={data.marketIndex.chart}
          subtitle={`${data.marketIndex.code} - ${data.marketIndex.updatedAt}`}
          title={data.marketIndex.name}
        />

        <aside className="indexSummary">
          <p className="eyebrow">시장 전체 흐름</p>
          <strong>{formatIndex(data.marketIndex.currentValue)}</strong>
          <span className="positiveText">{formatPercent(data.marketIndex.changePercent)}</span>
          <p>{data.marketIndex.summary}</p>
          <div className="beginnerNote">
            체계적 위험은 금리, 환율, 수출처럼 여러 종목에 함께 영향을 주는 시장
            공통 요인입니다.
          </div>
        </aside>
      </section>

      <NewsList
        description="체계적 위험"
        items={data.systematicNews}
        title="시장 공통 호재와 악재"
      />

      <section className="contentSection">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">비체계적 위험</p>
            <h2>미국 종목별 데모 분석</h2>
          </div>
          <p>
            비체계적 위험은 특정 기업의 실적, 규제, 제품, 임상 일정처럼 한 종목에
            직접 영향을 주는 요인입니다.
          </p>
        </div>

        <div className="stockGrid">
          {data.stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>
    </>
  );
}

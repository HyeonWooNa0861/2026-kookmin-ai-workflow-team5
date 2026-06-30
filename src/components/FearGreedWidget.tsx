"use client";

import { useEffect, useRef, useState } from "react";
import type { FearGreedLevel } from "@/lib/mockData";
import { fearGreedIndex } from "@/lib/mockData";

type FearGreedData = {
  score: number;
  level: FearGreedLevel;
  label: string;
  description: string;
  previousClose: number | null;
  updatedAt: string;
  source?: string;
};

const POLL_MS = 60 * 60 * 1000;

function zoneOf(score: number): string {
  if (score <= 25) return "extreme-fear";
  if (score <= 45) return "fear";
  if (score <= 55) return "neutral";
  if (score <= 75) return "greed";
  return "extreme-greed";
}

const INITIAL: FearGreedData = {
  score: fearGreedIndex.value,
  level: fearGreedIndex.level as FearGreedLevel,
  label: fearGreedIndex.label,
  description: fearGreedIndex.description,
  previousClose: null,
  updatedAt: fearGreedIndex.updatedAt
};

function useFearGreed() {
  const [data, setData] = useState<FearGreedData>(INITIAL);
  const [zoneChanged, setZoneChanged] = useState(false);
  const prevZone = useRef(zoneOf(fearGreedIndex.value));

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/fear-greed");
        if (!res.ok) return;
        const next: FearGreedData = await res.json();
        const nextZone = zoneOf(next.score);
        if (nextZone !== prevZone.current) {
          setZoneChanged(true);
          setTimeout(() => setZoneChanged(false), 6000);
          prevZone.current = nextZone;
        }
        setData(next);
      } catch {
        // 실패 시 현재 상태 유지
      }
    }
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  return { data, zoneChanged };
}

export function FearGreedBanner() {
  const { data, zoneChanged } = useFearGreed();
  const diff =
    data.previousClose !== null ? data.score - data.previousClose : null;

  return (
    <div className={`fgAlert ${data.level}${zoneChanged ? " zoneChanged" : ""}`} role="status">
      <span className="fgAlertLabel">{data.label}</span>
      <span className="fgAlertValue">{data.score}</span>
      {diff !== null && (
        <span className={`fgAlertDiff ${diff >= 0 ? "up" : "down"}`}>
          전일比 {diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}
        </span>
      )}
      <span className="fgAlertDesc">{data.description}</span>
      {zoneChanged && <span className="fgZoneTag">구간 변경</span>}
      <span className="fgAlertSource">출처: {data.source ?? "CNN Business"}</span>
    </div>
  );
}

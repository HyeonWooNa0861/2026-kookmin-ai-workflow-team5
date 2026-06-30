import type { CandlePoint } from "./mockData";

export function calculateRsi(candles: CandlePoint[], period = 14) {
  if (candles.length < 2) {
    return 50;
  }

  const changes = candles.slice(1).map((point, index) => {
    return point.close - candles[index].close;
  });
  const recentChanges = changes.slice(-period);
  const gains = recentChanges
    .filter((change) => change > 0)
    .reduce((sum, change) => sum + change, 0);
  const losses = recentChanges
    .filter((change) => change < 0)
    .reduce((sum, change) => sum + Math.abs(change), 0);

  if (losses === 0) {
    return 70;
  }

  const relativeStrength = gains / losses;

  return Math.round(100 - 100 / (1 + relativeStrength));
}

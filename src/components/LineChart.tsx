import type { LinePoint } from "@/lib/mockData";

type LineChartProps = {
  title: string;
  subtitle: string;
  points: LinePoint[];
  movingAverageWindow?: number;
};

function createMovingAverage(points: LinePoint[], windowSize: number) {
  return points.map((point, index) => {
    const windowStart = Math.max(0, index - windowSize + 1);
    const windowPoints = points.slice(windowStart, index + 1);
    const valueSum = windowPoints.reduce((sum, item) => sum + item.value, 0);

    return {
      label: point.label,
      value: valueSum / windowPoints.length
    };
  });
}

export function LineChart({
  title,
  subtitle,
  points,
  movingAverageWindow = 5
}: LineChartProps) {
  const width = 640;
  const height = 280;
  const padding = 30;
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const rawRange = maxValue - minValue || 1;
  const min = minValue - rawRange * 0.08;
  const max = maxValue + rawRange * 0.08;
  const range = max - min || 1;
  const xStep = (width - padding * 2) / Math.max(points.length - 1, 1);

  const scaleY = (value: number) =>
    padding + (1 - (value - min) / range) * (height - padding * 2);

  const linePoints = points
    .map((point, index) => `${padding + index * xStep},${scaleY(point.value)}`)
    .join(" ");
  const movingAverageLine = createMovingAverage(points, movingAverageWindow)
    .map((point, index) => `${padding + index * xStep},${scaleY(point.value)}`)
    .join(" ");
  const latest = points.at(-1);
  const latestX = padding + (points.length - 1) * xStep;
  const latestY = latest ? scaleY(latest.value) : padding;

  return (
    <section className="chartBlock" aria-label={title}>
      <div className="chartHeader">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
        <div className="rangeLabel">
          <span>{points[0].label}</span>
          <span>{points[points.length - 1].label}</span>
        </div>
      </div>

      <div className="chartLegend" aria-label="차트 범례">
        <span>
          <i className="legendLine index" />
          FRED 종가선
        </span>
        <span>
          <i className="legendLine" />
          {movingAverageWindow}일 이동평균선
        </span>
      </div>

      <svg
        aria-label={`${title} 선 그래프와 ${movingAverageWindow}일 이동평균선`}
        className="lineChart"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <line
          className="axis"
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
        />
        <line className="axis" x1={padding} x2={padding} y1={padding} y2={height - padding} />
        <polyline className="indexLine" points={linePoints} />
        <polyline className="movingAverage" points={movingAverageLine} />
        {latest ? <circle className="lastPoint" cx={latestX} cy={latestY} r="5" /> : null}
      </svg>
    </section>
  );
}

interface SparklineProps {
  data: number[];
  positive?: boolean;
}

export default function Sparkline({ data, positive = true }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const width = 88;
  const height = 28;
  const padding = 2;
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;

  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="sparkline-container" title={`Trend: ${data.map((v) => v.toFixed(1)).join(' → ')}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg">
        <polygon
          points={areaPoints}
          className={`sparkline-fill ${positive ? 'sparkline-fill-positive' : 'sparkline-fill-negative'}`}
        />
        <polyline points={points} className={positive ? 'sparkline-line-positive' : 'sparkline-line-negative'} />
      </svg>
    </div>
  );
}

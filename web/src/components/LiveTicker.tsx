import type { TickerData } from '../services/marketData';

interface LiveTickerProps {
  tickers: TickerData[];
  loading?: boolean;
}

export default function LiveTicker({ tickers, loading }: LiveTickerProps) {
  if (loading || tickers.length === 0) {
    return (
      <div className="live-ticker-bar">
        <span className="live-ticker-label">Markets</span>
        <span className="live-ticker-loading">Loading live quotes…</span>
      </div>
    );
  }

  const items = [...tickers, ...tickers];

  return (
    <div className="live-ticker-bar" aria-label="Live market ticker">
      <span className="live-ticker-label">
        <span className="live-dot" /> Live
      </span>
      <div className="live-ticker-track">
        <div className="live-ticker-content">
          {items.map((ticker, idx) => (
            <span
              key={`${ticker.index}-${idx}`}
              className={`live-ticker-item ${ticker.isPositive ? 'positive' : 'negative'}`}
            >
              <strong>{ticker.index}</strong>
              <span>{ticker.change}</span>
              {ticker.value && <span className="live-ticker-value">{ticker.value}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

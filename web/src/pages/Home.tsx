import { useState, useEffect } from 'react';
import { 
  getTickerData, 
  getLastUpdateTime, 
  forceRefreshAll,
  getSwingTradingStocks,
  getMonthlyPerformers,
  type SwingTradeStock,
  type MonthlyPerformer
} from '../services/marketData';

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;
  const width = 80;
  const height = 24;
  const padding = 2;
  const maxVal = 100;
  const minVal = 0;
  
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="sparkline-container" title={`Trend history: ${data.join(', ')}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg">
        <polyline points={points} />
      </svg>
    </div>
  );
}

export default function Home() {
  const [tickers, setTickers] = useState<{ index: string; change: string; isPositive: boolean }[]>([]);
  const [swingStocks, setSwingStocks] = useState<SwingTradeStock[]>([]);
  const [monthlyPerformers, setMonthlyPerformers] = useState<MonthlyPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadAllData();

    // Check every 1 minute if the data has expired (daily update check)
    const interval = setInterval(() => {
      const last = getLastUpdateTime();
      if (last) {
        const today = new Date().toDateString();
        const updateDay = last.toDateString();
        // If calendar date is different or cache duration has expired, trigger background load
        if (today !== updateDay || (Date.now() - last.getTime()) > 24 * 60 * 60 * 1000) {
          loadAllData();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [tickerData, swingData, performerData] = await Promise.all([
      getTickerData(),
      getSwingTradingStocks(),
      getMonthlyPerformers()
    ]);
    setTickers(tickerData);
    setSwingStocks(swingData);
    setMonthlyPerformers(performerData);
    setLastUpdate(getLastUpdateTime());
    setLoading(false);
  };

  const handleRefresh = async () => {
    await forceRefreshAll();
    loadAllData();
  };

  return (
    <section>
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Invest with confidence</span>
          <h1>Welcome to Wealth Manager</h1>
          <p>
            Track your portfolio across equities, mutual funds, debt funds, and foreign assets. Enjoy modern charts,
            animated market signals, and an intuitive dashboard built for every investor.
          </p>
          {lastUpdate && (
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
              Last updated: {lastUpdate.toLocaleString()}
            </p>
          )}
        </div>
        <div className="hero-visual">
          <div className="ticker-card">
            <div className="ticker-header">
              <span>Global Market Pulse</span>
              <span className="ticker-badge">Live</span>
              <button 
                onClick={handleRefresh}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#5e72ff',
                  marginLeft: '8px'
                }}
                title="Refresh data"
              >
                🔄
              </button>
            </div>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            ) : (
              tickers.map((ticker, idx) => (
                <div key={idx} className={`ticker-row ${ticker.isPositive ? 'positive' : 'negative'}`}>
                  <span>{ticker.index}</span>
                  <span>{ticker.change}</span>
                </div>
              ))
            )}
          </div>
          <div className="logo-cloud">
            <div className="logo-chip logo-apple">🍎</div>
            <div className="logo-chip logo-google">🔎</div>
            <div className="logo-chip logo-tesla">⚡</div>
            <div className="logo-chip logo-microsoft">🪟</div>
            <div className="logo-chip logo-btc">💹</div>
          </div>
        </div>
      </div>

      {/* Swing Trading & Top Performers Dashboard */}
      <div className="dashboard-grid">
        {/* Swing Trading Panel */}
        <div className="dashboard-card fade-up delay-1">
          <h2>
            <span>🏏</span> NSE Swing Trading Picks (Top 10)
          </h2>
          <p className="section-desc">
            Top liquid Indian NSE stocks for short-term swing positions based on daily technical indicators, support, and resistance.
          </p>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Support</th>
                  <th>Resistance</th>
                  <th>Chg %</th>
                  <th>Signal</th>
                  <th>Rationale</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>Loading swing trade data...</td>
                  </tr>
                ) : (
                  swingStocks.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <strong>{stock.symbol}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stock.name}</div>
                      </td>
                      <td>{stock.price}</td>
                      <td>{stock.support}</td>
                      <td>{stock.resistance}</td>
                      <td className={stock.change.startsWith('+') ? 'trend-positive' : 'trend-negative'}>
                        {stock.change}
                      </td>
                      <td>
                        <span className={`badge badge-${stock.signal.toLowerCase().replace(' ', '-')}`}>
                          {stock.signal}
                        </span>
                      </td>
                      <td>
                        <div className="rationale-text" title={stock.rationale}>
                          {stock.rationale}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers Panel */}
        <div className="dashboard-card fade-up delay-2">
          <h2>
            <span>🔥</span> Top Performers (Last 1 Month)
          </h2>
          <p className="section-desc">
            Indian market stock leaders with the highest cumulative percentage returns over the past 30 days.
          </p>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>1-Month Gain</th>
                  <th>Trend (30d)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>Loading top performers...</td>
                  </tr>
                ) : (
                  monthlyPerformers.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <strong>{stock.symbol}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stock.name}</div>
                      </td>
                      <td>{stock.price}</td>
                      <td className="trend-positive">
                        {stock.gain1M}
                      </td>
                      <td>
                        <Sparkline data={stock.sparkline} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card-grid home-card-grid">
        <article className="card fade-up">
          <div className="card-icon">📈</div>
          <h2>Equities</h2>
          <p>View stock holdings and market performance for your equity portfolio.</p>
        </article>
        <article className="card fade-up delay-1">
          <div className="card-icon">💼</div>
          <h2>Mutual Funds</h2>
          <p>Monitor your mutual fund allocations, returns, and scheme details.</p>
        </article>
        <article className="card fade-up delay-2">
          <div className="card-icon">🏛️</div>
          <h2>Debt Funds</h2>
          <p>Analyze fixed income holdings and debt fund performance.</p>
        </article>
        <article className="card fade-up delay-3">
          <div className="card-icon">🌍</div>
          <h2>Foreign Portfolio</h2>
          <p>See international investments and currency diversified holdings.</p>
        </article>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { getTickerData, getLastUpdateTime, forceRefreshAll } from '../services/marketData';

export default function Home() {
  const [tickers, setTickers] = useState<{ index: string; change: string; isPositive: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadTickerData();
  }, []);

  const loadTickerData = async () => {
    setLoading(true);
    const data = await getTickerData();
    setTickers(data);
    setLastUpdate(getLastUpdateTime());
    setLoading(false);
  };

  const handleRefresh = async () => {
    await forceRefreshAll();
    loadTickerData();
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

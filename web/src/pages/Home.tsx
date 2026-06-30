import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sparkline from '../components/Sparkline';
import LiveTicker from '../components/LiveTicker';
import {
  getTickerData,
  getSwingTradingStocks,
  getMonthlyPerformers,
  getPortfolioSummary,
  type SwingTradeStock,
  type MonthlyPerformer,
  type TickerData,
  type PortfolioSummary,
} from '../services/marketData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

const DONUT_CIRC = 251.3;

function DonutChart({
  assets,
  hoveredAsset,
  onHover,
}: {
  assets: PortfolioSummary['assets'];
  hoveredAsset: string | null;
  onHover: (label: string | null) => void;
}) {
  let offset = 0;
  return (
    <div className="chart-wrapper chart-wrapper-lg">
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        {assets.map((asset) => {
          const size = (asset.percent / 100) * DONUT_CIRC;
          const dashoffset = -offset;
          offset += size;
          return (
            <circle
              key={asset.label}
              className="svg-donut-segment"
              cx="60"
              cy="60"
              r="40"
              fill="transparent"
              stroke={asset.color}
              strokeWidth={hoveredAsset === asset.label ? 14 : 10}
              strokeDasharray={`${size} ${DONUT_CIRC}`}
              strokeDashoffset={dashoffset}
              onMouseEnter={() => onHover(asset.label)}
              onMouseLeave={() => onHover(null)}
            />
          );
        })}
      </svg>
      <div className="chart-center-text">
        <div className="chart-center-val">
          {hoveredAsset
            ? `${assets.find((a) => a.label === hoveredAsset)?.percent ?? 0}%`
            : '100%'}
        </div>
        <div className="chart-center-lbl">
          {hoveredAsset ? hoveredAsset.split(' ')[0] : 'Assets'}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [swingStocks, setSwingStocks] = useState<SwingTradeStock[]>([]);
  const [monthlyPerformers, setMonthlyPerformers] = useState<MonthlyPerformer[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [swingSearch, setSwingSearch] = useState('');
  const [signalFilter, setSignalFilter] = useState('All');
  const [performerSearch, setPerformerSearch] = useState('');
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [tickerData, swingData, performerData, portfolioData] = await Promise.all([
      getTickerData(),
      getSwingTradingStocks(),
      getMonthlyPerformers(),
      getPortfolioSummary(),
    ]);
    setTickers(tickerData);
    setSwingStocks(swingData);
    setMonthlyPerformers(performerData);
    setPortfolio(portfolioData);
  }, []);

  const { loading, refreshing, lastUpdate, handleForceRefresh } = useAutoRefresh(loadData);

  const filteredSwing = swingStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(swingSearch.toLowerCase()) ||
      stock.name.toLowerCase().includes(swingSearch.toLowerCase());
    const matchesSignal = signalFilter === 'All' || stock.signal === signalFilter;
    return matchesSearch && matchesSignal;
  });

  const filteredPerformers = monthlyPerformers.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(performerSearch.toLowerCase()) ||
      stock.name.toLowerCase().includes(performerSearch.toLowerCase())
  );

  const assets = portfolio?.assets ?? [];

  return (
    <section className="home-page">
      <LiveTicker tickers={tickers} loading={loading && tickers.length === 0} />

      {/* Hero */}
      <div className="home-hero fade-up">
        <div className="home-hero-bg" aria-hidden="true" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="eyebrow">WealthFlow · Live Dashboard</span>
            <h1>Your wealth, tracked in real time.</h1>
            <p>
              Monitor portfolio value, market signals, and global indexes — refreshed every 15 minutes
              with live market quotes when available.
            </p>
            <div className="hero-actions">
              <Link to="/equities" className="btn btn-primary btn-lg">
                View Holdings
              </Link>
              <Link to="/global-indexes" className="btn btn-ghost btn-lg">
                Global Markets
              </Link>
              <button
                onClick={handleForceRefresh}
                className="btn btn-outline btn-lg"
                disabled={refreshing}
              >
                {refreshing ? '⟳ Updating…' : '🔄 Refresh Now'}
              </button>
            </div>
            {lastUpdate && (
              <p className="home-meta">
                Last sync: {lastUpdate.toLocaleString()}
              </p>
            )}
          </div>

          <div className="portfolio-card portfolio-card-premium fade-up delay-1">
            <div className="portfolio-info">
              <div className="portfolio-badges">
                <span className="portfolio-badge">Demo Portfolio</span>
                <span className="portfolio-badge">Live Feed</span>
                <span className="portfolio-badge portfolio-badge-green">Growth</span>
              </div>
              <h3>Total Portfolio Value</h3>
              <div className="portfolio-balance">
                {loading && !portfolio ? '…' : portfolio?.totalValueFormatted ?? '—'}
              </div>
              <div className="portfolio-chips">
                <span className={`portfolio-chip ${portfolio?.ytdPositive ? 'positive' : 'negative'}`}>
                  {portfolio?.ytdPositive ? '▲' : '▼'} {portfolio?.ytdGain ?? '—'} YTD
                </span>
                <span className={`portfolio-chip ${portfolio?.dayChangePositive ? 'positive' : 'negative'}`}>
                  Today {portfolio?.dayChange ?? '—'}
                </span>
              </div>
              <div className="portfolio-legend">
                {assets.map((asset) => (
                  <div
                    key={asset.label}
                    className="legend-item"
                    onMouseEnter={() => setHoveredAsset(asset.label)}
                    onMouseLeave={() => setHoveredAsset(null)}
                    style={{ opacity: hoveredAsset && hoveredAsset !== asset.label ? 0.45 : 1 }}
                  >
                    <div className="legend-label-group">
                      <span className="legend-dot" style={{ backgroundColor: asset.color }} />
                      <span>{asset.label}</span>
                    </div>
                    <span className="legend-percent">
                      {asset.valueFormatted} ({asset.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {assets.length > 0 && (
              <DonutChart assets={assets} hoveredAsset={hoveredAsset} onHover={setHoveredAsset} />
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid fade-up delay-1">
        <div className="stat-card">
          <span className="stat-label">Net Worth</span>
          <span className="stat-value">{portfolio?.totalValueFormatted ?? '—'}</span>
          <span className="stat-sub positive">Simulated demo account</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Day Change</span>
          <span className={`stat-value ${portfolio?.dayChangePositive ? 'trend-positive' : 'trend-negative'}`}>
            {portfolio?.dayChange ?? '—'}
          </span>
          <span className="stat-sub">Across all holdings</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">YTD Return</span>
          <span className={`stat-value ${portfolio?.ytdPositive ? 'trend-positive' : 'trend-negative'}`}>
            {portfolio?.ytdGain ?? '—'}
          </span>
          <span className="stat-sub">Weighted average</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Holdings</span>
          <span className="stat-value">{portfolio?.holdingsCount ?? '—'}</span>
          <span className="stat-sub">Stocks, funds & debt</span>
        </div>
      </div>

      {/* Market pulse grid */}
      <div className="market-pulse-grid fade-up delay-2">
        {loading && tickers.length === 0 ? (
          <div className="market-pulse-skeleton">Loading market data…</div>
        ) : (
          tickers.map((ticker) => (
            <div key={ticker.index} className={`market-pulse-card ${ticker.isPositive ? 'up' : 'down'}`}>
              <span className="market-pulse-name">{ticker.index}</span>
              {ticker.value && <span className="market-pulse-value">{ticker.value}</span>}
              <span className={`market-pulse-change ${ticker.isPositive ? 'trend-positive' : 'trend-negative'}`}>
                {ticker.change}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Dashboard tables */}
      <div className="dashboard-grid">
        <div className="dashboard-card fade-up delay-1">
          <div className="dashboard-card-header">
            <h2><span>🏏</span> NSE Swing Trading Picks</h2>
            <span className="live-badge"><span className="live-dot" /> Auto-refresh</span>
          </div>
          <p className="section-desc">
            Top liquid NSE stocks for short-term swing positions — prices update with live quotes.
          </p>
          <div className="card-controls">
            <input
              type="text"
              placeholder="Search symbol or name…"
              className="search-input"
              value={swingSearch}
              onChange={(e) => setSwingSearch(e.target.value)}
            />
            <select className="filter-select" value={signalFilter} onChange={(e) => setSignalFilter(e.target.value)}>
              <option value="All">All Signals</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Hold">Hold</option>
            </select>
          </div>
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
                  <tr><td colSpan={7} className="table-loading">Loading swing picks…</td></tr>
                ) : filteredSwing.length === 0 ? (
                  <tr><td colSpan={7} className="table-empty">No picks match your filters.</td></tr>
                ) : (
                  filteredSwing.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <strong>{stock.symbol}</strong>
                        <div className="cell-sub">{stock.name}</div>
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
                      <td><div className="rationale-text" title={stock.rationale}>{stock.rationale}</div></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card fade-up delay-2">
          <div className="dashboard-card-header">
            <h2><span>🔥</span> Top Performers (30 Days)</h2>
            <span className="live-badge"><span className="live-dot" /> Auto-refresh</span>
          </div>
          <p className="section-desc">Highest cumulative gainers over the past month with trend sparklines.</p>
          <div className="card-controls">
            <input
              type="text"
              placeholder="Search symbol or name…"
              className="search-input"
              value={performerSearch}
              onChange={(e) => setPerformerSearch(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>1M Gain</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="table-loading">Loading performers…</td></tr>
                ) : filteredPerformers.length === 0 ? (
                  <tr><td colSpan={4} className="table-empty">No matches found.</td></tr>
                ) : (
                  filteredPerformers.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <strong>{stock.symbol}</strong>
                        <div className="cell-sub">{stock.name}</div>
                      </td>
                      <td>{stock.price}</td>
                      <td className="trend-positive">{stock.gain1M}</td>
                      <td><Sparkline data={stock.sparkline} positive /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Asset explorer */}
      <div className="home-section-header fade-up">
        <h2>Explore Your Portfolio</h2>
        <p>Dive into each asset class with live-updated holdings and performance metrics.</p>
      </div>
      <div className="card-grid home-card-grid">
        <Link to="/equities" className="card card-featured fade-up">
          <div className="card-icon">📈</div>
          <h2>Indian & US Equities</h2>
          <p>Live stock prices, day change, and cumulative gains across 30+ holdings.</p>
          <span className="card-stat">{portfolio ? `${portfolio.holdingsCount} assets` : 'Loading…'}</span>
        </Link>
        <Link to="/mutual-funds" className="card fade-up delay-1">
          <div className="card-icon">💼</div>
          <h2>Mutual Funds</h2>
          <p>Dynamic NAV and YTD returns refreshed on every sync.</p>
        </Link>
        <Link to="/debt-funds" className="card fade-up delay-2">
          <div className="card-icon">🏛️</div>
          <h2>Fixed Income & Debt</h2>
          <p>Track yield movements across corporate, gilt, and liquid funds.</p>
        </Link>
        <Link to="/foreign-portfolio" className="card fade-up delay-3">
          <div className="card-icon">🌍</div>
          <h2>International Assets</h2>
          <p>Global equities and sovereign debt with live price feeds.</p>
        </Link>
      </div>
    </section>
  );
}

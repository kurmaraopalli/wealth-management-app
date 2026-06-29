import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Filters state
  const [swingSearch, setSwingSearch] = useState('');
  const [signalFilter, setSignalFilter] = useState('All');
  const [performerSearch, setPerformerSearch] = useState('');

  // SVG Chart interaction
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

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

  // Filter Logic
  const filteredSwing = swingStocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(swingSearch.toLowerCase()) ||
                          stock.name.toLowerCase().includes(swingSearch.toLowerCase());
    const matchesSignal = signalFilter === 'All' || stock.signal === signalFilter;
    return matchesSearch && matchesSignal;
  });

  const filteredPerformers = monthlyPerformers.filter(stock => {
    return stock.symbol.toLowerCase().includes(performerSearch.toLowerCase()) ||
           stock.name.toLowerCase().includes(performerSearch.toLowerCase());
  });

  // Portfolio details for interactive SVG chart
  const portfolioAssets = [
    { label: 'Equities', percent: 45, value: '₹21,71,250', color: '#2563eb' },
    { label: 'Mutual Funds', percent: 30, value: '₹14,47,500', color: '#10b981' },
    { label: 'Debt Funds', percent: 15, value: '₹7,23,750', color: '#f59e0b' },
    { label: 'International', percent: 10, value: '₹4,82,500', color: '#8b5cf6' }
  ];

  return (
    <section>
      <div className="hero-panel">
        <div className="hero-copy fade-up">
          <span className="eyebrow">🏛️ Wealth Management Hub</span>
          <h1>Smart wealth building, made simple.</h1>
          <p>
            Track holdings, analyze asset performance, and review technical signals across Indian equities, 
            mutual funds, fixed-income debt, and currency-diversified international assets—all in one secure platform.
          </p>
          <div className="hero-actions">
            <Link to="/equities" className="btn btn-primary">
              💼 Manage Portfolio
            </Link>
            <Link to="/global-indexes" className="btn btn-outline">
              📈 Explore Markets
            </Link>
          </div>
          {lastUpdate && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Last data update: {lastUpdate.toLocaleString()}
            </p>
          )}
        </div>

        <div className="hero-visual fade-up delay-1">
          {/* Interactive Portfolio Overview Card */}
          <div className="portfolio-card">
            <div className="portfolio-info">
              <h3>Portfolio Value</h3>
              <div className="portfolio-balance">₹48,25,000</div>
              <div className="portfolio-performance">
                ▲ +14.2% YTD
              </div>
              <div className="portfolio-legend" style={{ marginTop: '16px' }}>
                {portfolioAssets.map((asset) => (
                  <div 
                    key={asset.label} 
                    className="legend-item"
                    onMouseEnter={() => setHoveredAsset(asset.label)}
                    onMouseLeave={() => setHoveredAsset(null)}
                    style={{ 
                      opacity: hoveredAsset && hoveredAsset !== asset.label ? 0.5 : 1,
                      transition: 'opacity 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="legend-label-group">
                      <span className="legend-dot" style={{ backgroundColor: asset.color }} />
                      <span>{asset.label}</span>
                    </div>
                    <span className="legend-percent">{asset.value} ({asset.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart SVG */}
            <div className="chart-wrapper">
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                {/* Circumference = 2 * PI * r = 2 * 3.14159 * 40 = 251.32 */}
                
                {/* Equities segment (45%): size 113.1, offset 0 */}
                <circle
                  className="svg-donut-segment"
                  cx="60" cy="60" r="40"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray="113.1 251.3"
                  strokeDashoffset="0"
                  onMouseEnter={() => setHoveredAsset('Equities')}
                  onMouseLeave={() => setHoveredAsset(null)}
                  style={{ strokeWidth: hoveredAsset === 'Equities' ? 14 : 10 }}
                />
                
                {/* Mutual Funds segment (30%): size 75.4, offset -113.1 */}
                <circle
                  className="svg-donut-segment"
                  cx="60" cy="60" r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray="75.4 251.3"
                  strokeDashoffset="-113.1"
                  onMouseEnter={() => setHoveredAsset('Mutual Funds')}
                  onMouseLeave={() => setHoveredAsset(null)}
                  style={{ strokeWidth: hoveredAsset === 'Mutual Funds' ? 14 : 10 }}
                />

                {/* Debt Funds segment (15%): size 37.7, offset -188.5 */}
                <circle
                  className="svg-donut-segment"
                  cx="60" cy="60" r="40"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="10"
                  strokeDasharray="37.7 251.3"
                  strokeDashoffset="-188.5"
                  onMouseEnter={() => setHoveredAsset('Debt Funds')}
                  onMouseLeave={() => setHoveredAsset(null)}
                  style={{ strokeWidth: hoveredAsset === 'Debt Funds' ? 14 : 10 }}
                />

                {/* International segment (10%): size 25.1, offset -226.2 */}
                <circle
                  className="svg-donut-segment"
                  cx="60" cy="60" r="40"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="10"
                  strokeDasharray="25.1 251.3"
                  strokeDashoffset="-226.2"
                  onMouseEnter={() => setHoveredAsset('International')}
                  onMouseLeave={() => setHoveredAsset(null)}
                  style={{ strokeWidth: hoveredAsset === 'International' ? 14 : 10 }}
                />
              </svg>
              <div className="chart-center-text" style={{ color: 'white' }}>
                <div className="chart-center-val">
                  {hoveredAsset ? 
                    portfolioAssets.find(a => a.label === hoveredAsset)?.percent + '%' 
                    : '100%'}
                </div>
                <div className="chart-center-lbl" style={{ color: '#94a3b8' }}>
                  {hoveredAsset ? hoveredAsset.split(' ')[0] : 'Assets'}
                </div>
              </div>
            </div>
          </div>

          <div className="logo-cloud">
            <div className="logo-chip" title="Apple Inc.">🍎</div>
            <div className="logo-chip" title="Google Inc.">🔎</div>
            <div className="logo-chip" title="Tesla Inc.">⚡</div>
            <div className="logo-chip" title="Microsoft Corp.">🪟</div>
            <div className="logo-chip" title="Bitcoin">💹</div>
          </div>
        </div>
      </div>

      {/* Global Market Pulse & Refresh Banner */}
      <div className="ticker-card fade-up delay-2" style={{ marginBottom: '32px' }}>
        <div className="ticker-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌐 Global Market Pulse
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="ticker-badge">Live Ticker</span>
            <button 
              onClick={handleRefresh}
              className="btn btn-outline"
              style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px' }}
              title="Force update daily data cache"
            >
              🔄 Refresh Cache
            </button>
          </div>
        </div>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Updating market tickers...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {tickers.map((ticker, idx) => (
              <div key={idx} className={`ticker-row ${ticker.isPositive ? 'positive' : 'negative'}`}>
                <span>{ticker.index}</span>
                <span>{ticker.change}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swing Trading & Top Performers Dashboard */}
      <div className="dashboard-grid">
        {/* Swing Trading Panel */}
        <div className="dashboard-card fade-up delay-1">
          <h2>
            <span>🏏</span> NSE Swing Trading Picks
          </h2>
          <p className="section-desc">
            Top liquid Indian NSE stocks for short-term swing positions based on daily moving averages, RSI divergence, and candlestick formations.
          </p>
          
          {/* Controls - Search and Signal Filter */}
          <div className="card-controls">
            <div className="control-group">
              <input 
                type="text" 
                placeholder="Search symbol/name..." 
                className="search-input"
                value={swingSearch}
                onChange={(e) => setSwingSearch(e.target.value)}
              />
            </div>
            <div className="control-group">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Signal:</span>
              <select 
                className="filter-select"
                value={signalFilter}
                onChange={(e) => setSignalFilter(e.target.value)}
              >
                <option value="All">All Picks</option>
                <option value="Strong Buy">Strong Buy</option>
                <option value="Buy">Buy</option>
                <option value="Hold">Hold</option>
              </select>
            </div>
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
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>Loading swing trade data...</td>
                  </tr>
                ) : filteredSwing.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No picks match your filter/search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSwing.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <strong>{stock.symbol}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.name}</div>
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
            <span>🔥</span> Top Performers (Last 30 Days)
          </h2>
          <p className="section-desc">
            Indian market stock leaders with the highest cumulative percentage gains over the past month.
          </p>

          {/* Controls - Search */}
          <div className="card-controls">
            <div className="control-group">
              <input 
                type="text" 
                placeholder="Search symbol/name..." 
                className="search-input"
                value={performerSearch}
                onChange={(e) => setPerformerSearch(e.target.value)}
              />
            </div>
          </div>

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
                ) : filteredPerformers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No stocks found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredPerformers.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>
                        <strong>{stock.symbol}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.name}</div>
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

      {/* Asset Explorer Cards */}
      <h2 style={{ marginTop: '36px', marginBottom: '8px' }}>Explore Asset Class Allocations</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Analyze specific details, holdings, and risk factors for each investment category.</p>
      
      <div className="card-grid home-card-grid">
        <Link to="/equities" className="card fade-up">
          <div className="card-icon">📈</div>
          <h2>Indian Equities</h2>
          <p>Review direct equity holdings, quantities, valuations, and gains across stocks.</p>
        </Link>
        <Link to="/mutual-funds" className="card fade-up delay-1">
          <div className="card-icon">💼</div>
          <h2>Mutual Funds</h2>
          <p>Monitor systematic investment plans (SIPs), fund schemes, and index performance.</p>
        </Link>
        <Link to="/debt-funds" className="card fade-up delay-2">
          <div className="card-icon">🏛️</div>
          <h2>Fixed Income & Debt</h2>
          <p>Track dynamic and banking PSU bonds, yield averages, and secure debt investments.</p>
        </Link>
        <Link to="/foreign-portfolio" className="card fade-up delay-3">
          <div className="card-icon">🌍</div>
          <h2>International Assets</h2>
          <p>See exposure to US technology equities, global bond issues, and currency diversification.</p>
        </Link>
      </div>
    </section>
  );
}


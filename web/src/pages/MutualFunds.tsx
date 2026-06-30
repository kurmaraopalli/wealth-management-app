import { useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { getMutualFundData, type MutualFundData } from '../services/marketData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export default function MutualFunds() {
  const [funds, setFunds] = useState<MutualFundData[]>([]);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setFunds(await getMutualFundData());
  }, []);

  const { loading, refreshing, lastUpdate, handleForceRefresh } = useAutoRefresh(loadData);

  const filtered = funds.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  const avgYtd =
    funds.length > 0 ? funds.reduce((s, f) => s + f.ytdNum, 0) / funds.length : 0;

  return (
    <section className="fade-up">
      <PageHeader
        title="Mutual Funds"
        description="Dynamic NAV and YTD returns — refreshed with live market conditions."
        lastUpdate={lastUpdate}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleForceRefresh}
      />

      {!loading && funds.length > 0 && (
        <div className="stat-grid stat-grid-compact">
          <div className="stat-card">
            <span className="stat-label">Schemes</span>
            <span className="stat-value">{funds.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg YTD Return</span>
            <span className="stat-value trend-positive">{avgYtd.toFixed(1)}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Best Performer</span>
            <span className="stat-value trend-positive">
              {funds.reduce((best, f) => (f.ytdNum > best.ytdNum ? f : best)).name.split(' ')[0]}
            </span>
          </div>
        </div>
      )}

      <div className="card-controls" style={{ margin: '24px 0' }}>
        <input
          type="text"
          placeholder="Search fund or category…"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
      </div>

      {loading ? (
        <div className="page-loading">Loading mutual fund data…</div>
      ) : (
        <ul className="fund-list fund-list-enhanced">
          {filtered.map((fund) => (
            <li key={fund.name}>
              <div className="fund-list-top">
                <strong>{fund.name}</strong>
                <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'none' }}>
                  {fund.category}
                </span>
              </div>
              <div className="fund-list-metrics">
                <div>
                  <span className="fund-metric-label">NAV</span>
                  <span className="fund-metric-value">{fund.nav}</span>
                </div>
                <div>
                  <span className="fund-metric-label">YTD</span>
                  <span className="fund-metric-value trend-positive">{fund.ytd}</span>
                </div>
              </div>
              <div className="fund-progress-bar">
                <div className="fund-progress-fill" style={{ width: `${Math.min(fund.ytdNum * 4, 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

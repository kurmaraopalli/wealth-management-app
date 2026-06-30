import { useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { getDebtFundData, type DebtFundData } from '../services/marketData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export default function DebtFunds() {
  const [funds, setFunds] = useState<DebtFundData[]>([]);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setFunds(await getDebtFundData());
  }, []);

  const { loading, refreshing, lastUpdate, handleForceRefresh } = useAutoRefresh(loadData);

  const filtered = funds.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase())
  );

  const avgYield =
    funds.length > 0 ? funds.reduce((s, f) => s + f.yieldNum, 0) / funds.length : 0;

  return (
    <section className="fade-up">
      <PageHeader
        title="Fixed Income & Debt Funds"
        description="Yield metrics updated dynamically to reflect current rate environment."
        lastUpdate={lastUpdate}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleForceRefresh}
      />

      {!loading && funds.length > 0 && (
        <div className="stat-grid stat-grid-compact">
          <div className="stat-card">
            <span className="stat-label">Funds</span>
            <span className="stat-value">{funds.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg Yield</span>
            <span className="stat-value trend-positive">{avgYield.toFixed(1)}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Highest Yield</span>
            <span className="stat-value trend-positive">
              {Math.max(...funds.map((f) => f.yieldNum)).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <div className="card-controls" style={{ margin: '24px 0' }}>
        <input
          type="text"
          placeholder="Search fund or type…"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
      </div>

      {loading ? (
        <div className="page-loading">Loading debt fund data…</div>
      ) : (
        <ul className="fund-list fund-list-enhanced">
          {filtered.map((fund) => (
            <li key={fund.name}>
              <div className="fund-list-top">
                <strong>{fund.name}</strong>
                <span className="badge" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning-dark)', textTransform: 'none' }}>
                  {fund.type}
                </span>
              </div>
              <div className="fund-list-metrics">
                <div>
                  <span className="fund-metric-label">Current Yield</span>
                  <span className="fund-metric-value trend-positive">{fund.yield}</span>
                </div>
              </div>
              <div className="fund-progress-bar fund-progress-bar-amber">
                <div className="fund-progress-fill" style={{ width: `${(fund.yieldNum / 8) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

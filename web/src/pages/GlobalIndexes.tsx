import { useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { getGlobalIndexesData, type GlobalIndexData } from '../services/marketData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export default function GlobalIndexes() {
  const [indexes, setIndexes] = useState<GlobalIndexData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setIndexes(await getGlobalIndexesData());
  }, []);

  const { loading, refreshing, lastUpdate, handleForceRefresh } = useAutoRefresh(loadData);

  const filtered = indexes.filter(
    (idx) =>
      idx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idx.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gainers = indexes.filter((i) => i.isPositive).length;
  const losers = indexes.length - gainers;

  return (
    <section className="fade-up">
      <PageHeader
        title="Global Stock Indexes"
        description="Live index values and daily changes across major world markets."
        lastUpdate={lastUpdate}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleForceRefresh}
      >
        <input
          type="text"
          placeholder="Search index or region…"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ minWidth: '220px' }}
        />
      </PageHeader>

      {!loading && indexes.length > 0 && (
        <div className="stat-grid stat-grid-compact">
          <div className="stat-card">
            <span className="stat-label">Indexes Tracked</span>
            <span className="stat-value">{indexes.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Gainers</span>
            <span className="stat-value trend-positive">{gainers}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Decliners</span>
            <span className="stat-value trend-negative">{losers}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="page-loading">Fetching live global index data…</div>
      ) : (
        <div className="table-responsive" style={{ marginTop: '24px' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Region</th>
                <th>Value</th>
                <th>Day Change</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="table-empty">No indexes match your search.</td>
                </tr>
              ) : (
                filtered.map((index) => (
                  <tr key={index.name}>
                    <td><strong>{index.name}</strong></td>
                    <td>
                      <span className="region-cell">
                        <span>{index.flag}</span>
                        {index.region}
                      </span>
                    </td>
                    <td className="index-value">{index.value}</td>
                    <td className={index.isPositive ? 'trend-positive' : 'trend-negative'}>
                      {index.change}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

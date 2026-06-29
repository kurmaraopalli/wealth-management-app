import { useState, useEffect } from 'react';
import { getStockData, getLastUpdateTime, forceRefreshAll } from '../services/marketData';
import type { StockData } from '../services/marketData';

export default function Equities() {
  const [companies, setCompanies] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    setLoading(true);
    const data = await getStockData();
    setCompanies(data);
    setLastUpdate(getLastUpdateTime());
    setLoading(false);
  };

  const handleRefresh = async () => {
    await forceRefreshAll();
    loadStockData();
  };

  return (
    <section className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1>Indian & US Equities</h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Manage direct stock holdings, review quantity holdings, valuations, and track cumulative returns.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="btn btn-primary"
        >
          🔄 Refresh Data
        </button>
      </div>

      {lastUpdate && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Last data update: {lastUpdate.toLocaleString()}
        </p>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading stock holdings...</div>
      ) : (
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Market</th>
                <th>Qty</th>
                <th>Current Price</th>
                <th>Gain / Loss</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.symbol}>
                  <td><strong>{company.symbol}</strong></td>
                  <td>{company.name}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
                      {company.country}
                    </span>
                  </td>
                  <td>{company.quantity}</td>
                  <td>{company.price}</td>
                  <td className={company.gain.startsWith('+') ? 'trend-positive' : 'trend-negative'}>
                    {company.gain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


import { useState, useEffect } from 'react';
import { getMutualFundData, getLastUpdateTime, forceRefreshAll } from '../services/marketData';
import type { MutualFundData } from '../services/marketData';

export default function MutualFunds() {
  const [funds, setFunds] = useState<MutualFundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadFundData();
  }, []);

  const loadFundData = async () => {
    setLoading(true);
    const data = await getMutualFundData();
    setFunds(data);
    setLastUpdate(getLastUpdateTime());
    setLoading(false);
  };

  const handleRefresh = async () => {
    await forceRefreshAll();
    loadFundData();
  };

  return (
    <section className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1>Mutual Funds</h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Monitor equity, hybrid, and small-cap mutual fund schemes, allocations, and year-to-date returns.
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
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading mutual fund holdings...</div>
      ) : (
        <ul className="fund-list">
          {funds.map((fund) => (
            <li key={fund.name}>
              <strong>{fund.name}</strong>
              <span>
                <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'none' }}>
                  {fund.category}
                </span>
                <strong className="trend-positive">{fund.ytd} YTD</strong>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


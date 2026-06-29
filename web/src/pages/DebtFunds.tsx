import { useState, useEffect } from 'react';
import { getDebtFundData, getLastUpdateTime, forceRefreshAll } from '../services/marketData';
import type { DebtFundData } from '../services/marketData';

export default function DebtFunds() {
  const [funds, setFunds] = useState<DebtFundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadFundData();
  }, []);

  const loadFundData = async () => {
    setLoading(true);
    const data = await getDebtFundData();
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
          <h1>Fixed Income & Debt Funds</h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Analyze fixed-income investments, AAA corporate bonds, and PSU debt funds with average yield metrics.
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
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading debt fund holdings...</div>
      ) : (
        <ul className="fund-list">
          {funds.map((fund) => (
            <li key={fund.name}>
              <strong>{fund.name}</strong>
              <span>
                <span className="badge" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning-dark)', textTransform: 'none' }}>
                  {fund.type}
                </span>
                <strong className="trend-positive">{fund.yield} Yield</strong>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


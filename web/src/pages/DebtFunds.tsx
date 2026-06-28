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
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Debt Funds</h1>
          <p>Track fixed income and debt fund portfolios with risk and return measures.</p>
        </div>
        <button 
          onClick={handleRefresh}
          style={{
            padding: '8px 16px',
            background: '#5e72ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔄 Refresh
        </button>
      </div>
      {lastUpdate && (
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      )}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading debt fund data...</div>
      ) : (
        <ul className="fund-list">
          {funds.map((fund) => (
            <li key={fund.name}>
              <strong>{fund.name}</strong>
              <span>{fund.type}, {fund.yield} yield</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

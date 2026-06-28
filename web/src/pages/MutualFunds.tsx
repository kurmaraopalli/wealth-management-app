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
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Mutual Funds</h1>
          <p>Review your mutual fund schemes and asset allocation across categories.</p>
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
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading mutual fund data...</div>
      ) : (
        <ul className="fund-list">
          {funds.map((fund) => (
            <li key={fund.name}>
              <strong>{fund.name}</strong>
              <span>{fund.category}, {fund.ytd} YTD</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

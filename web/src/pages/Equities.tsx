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
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Equities</h1>
          <p>Manage your equity holdings, watch top stocks, and review recent performance.</p>
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
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading stock data...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Country</th>
              <th>Quantity</th>
              <th>Current Price</th>
              <th>Gain / Loss</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.symbol}>
                <td>{company.symbol}</td>
                <td>{company.name}</td>
                <td>{company.country}</td>
                <td>{company.quantity}</td>
                <td>{company.price}</td>
                <td>{company.gain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

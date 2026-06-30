import { useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { getStockData, type StockData } from '../services/marketData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export default function Equities() {
  const [companies, setCompanies] = useState<StockData[]>([]);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setCompanies(await getStockData());
  }, []);

  const { loading, refreshing, lastUpdate, handleForceRefresh } = useAutoRefresh(loadData);

  const filtered = companies.filter(
    (c) =>
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const indiaStocks = filtered.filter((c) => c.country === 'India');
  const usStocks = filtered.filter((c) => c.country === 'US');
  const chinaStocks = filtered.filter((c) => c.country === 'China');

  const renderTable = (stocks: StockData[], title: string) => {
    if (stocks.length === 0) return null;
    return (
      <div className="equity-section">
        <h2>{title}</h2>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Day Chg</th>
                <th>YTD Gain</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((company) => (
                <tr key={company.symbol}>
                  <td><strong>{company.symbol}</strong></td>
                  <td>{company.name}</td>
                  <td>{company.quantity}</td>
                  <td>{company.price}</td>
                  <td className={company.dayChangeNum >= 0 ? 'trend-positive' : 'trend-negative'}>
                    {company.dayChange}
                  </td>
                  <td className={company.gainNum >= 0 ? 'trend-positive' : 'trend-negative'}>
                    {company.gain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <section className="fade-up">
      <PageHeader
        title="Indian & US Equities"
        description="Live stock holdings with day change and YTD performance — auto-refreshes every 5 minutes."
        lastUpdate={lastUpdate}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleForceRefresh}
      />

      <div className="card-controls" style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search symbol, company, or market…"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
      </div>

      {loading ? (
        <div className="page-loading">Loading live stock data…</div>
      ) : (
        <>
          {renderTable(indiaStocks, '🇮🇳 Indian Equities (NSE)')}
          {renderTable(usStocks, '🇺🇸 US Equities')}
          {renderTable(chinaStocks, '🇨🇳 China ADRs')}
          {filtered.length === 0 && (
            <div className="page-loading">No holdings match your search.</div>
          )}
        </>
      )}
    </section>
  );
}

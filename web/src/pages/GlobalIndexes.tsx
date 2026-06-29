import { useState } from 'react';

const indexes = [
  { name: 'S&P 500', region: 'United States', flag: '🇺🇸' },
  { name: 'NASDAQ Composite', region: 'United States', flag: '🇺🇸' },
  { name: 'Dow Jones Industrial Average', region: 'United States', flag: '🇺🇸' },
  { name: 'FTSE 100', region: 'United Kingdom', flag: '🇬🇧' },
  { name: 'DAX', region: 'Germany', flag: '🇩🇪' },
  { name: 'CAC 40', region: 'France', flag: '🇫🇷' },
  { name: 'Nikkei 225', region: 'Japan', flag: '🇯🇵' },
  { name: 'Hang Seng', region: 'Hong Kong', flag: '🇭🇰' },
  { name: 'Shanghai Composite', region: 'China', flag: '🇨🇳' },
  { name: 'BSE Sensex', region: 'India', flag: '🇮🇳' },
  { name: 'Nifty 50', region: 'India', flag: '🇮🇳' },
  { name: 'ASX 200', region: 'Australia', flag: '🇦🇺' },
  { name: 'TSX Composite', region: 'Canada', flag: '🇨🇦' },
  { name: 'Euro Stoxx 50', region: 'Eurozone', flag: '🇪🇺' },
  { name: 'MSCI World', region: 'Global', flag: '🌐' },
];

export default function GlobalIndexes() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndexes = indexes.filter(idx => 
    idx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idx.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1>Global Stock Indexes</h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Explore benchmarks, equity tickers, and index definitions across global financial regions.
          </p>
        </div>
        <div className="control-group">
          <input 
            type="text" 
            placeholder="Search index or region..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: '240px' }}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Index Benchmark</th>
              <th>Geographical Region</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndexes.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No global indexes match your search query.
                </td>
              </tr>
            ) : (
              filteredIndexes.map((index) => (
                <tr key={index.name}>
                  <td><strong>{index.name}</strong></td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{index.flag}</span>
                      <span>{index.region}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}


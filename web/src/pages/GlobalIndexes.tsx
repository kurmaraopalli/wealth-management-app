const indexes = [
  { name: 'S&P 500', region: 'United States' },
  { name: 'NASDAQ Composite', region: 'United States' },
  { name: 'Dow Jones Industrial Average', region: 'United States' },
  { name: 'FTSE 100', region: 'United Kingdom' },
  { name: 'DAX', region: 'Germany' },
  { name: 'CAC 40', region: 'France' },
  { name: 'Nikkei 225', region: 'Japan' },
  { name: 'Hang Seng', region: 'Hong Kong' },
  { name: 'Shanghai Composite', region: 'China' },
  { name: 'BSE Sensex', region: 'India' },
  { name: 'Nifty 50', region: 'India' },
  { name: 'ASX 200', region: 'Australia' },
  { name: 'TSX Composite', region: 'Canada' },
  { name: 'Euro Stoxx 50', region: 'Eurozone' },
  { name: 'MSCI World', region: 'Global' },
];

export default function GlobalIndexes() {
  return (
    <section>
      <h1>Global Stock Indexes</h1>
      <p>Explore major global stock indexes across the world.</p>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {indexes.map((index) => (
            <tr key={index.name}>
              <td>{index.name}</td>
              <td>{index.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

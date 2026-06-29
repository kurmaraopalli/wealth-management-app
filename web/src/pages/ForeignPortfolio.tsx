const equityCompanies = [
  { name: 'Apple Inc.', ticker: 'AAPL', region: 'US Tech' },
  { name: 'Microsoft Corp.', ticker: 'MSFT', region: 'US Tech' },
  { name: 'Amazon.com Inc.', ticker: 'AMZN', region: 'US Consumer' },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', region: 'US Tech' },
  { name: 'Tesla Inc.', ticker: 'TSLA', region: 'US Automotive' },
  { name: 'Nestlé S.A.', ticker: 'NESN', region: 'Europe Consumer' },
  { name: 'ASML Holding', ticker: 'ASML', region: 'Europe Tech' },
  { name: 'Samsung Electronics', ticker: '005930.KS', region: 'Asia Tech' },
  { name: 'Toyota Motor', ticker: '7203.T', region: 'Asia Automotive' },
  { name: 'Roche Holding', ticker: 'ROG.SW', region: 'Europe Healthcare' },
];

const debtIssuers = [
  { issuer: 'US Treasury', rating: 'AA+', assetClass: 'Sovereign Debt' },
  { issuer: 'German Bund', rating: 'AAA', assetClass: 'Sovereign Debt' },
  { issuer: 'Japan Government Bond', rating: 'A+', assetClass: 'Sovereign Debt' },
  { issuer: 'UK Gilt', rating: 'AA', assetClass: 'Sovereign Debt' },
  { issuer: 'France OAT', rating: 'AA', assetClass: 'Sovereign Debt' },
  { issuer: 'Australia Government Bond', rating: 'AAA', assetClass: 'Sovereign Debt' },
  { issuer: 'Canada Government Bond', rating: 'AAA', assetClass: 'Sovereign Debt' },
  { issuer: 'Singapore Government Bond', rating: 'AAA', assetClass: 'Sovereign Debt' },
  { issuer: 'World Bank Bond', rating: 'AAA', assetClass: 'Supranational' },
  { issuer: 'Toyota Motor Credit Bond', rating: 'AAA', assetClass: 'Corporate Debt' },
];

export default function ForeignPortfolio() {
  return (
    <section className="fade-up">
      <div>
        <h1>International Assets</h1>
        <p className="section-desc">
          Monitor offshore holdings, geographical exposure, and portfolio diversification across currencies.
        </p>
      </div>

      <div className="card-grid">
        <article className="dashboard-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.5rem' }}>🌍</span>
            <h2 style={{ margin: 0 }}>Global Equities</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Equity exposure across premium US tech conglomerates and European/Asian industry leaders.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {equityCompanies.map((company) => (
              <li key={company.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{company.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{company.ticker}</div>
                </div>
                <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {company.region}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <h2 style={{ margin: 0 }}>Global Fixed Income</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Fixed-income exposure across international sovereign government issues and premium rated corporate credits.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {debtIssuers.map((issuer) => (
              <li key={issuer.issuer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{issuer.issuer}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issuer.assetClass}</div>
                </div>
                <span className="badge" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-dark)' }}>
                  {issuer.rating} Rating
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}


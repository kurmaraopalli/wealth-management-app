const equityCompanies = [
  'Apple Inc. (AAPL)',
  'Microsoft Corp. (MSFT)',
  'Amazon.com Inc. (AMZN)',
  'Alphabet Inc. (GOOGL)',
  'Tesla Inc. (TSLA)',
  'Nestlé S.A. (NESN)',
  'ASML Holding (ASML)',
  'Samsung Electronics (005930.KS)',
  'Toyota Motor (7203.T)',
  'Roche Holding (ROG.SW)',
];

const debtIssuers = [
  'US Treasury',
  'German Bund',
  'Japan Government Bond',
  'UK Gilt',
  'France OAT',
  'Australia Government Bond',
  'Canada Government Bond',
  'Singapore Government Bond',
  'World Bank Bond',
  'Toyota Motor Credit Bond',
];

export default function ForeignPortfolio() {
  return (
    <section>
      <h1>Foreign Portfolio</h1>
      <p>Monitor international holdings and diversification across currencies.</p>
      <div className="card-grid">
        <article className="card">
          <h2>Global Equity</h2>
          <p>US, Europe, and Asia stock exposure.</p>
          <ul>
            {equityCompanies.map((company) => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2>Global Debt</h2>
          <p>Foreign bond issuers and high-quality debt exposure.</p>
          <ul>
            {debtIssuers.map((issuer) => (
              <li key={issuer}>{issuer}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

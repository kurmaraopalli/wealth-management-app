export default function Home() {
  return (
    <section>
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Invest with confidence</span>
          <h1>Welcome to Wealth Manager</h1>
          <p>
            Track your portfolio across equities, mutual funds, debt funds, and foreign assets. Enjoy modern charts,
            animated market signals, and an intuitive dashboard built for every investor.
          </p>
        </div>
        <div className="hero-visual">
          <div className="ticker-card">
            <div className="ticker-header">
              <span>Global Market Pulse</span>
              <span className="ticker-badge">Live</span>
            </div>
            <div className="ticker-row positive">
              <span>NASDAQ</span>
              <span>+1.48%</span>
            </div>
            <div className="ticker-row negative">
              <span>Sensex</span>
              <span>-0.32%</span>
            </div>
            <div className="ticker-row positive">
              <span>FTSE 100</span>
              <span>+0.78%</span>
            </div>
          </div>
          <div className="logo-cloud">
            <div className="logo-chip logo-apple">🍎</div>
            <div className="logo-chip logo-google">🔎</div>
            <div className="logo-chip logo-tesla">⚡</div>
            <div className="logo-chip logo-microsoft">🪟</div>
            <div className="logo-chip logo-btc">💹</div>
          </div>
        </div>
      </div>
      <div className="card-grid home-card-grid">
        <article className="card fade-up">
          <div className="card-icon">📈</div>
          <h2>Equities</h2>
          <p>View stock holdings and market performance for your equity portfolio.</p>
        </article>
        <article className="card fade-up delay-1">
          <div className="card-icon">💼</div>
          <h2>Mutual Funds</h2>
          <p>Monitor your mutual fund allocations, returns, and scheme details.</p>
        </article>
        <article className="card fade-up delay-2">
          <div className="card-icon">🏛️</div>
          <h2>Debt Funds</h2>
          <p>Analyze fixed income holdings and debt fund performance.</p>
        </article>
        <article className="card fade-up delay-3">
          <div className="card-icon">🌍</div>
          <h2>Foreign Portfolio</h2>
          <p>See international investments and currency diversified holdings.</p>
        </article>
      </div>
    </section>
  );
}

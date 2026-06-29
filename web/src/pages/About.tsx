export default function About() {
  return (
    <section className="fade-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '12px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1>About the Platform</h1>
        <p className="section-desc" style={{ margin: '0 auto', maxWidth: '600px' }}>
          Learn about the developer, the development stack, and core goals of WealthFlow.
        </p>
      </div>

      <div className="dashboard-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ fontSize: '3rem', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            👦
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Khavish</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Founder & Lead Developer • 6th Grade Student
            </p>
          </div>
        </div>

        <p>
          Hi, I am Khavish! I am a developer studying in the 6th grade. I created <strong>WealthFlow</strong> as a project 
          to merge programming concepts with finance dashboard ideas.
        </p>
        <p>
          WealthFlow is a wealth management portfolio tracker designed to aggregate multiple asset classes. 
          The application helps monitor holdings across Indian Equities, Mutual Funds, Fixed Income Debt, and Foreign Stocks.
        </p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-icon" style={{ marginBottom: '12px' }}>💻</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>Technology Stack</h3>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            Built using modern web technologies: React, TypeScript, React Router, Vite, and highly responsive custom CSS layouts.
          </p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div className="card-icon" style={{ marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>Platform Features</h3>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            Features responsive navigations, sliding drawers, SVG donut charting, index filtering, and automatic mock-caching algorithms.
          </p>
        </div>
      </div>
    </section>
  );
}


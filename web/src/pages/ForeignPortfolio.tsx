import { useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { getForeignEquities, getForeignDebt, type ForeignEquityData, type ForeignDebtData } from '../services/marketData';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export default function ForeignPortfolio() {
  const [equities, setEquities] = useState<ForeignEquityData[]>([]);
  const [debt, setDebt] = useState<ForeignDebtData[]>([]);

  const loadData = useCallback(async () => {
    const [eq, dt] = await Promise.all([getForeignEquities(), getForeignDebt()]);
    setEquities(eq);
    setDebt(dt);
  }, []);

  const { loading, refreshing, lastUpdate, handleForceRefresh } = useAutoRefresh(loadData);

  return (
    <section className="fade-up">
      <PageHeader
        title="International Assets"
        description="Offshore equities with live prices and sovereign debt yields — updated on every sync."
        lastUpdate={lastUpdate}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleForceRefresh}
      />

      {loading ? (
        <div className="page-loading">Loading international portfolio data…</div>
      ) : (
        <div className="card-grid foreign-grid">
          <article className="dashboard-card foreign-card">
            <div className="dashboard-card-header">
              <h2><span>🌍</span> Global Equities</h2>
              <span className="live-badge"><span className="live-dot" /> Live prices</span>
            </div>
            <p className="section-desc">US tech, European industrials, and Asian market leaders.</p>
            <ul className="foreign-list">
              {equities.map((company) => (
                <li key={company.ticker} className="foreign-list-item">
                  <div className="foreign-list-info">
                    <strong>{company.name}</strong>
                    <span className="cell-sub">{company.ticker}</span>
                  </div>
                  <div className="foreign-list-data">
                    <span className="foreign-price">{company.price}</span>
                    <span className={company.isPositive ? 'trend-positive' : 'trend-negative'}>
                      {company.change}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'none' }}>
                      {company.region}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="dashboard-card foreign-card">
            <div className="dashboard-card-header">
              <h2><span>🏛️</span> Global Fixed Income</h2>
              <span className="live-badge"><span className="live-dot" /> Live yields</span>
            </div>
            <p className="section-desc">Sovereign and corporate debt across major economies.</p>
            <ul className="foreign-list">
              {debt.map((issuer) => (
                <li key={issuer.issuer} className="foreign-list-item">
                  <div className="foreign-list-info">
                    <strong>{issuer.issuer}</strong>
                    <span className="cell-sub">{issuer.assetClass}</span>
                  </div>
                  <div className="foreign-list-data">
                    <span className="foreign-price trend-positive">{issuer.yield}</span>
                    <span className="badge" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-dark)' }}>
                      {issuer.rating}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}

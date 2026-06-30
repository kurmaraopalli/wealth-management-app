import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  lastUpdate?: Date | null;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  lastUpdate,
  loading,
  refreshing,
  onRefresh,
  children,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-copy">
        <h1>{title}</h1>
        <p className="section-desc">{description}</p>
        {lastUpdate && (
          <div className="data-status">
            <span className={`live-dot ${loading ? 'live-dot-loading' : ''}`} />
            <span>
              {loading ? 'Fetching latest data…' : `Updated ${lastUpdate.toLocaleString()}`}
            </span>
          </div>
        )}
      </div>
      <div className="page-header-actions">
        {children}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn btn-primary"
            disabled={refreshing || loading}
          >
            {refreshing ? '⟳ Refreshing…' : '🔄 Refresh Live Data'}
          </button>
        )}
      </div>
    </div>
  );
}

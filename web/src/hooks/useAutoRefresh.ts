import { useCallback, useEffect, useRef, useState } from 'react';
import { getLastUpdateTime, forceRefreshAll } from '../services/marketData';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function useAutoRefresh(onRefresh: () => Promise<void>) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const onRefreshRef = useRef(onRefresh);

  onRefreshRef.current = onRefresh;

  const load = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      await onRefreshRef.current();
      setLastUpdate(getLastUpdateTime());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleForceRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await forceRefreshAll();
      await onRefreshRef.current();
      setLastUpdate(getLastUpdateTime());
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { loading, refreshing, lastUpdate, handleForceRefresh, reload: () => load(true) };
}

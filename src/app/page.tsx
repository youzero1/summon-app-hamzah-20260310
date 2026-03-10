'use client';

import Calculator from '@/components/Calculator';
import History from '@/components/History';
import { useState, useCallback } from 'react';
import { CalculationRecord } from '@/types';

export default function Home() {
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [history, setHistory] = useState<CalculationRecord[]>([]);

  const refreshHistory = useCallback(() => {
    setHistoryRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">🧮 Calculator</h1>
      <div className="main-content">
        <Calculator onCalculation={refreshHistory} />
        <History key={historyRefreshKey} history={history} setHistory={setHistory} />
      </div>
    </div>
  );
}

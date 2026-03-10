'use client';

import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { CalculationRecord } from '@/types';

interface HistoryProps {
  history: CalculationRecord[];
  setHistory: Dispatch<SetStateAction<CalculationRecord[]>>;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString();
  } catch {
    return dateStr;
  }
}

export default function History({ history, setHistory }: HistoryProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/calculations');
        const json = await res.json();
        if (json.success) {
          setHistory(json.data);
        } else {
          setError(json.error || 'Failed to load history');
        }
      } catch {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [setHistory]);

  const handleClear = async () => {
    try {
      const res = await fetch('/api/calculations', { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setHistory([]);
      }
    } catch {
      console.error('Failed to clear history');
    }
  };

  return (
    <div className="history">
      <div className="history-header">
        <span className="history-title">History</span>
        {history.length > 0 && (
          <button className="history-clear-btn" onClick={handleClear}>
            Clear All
          </button>
        )}
      </div>
      <div className="history-list">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="history-empty">{error}</div>
        ) : history.length === 0 ? (
          <div className="history-empty">No calculations yet.</div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-expression">{item.expression} =</div>
              <div className="history-item-result">{item.result}</div>
              <div className="history-item-date">{formatDate(item.createdAt)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

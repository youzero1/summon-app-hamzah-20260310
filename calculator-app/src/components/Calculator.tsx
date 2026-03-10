'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import Button from './Button';

interface CalculationRecord {
  id: number;
  operand1: number;
  operand2: number;
  operator: string;
  result: number;
  createdAt: string;
}

type Operator = '+' | '-' | '*' | '/';

const OPERATOR_DISPLAY: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

export default function Calculator() {
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousInput, setPreviousInput] = useState<string>('');
  const [operator, setOperator] = useState<Operator | null>(null);
  const [shouldResetInput, setShouldResetInput] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch('/api/calculations');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: CalculationRecord[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getExpression = (): string => {
    if (operator && previousInput) {
      return `${previousInput} ${OPERATOR_DISPLAY[operator]}`;
    }
    return '';
  };

  const handleDigit = (digit: string) => {
    if (isError) {
      setCurrentInput(digit);
      setIsError(false);
      setShouldResetInput(false);
      return;
    }

    if (shouldResetInput) {
      setCurrentInput(digit);
      setShouldResetInput(false);
      return;
    }

    if (currentInput === '0' && digit !== '.') {
      setCurrentInput(digit);
      return;
    }

    if (digit === '.' && currentInput.includes('.')) return;

    setCurrentInput((prev) => prev + digit);
  };

  const handleOperator = (op: Operator) => {
    if (isError) return;

    const current = parseFloat(currentInput);
    if (isNaN(current)) return;

    if (operator && !shouldResetInput) {
      // Chain calculation
      performCalculation(op);
      return;
    }

    setPreviousInput(currentInput);
    setOperator(op);
    setShouldResetInput(true);
  };

  const performCalculation = async (nextOperator?: Operator) => {
    if (!operator || !previousInput) return;

    const operand1 = parseFloat(previousInput);
    const operand2 = parseFloat(currentInput);

    if (isNaN(operand1) || isNaN(operand2)) return;

    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operand1, operand2, operator }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'Division by zero') {
          setCurrentInput('Cannot divide by zero');
          setIsError(true);
        } else {
          setCurrentInput('Error');
          setIsError(true);
        }
        setOperator(null);
        setPreviousInput('');
        setShouldResetInput(true);
        return;
      }

      const resultStr = formatResult(data.result);
      setCurrentInput(resultStr);

      if (nextOperator) {
        setPreviousInput(resultStr);
        setOperator(nextOperator);
        setShouldResetInput(true);
      } else {
        setOperator(null);
        setPreviousInput('');
        setShouldResetInput(true);
      }

      fetchHistory();
    } catch (err) {
      console.error('Calculation error:', err);
      setCurrentInput('Error');
      setIsError(true);
      setOperator(null);
      setPreviousInput('');
      setShouldResetInput(true);
    }
  };

  const formatResult = (num: number): string => {
    if (Number.isInteger(num)) return String(num);
    const str = num.toPrecision(10).replace(/\.?0+$/, '');
    return str;
  };

  const handleEquals = () => {
    if (!operator || !previousInput || isError) return;
    performCalculation();
  };

  const handleClear = () => {
    setCurrentInput('0');
    setPreviousInput('');
    setOperator(null);
    setShouldResetInput(false);
    setIsError(false);
  };

  const handleClearHistory = async () => {
    try {
      await fetch('/api/calculations', { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatOperatorDisplay = (op: string): string => {
    const map: Record<string, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return map[op] || op;
  };

  return (
    <div className="calculator-wrapper">
      {/* Calculator */}
      <div className="calculator">
        <Display
          currentValue={currentInput}
          expression={getExpression()}
          isError={isError}
        />
        <div className="button-grid">
          <Button label="C" onClick={handleClear} variant="clear" />
          <Button label="±" onClick={() => {
            if (!isError) setCurrentInput(prev => String(parseFloat(prev) * -1));
          }} variant="clear" />
          <Button label="%" onClick={() => {
            if (!isError) setCurrentInput(prev => String(parseFloat(prev) / 100));
          }} variant="clear" />
          <Button label="÷" onClick={() => handleOperator('/')} variant="operator" />

          <Button label="7" onClick={() => handleDigit('7')} variant="number" />
          <Button label="8" onClick={() => handleDigit('8')} variant="number" />
          <Button label="9" onClick={() => handleDigit('9')} variant="number" />
          <Button label="×" onClick={() => handleOperator('*')} variant="operator" />

          <Button label="4" onClick={() => handleDigit('4')} variant="number" />
          <Button label="5" onClick={() => handleDigit('5')} variant="number" />
          <Button label="6" onClick={() => handleDigit('6')} variant="number" />
          <Button label="−" onClick={() => handleOperator('-')} variant="operator" />

          <Button label="1" onClick={() => handleDigit('1')} variant="number" />
          <Button label="2" onClick={() => handleDigit('2')} variant="number" />
          <Button label="3" onClick={() => handleDigit('3')} variant="number" />
          <Button label="+" onClick={() => handleOperator('+')} variant="operator" />

          <Button label="0" onClick={() => handleDigit('0')} variant="number" spanTwo />
          <Button label="." onClick={() => handleDigit('.')} variant="number" />
          <Button label="=" onClick={handleEquals} variant="equals" />
        </div>
      </div>

      {/* History Panel */}
      <div className="history-panel">
        <div className="history-panel__header">
          <span className="history-panel__title">History</span>
          {history.length > 0 && (
            <button
              className="history-panel__clear-btn"
              onClick={handleClearHistory}
            >
              Clear All
            </button>
          )}
        </div>
        <div className="history-panel__list">
          {historyLoading ? (
            <div className="history-panel__loading">Loading...</div>
          ) : history.length === 0 ? (
            <div className="history-panel__empty">No calculations yet</div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item">
                <span className="history-item__expression">
                  {item.operand1} {formatOperatorDisplay(item.operator)} {item.operand2}
                </span>
                <span className="history-item__result">= {item.result}</span>
                <span className="history-item__time">{formatTime(item.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

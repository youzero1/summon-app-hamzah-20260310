'use client';

import { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';

interface CalculatorProps {
  onCalculation: () => void;
}

type ButtonConfig = {
  label: string;
  type: 'number' | 'operator' | 'equals' | 'clear';
  value: string;
  className?: string;
};

const BUTTONS: ButtonConfig[] = [
  { label: 'C', type: 'clear', value: 'clear' },
  { label: '±', type: 'operator', value: 'negate' },
  { label: '%', type: 'operator', value: '%' },
  { label: '÷', type: 'operator', value: '/' },
  { label: '7', type: 'number', value: '7' },
  { label: '8', type: 'number', value: '8' },
  { label: '9', type: 'number', value: '9' },
  { label: '×', type: 'operator', value: '*' },
  { label: '4', type: 'number', value: '4' },
  { label: '5', type: 'number', value: '5' },
  { label: '6', type: 'number', value: '6' },
  { label: '-', type: 'operator', value: '-' },
  { label: '1', type: 'number', value: '1' },
  { label: '2', type: 'number', value: '2' },
  { label: '3', type: 'number', value: '3' },
  { label: '+', type: 'operator', value: '+' },
  { label: '0', type: 'number', value: '0', className: 'zero' },
  { label: '.', type: 'number', value: '.' },
  { label: '=', type: 'equals', value: 'equals' },
];

const formatOperator = (op: string): string => {
  switch (op) {
    case '*': return '×';
    case '/': return '÷';
    default: return op;
  }
};

const isOperator = (val: string) => ['+', '-', '*', '/'].includes(val);

interface CalcState {
  displayValue: string;
  expression: string;
  operator: string | null;
  previousValue: string | null;
  waitingForOperand: boolean;
  hasError: boolean;
  justEvaluated: boolean;
}

const initialState: CalcState = {
  displayValue: '0',
  expression: '',
  operator: null,
  previousValue: null,
  waitingForOperand: false,
  hasError: false,
  justEvaluated: false,
};

function performOperation(a: number, b: number, op: string): number | 'DIV_ZERO' {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) return 'DIV_ZERO';
      return a / b;
    default: return b;
  }
}

function formatResult(value: number): string {
  if (!isFinite(value)) return 'Error';
  const str = value.toPrecision(12);
  const parsed = parseFloat(str);
  return String(parsed);
}

export default function Calculator({ onCalculation }: CalculatorProps) {
  const [state, setState] = useState<CalcState>(initialState);

  const saveCalculation = useCallback(async (expression: string, result: string) => {
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      onCalculation();
    } catch (err) {
      console.error('Failed to save calculation:', err);
    }
  }, [onCalculation]);

  const handleButton = useCallback((value: string) => {
    setState((prev) => {
      if (prev.hasError && value !== 'clear') {
        return prev;
      }

      // Clear
      if (value === 'clear') {
        return { ...initialState };
      }

      // Negate
      if (value === 'negate') {
        if (prev.displayValue === '0') return prev;
        const negated = prev.displayValue.startsWith('-')
          ? prev.displayValue.slice(1)
          : '-' + prev.displayValue;
        return { ...prev, displayValue: negated };
      }

      // Percent
      if (value === '%') {
        const val = parseFloat(prev.displayValue);
        if (isNaN(val)) return prev;
        const result = val / 100;
        return {
          ...prev,
          displayValue: formatResult(result),
          waitingForOperand: false,
        };
      }

      // Operator
      if (isOperator(value)) {
        const current = parseFloat(prev.displayValue);

        if (prev.operator && !prev.waitingForOperand && prev.previousValue !== null) {
          // Chain operation
          const prev2 = parseFloat(prev.previousValue);
          const opResult = performOperation(prev2, current, prev.operator);
          if (opResult === 'DIV_ZERO') {
            return {
              ...prev,
              displayValue: 'Cannot divide by zero',
              expression: '',
              hasError: true,
              waitingForOperand: false,
              operator: null,
              previousValue: null,
              justEvaluated: false,
            };
          }
          const resultStr = formatResult(opResult);
          const expr = `${prev.expression} ${formatOperator(prev.operator)} ${prev.displayValue} ${formatOperator(value)}`;
          return {
            ...prev,
            displayValue: resultStr,
            expression: expr,
            operator: value,
            previousValue: resultStr,
            waitingForOperand: true,
            justEvaluated: false,
          };
        }

        const expr = prev.justEvaluated
          ? `${prev.displayValue} ${formatOperator(value)}`
          : (prev.expression
            ? prev.expression.replace(/[+\-×÷]\s*$/, '').trimEnd() + ` ${formatOperator(value)}`
            : `${prev.displayValue} ${formatOperator(value)}`);

        return {
          ...prev,
          operator: value,
          previousValue: prev.displayValue,
          waitingForOperand: true,
          expression: expr,
          justEvaluated: false,
        };
      }

      // Equals
      if (value === 'equals') {
        if (prev.operator === null || prev.previousValue === null) return prev;

        const a = parseFloat(prev.previousValue);
        const b = parseFloat(prev.displayValue);
        const opResult = performOperation(a, b, prev.operator);

        if (opResult === 'DIV_ZERO') {
          return {
            ...prev,
            displayValue: 'Cannot divide by zero',
            expression: '',
            hasError: true,
            waitingForOperand: false,
            operator: null,
            previousValue: null,
            justEvaluated: false,
          };
        }

        const resultStr = formatResult(opResult);
        const fullExpression = `${prev.expression} ${prev.displayValue}`;

        // Save to DB asynchronously
        setTimeout(() => {
          saveCalculation(fullExpression.trim(), resultStr);
        }, 0);

        return {
          ...prev,
          displayValue: resultStr,
          expression: fullExpression,
          operator: null,
          previousValue: null,
          waitingForOperand: false,
          justEvaluated: true,
        };
      }

      // Decimal
      if (value === '.') {
        if (prev.waitingForOperand) {
          return {
            ...prev,
            displayValue: '0.',
            waitingForOperand: false,
          };
        }
        if (prev.displayValue.includes('.')) return prev;
        return {
          ...prev,
          displayValue: prev.displayValue + '.',
          justEvaluated: false,
        };
      }

      // Digit
      if (prev.waitingForOperand || prev.justEvaluated) {
        return {
          ...prev,
          displayValue: value,
          waitingForOperand: false,
          justEvaluated: false,
        };
      }

      const newDisplay =
        prev.displayValue === '0' ? value : prev.displayValue + value;

      return {
        ...prev,
        displayValue: newDisplay,
        justEvaluated: false,
      };
    });
  }, [saveCalculation]);

  return (
    <div className="calculator">
      <Display
        value={state.displayValue}
        expression={state.expression}
        hasError={state.hasError}
      />
      <div className="button-grid">
        {BUTTONS.map((btn) => (
          <Button
            key={btn.value + btn.label}
            label={btn.label}
            type={btn.type}
            className={btn.className}
            onClick={() => handleButton(btn.value)}
          />
        ))}
      </div>
    </div>
  );
}

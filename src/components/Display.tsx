interface DisplayProps {
  value: string;
  expression: string;
  hasError: boolean;
}

export default function Display({ value, expression, hasError }: DisplayProps) {
  return (
    <div className="display">
      <div className="display-expression">{expression || '\u00A0'}</div>
      <div className={`display-value${hasError ? ' error' : ''}`}>
        {value}
      </div>
    </div>
  );
}

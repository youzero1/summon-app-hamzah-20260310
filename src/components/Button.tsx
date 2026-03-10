interface ButtonProps {
  label: string;
  type: 'number' | 'operator' | 'equals' | 'clear';
  onClick: () => void;
  className?: string;
}

export default function Button({ label, type, onClick, className }: ButtonProps) {
  const classes = ['calc-btn', type, className].filter(Boolean).join(' ');
  return (
    <button className={classes} onClick={onClick} aria-label={label}>
      {label}
    </button>
  );
}

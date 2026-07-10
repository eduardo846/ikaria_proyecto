/**
 * Marca "Ikaria" (sol tras un arco). variant="light" para fondos oscuros,
 * variant="dark" para fondos claros.
 */
export default function Logo({ variant = 'dark', size = 26, wordSize = 14, tag }) {
  const arcColor = variant === 'light' ? '#F5F6F4' : '#12293F';
  const wordColor = variant === 'light' ? '#FFFFFF' : 'var(--aegean-deep)';
  return (
    <div className="mark">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="16" r="9" stroke="#D9A441" strokeWidth="2" />
        <path d="M8 34 V22 A12 12 0 0 1 32 22 V34" stroke={arcColor} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="mark-word" style={{ color: wordColor, fontSize: wordSize }}>
        Ikaria
        {tag && <span className="topbar__tag">{tag}</span>}
      </span>
    </div>
  );
}

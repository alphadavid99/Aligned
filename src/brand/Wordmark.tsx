/** TwoAgree wordmark — the mark IS the A. Never set the name as plain text "TwoAgree". */
import { Mark } from './Mark';

type WordmarkProps = {
  /** 'onLight' = claret type + claret mark.  'onClaret' = paper type + honey mark. */
  tone?: 'onLight' | 'onClaret';
  /** Font size of the wordmark. Number = px. */
  size?: number | string;
  className?: string;
};

export function Wordmark({ tone = 'onLight', size = 32, className }: WordmarkProps) {
  const onClaret = tone === 'onClaret';
  return (
    <span
      className={className}
      role="img"
      aria-label="TwoAgree"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: 'Inter, -apple-system, Helvetica, sans-serif',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color: onClaret ? 'var(--ta-paper)' : 'var(--ta-claret)',
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true">Two</span>
      <span aria-hidden="true" style={{ display: 'inline-block', margin: '0 0.015em', transform: 'translateY(0.015em)' }}>
        <Mark height="0.78em" colour={onClaret ? 'var(--ta-honey)' : 'var(--ta-claret)'} />
      </span>
      <span aria-hidden="true">gree</span>
    </span>
  );
}

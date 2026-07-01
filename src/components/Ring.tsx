// Progress rings — ported from ringSVG / pctRing in legacy/index.html.

export function ProgressRing({
  done,
  total,
  size = 116,
}: {
  done: number;
  total: number;
  size?: number;
}) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const frac = total ? done / total : 0;
  const dash = (circ * frac).toFixed(1);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0DEE2" strokeWidth="9" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--honey)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ.toFixed(0)}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.round(size * 0.2)}
        fontWeight="700"
        fill="var(--berry)"
        fontFamily="var(--font-ui)"
      >
        {done}/{total}
      </text>
    </svg>
  );
}

export function PctRing({
  pct,
  size = 160,
  color = "var(--honey)",
}: {
  pct: number;
  size?: number;
  color?: string;
}) {
  const sw = 12;
  const r = size / 2 - sw;
  const circ = 2 * Math.PI * r;
  const dash = ((circ * pct) / 100).toFixed(0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={sw} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ.toFixed(0)}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 - size * 0.04}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.round(size * 0.3)}
        fontWeight="700"
        letterSpacing="-0.5"
        fill="var(--berry)"
        fontFamily="var(--font-ui)"
      >
        {pct}%
      </text>
      <text
        x={size / 2}
        y={size / 2 + size * 0.18}
        textAnchor="middle"
        fontSize={Math.round(size * 0.092)}
        fill="var(--sub)"
        fontFamily="var(--font-ui)"
      >
        aligned
      </text>
    </svg>
  );
}

// Progress rings — ported from ringSVG / pctRing in legacy/index.html.
// The arc draws in and the number counts up on mount (a small, calm delight),
// unless the viewer prefers reduced motion.
import { useEffect, useRef, useState } from "react";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

// Drives a 0→1 value over `dur` ms with an ease-out curve, once on mount.
function useDraw(dur = 900): number {
  const reduced = useReducedMotion();
  const [p, setP] = useState(reduced ? 1 : 0);
  const raf = useRef(0);
  useEffect(() => {
    if (reduced) {
      setP(1);
      return;
    }
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / dur);
      setP(1 - Math.pow(1 - t, 3)); // easeOutCubic
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced, dur]);
  return p;
}

export function ProgressRing({
  done,
  total,
  size = 116,
}: {
  done: number;
  total: number;
  size?: number;
}) {
  const p = useDraw();
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const frac = total ? done / total : 0;
  const dash = (circ * frac * p).toFixed(1);
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
  label = "agreed",
}: {
  pct: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const p = useDraw();
  const sw = 12;
  const r = size / 2 - sw;
  const circ = 2 * Math.PI * r;
  const dash = ((circ * pct) / 100) * p;
  const shown = Math.round(pct * p);
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
        strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(0)}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={label ? size / 2 - size * 0.04 : size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.round(size * 0.3)}
        fontWeight="700"
        letterSpacing="-0.5"
        fill="var(--berry)"
        fontFamily="var(--font-ui)"
      >
        {shown}%
      </text>
      {label && (
        <text
          x={size / 2}
          y={size / 2 + size * 0.18}
          textAnchor="middle"
          fontSize={Math.round(size * 0.092)}
          fill="var(--sub)"
          fontFamily="var(--font-ui)"
        >
          {label}
        </text>
      )}
    </svg>
  );
}

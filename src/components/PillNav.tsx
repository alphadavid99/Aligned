import { useLayoutEffect, useRef, useState } from "react";

// The floating pill nav. The honey pill is a single indicator element that
// SLIDES to whichever tab you pick (left/width transition, measured after
// layout so it lands exactly under the grown active button). Buttons sit
// above it on their own layer.
export type NavItem = {
  key: string;
  label: string;
  Icon: (p: { size?: number }) => React.JSX.Element;
};

export function PillNav({
  items,
  active,
  onSelect,
}: {
  items: NavItem[];
  active: string;
  onSelect: (key: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null);

  // Re-measure whenever the active tab or the labels (language) change, and
  // on resize — the active button's width isn't known until it has grown.
  const labels = items.map((i) => i.label).join("|");
  useLayoutEffect(() => {
    const measure = () => {
      const el = navRef.current?.querySelector<HTMLElement>(".bnav-item.on");
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, labels]);

  return (
    <nav className="bnav" ref={navRef}>
      {ind && <span className="bnav-ind" style={ind} aria-hidden="true" />}
      {items.map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            type="button"
            className={`bnav-item ${on ? "on" : ""}`}
            onClick={() => onSelect(key)}
            aria-label={label}
            aria-current={on ? "page" : undefined}
          >
            <Icon size={on ? 17 : 21} />
            {on && <span>{label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

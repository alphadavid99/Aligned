// Small line icons. Stroke uses currentColor so callers set the colour.
type P = { size?: number };

const svg = (size: number, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconHome = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ));

export const IconDecks = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <path d="M7 8h6M7 12h6" />
      <path d="M20 7v11a2 2 0 0 1-2 2" />
    </>
  ));

export const IconResults = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 3v9h9" opacity="0.9" />
    </>
  ));

export const IconProfile = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ));

export const IconBack = ({ size = 24 }: P) =>
  svg(size, <path d="M15 5l-7 7 7 7" />);

export const IconSettings = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M4.2 7l2.6 1.5M17.2 15.5l2.6 1.5M4.2 17l2.6-1.5M17.2 8.5l2.6-1.5" />
    </>
  ));

export const IconClose = ({ size = 24 }: P) =>
  svg(size, (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ));

// Deck category glyphs, keyed by the `icon` field in the question bank.
// Rendered inside DecksScreen's category tile; stroke inherits the deck colour.
const DECK_GLYPHS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  coin: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  book: (
    <>
      <path d="M12 6c-1.8-1.3-4-2-6.5-2H4v14h1.5c2.5 0 4.7.7 6.5 2" />
      <path d="M12 6c1.8-1.3 4-2 6.5-2H20v14h-1.5c-2.5 0-4.7.7-6.5 2z" />
      <path d="M12 6v14" />
    </>
  ),
  chat: (
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2z" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  faith: (
    <>
      <path d="M12 3v18" />
      <path d="M6 9h12" />
    </>
  ),
  family: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M3 20c0-3 2.2-5 5-5s5 2 5 5" />
      <path d="M14 20c0-2.6 1-4.5 3.5-4.5S21 17.4 21 20" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.5-9.2-9C1.3 8 3 4.5 6.5 4.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 4.5 22.7 8 21.2 11 19 15.5 12 20 12 20z" />
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
      <path d="M5 19c3-4 6-6 10-8" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />,
  star: (
    <path d="M12 3l2.6 5.6 5.9.8-4.3 4 1 6-5.2-2.9L6.8 19.4l1-6-4.3-4 5.9-.8z" />
  ),
};

export const DeckIcon = ({ icon, size = 22 }: { icon: string; size?: number }) =>
  svg(size, DECK_GLYPHS[icon] ?? DECK_GLYPHS.star);

/** TwoAgree mark — the /\ . Exact vector paths from the original artwork; do not redraw. */

// Canonical square viewBox from the designer's identity page (twoagree-identity
// -claret.html, symbol #ta). The strokes sit inside this padded 220×220 box —
// do NOT crop to the tight path bounds, or the mark renders ~30% oversized and
// breaks the wordmark lockup.
const VIEW_BOX = '824 921 220 220';

const D1 =
  'M 899.862 924.822 L 931.116 924.873 C 924.792 948.339 914.369 977.735 906.723 1001.42 ' +
  'L 862.728 1137.09 L 831.598 1137.05 C 837.714 1114.43 847.64 1086.35 854.954 1063.72 L 899.862 924.822 z';
const D2 =
  'M 936.886 924.882 L 968.149 924.866 C 989.722 995.197 1015.72 1066.75 1036.41 1137.01 ' +
  'L 1005.08 1137.08 C 982.589 1067.65 957.822 994.521 936.886 924.882 z';

type MarkProps = {
  /** Rendered height. Number = px. Defaults to 1em so it scales with type. */
  height?: number | string;
  /** Rendered width. Defaults to a square (= height). The wordmark passes a
   *  narrower width (0.62em vs 0.78em height) so the mark reads as the letter A. */
  width?: number | string;
  /** Any CSS colour. Defaults to currentColor so the parent decides. */
  colour?: string;
  /** Omit for decorative use — the mark will be hidden from screen readers. */
  title?: string;
  className?: string;
};

export function Mark({ height = '1em', width, colour = 'currentColor', title, className }: MarkProps) {
  const h = typeof height === 'number' ? `${height}px` : height;
  const w =
    width == null
      ? h // square by default — the canonical viewBox is 220×220
      : typeof width === 'number'
        ? `${width}px`
        : width;
  return (
    <svg
      viewBox={VIEW_BOX}
      width={w}
      height={h}
      fill={colour}
      preserveAspectRatio="xMidYMid meet"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
    >
      <path d={D1} />
      <path d={D2} />
    </svg>
  );
}

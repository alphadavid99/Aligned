/** TwoAgree brand tokens. Mirrors tokens.css — keep the two in sync. */
export const brand = {
  claret:       '#3E1A2E',
  claretDeep:   '#2A1120',
  claretHover:  '#5C2E45',
  honey:        '#C6913C',
  honeyRaised:  '#DCB265',
  white:        '#FFFFFF',
  paper:        '#FBF6F0',
  blush:        '#F3DED6',
  ink:          '#2A1120',
  grey:         '#6B5A61',
  line:         '#EADFD8',
} as const;

export type BrandColour = keyof typeof brand;

/** The one colour rule: honey gold only ever sits on a claret ground.
 *  On paper it measures 2.6:1, on blush 2.1:1 — both fail. */
export const HONEY_GROUNDS: readonly string[] = [brand.claret, brand.claretDeep];

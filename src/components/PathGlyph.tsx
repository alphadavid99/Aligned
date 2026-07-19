// Waypoint glyphs for the trail map — Lucide icons, keyed by the `glyph` id in
// data/path.json. Swapping an icon is a one-line change to GLYPHS. Colour is set
// via `style` (currentColor), not the `color` prop, because CSS var() resolves
// in style but not in the SVG stroke attribute Lucide's `color` prop writes.
import {
  Signpost,
  Split,
  Wallet,
  UtensilsCrossed,
  Flower2,
  Mountain,
  Church,
  Sunrise,
  MountainSnow,
  Telescope,
  Lamp,
  type LucideIcon,
} from "lucide-react";

const GLYPHS: Record<string, LucideIcon> = {
  "g-trailhead": Signpost,
  "g-fork": Split,
  "g-storehouse": Wallet,
  "g-table": UtensilsCrossed,
  "g-garden": Flower2,
  "g-valley": Mountain,
  "g-hilltop": Church,
  "g-horizon": Sunrise,
  "g-summit": MountainSnow,
  "g-lookout": Telescope,
  "g-lamp": Lamp,
};

export function PathGlyph({
  id,
  size = 28,
  color = "currentColor",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  const Icon = GLYPHS[id] ?? Signpost;
  return <Icon size={size} strokeWidth={2} style={{ color }} aria-hidden="true" />;
}

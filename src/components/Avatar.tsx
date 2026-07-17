// A round avatar: the person's photo when we have it, otherwise their initial
// on a brand-tinted disc. Partner photos aren't reachable client-side (rules
// lock users/{uid} to its owner and the session only carries name + uid), so
// on shared screens this falls back to the initial — the app's real fallback.
type Tone = "berry" | "honey";

const TONE_BG: Record<Tone, string> = {
  berry: "var(--berry)",
  honey: "var(--honeyD)",
};

export function Avatar({
  name,
  photo,
  size = 46,
  tone = "berry",
  ring = true,
}: {
  name?: string;
  photo?: string | null;
  size?: number;
  tone?: Tone;
  ring?: boolean;
}) {
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className="avatar-disc"
      style={{
        width: size,
        height: size,
        background: photo ? "var(--ta-white)" : TONE_BG[tone],
        fontSize: Math.round(size * 0.42),
        borderWidth: ring ? Math.max(2, Math.round(size * 0.06)) : 0,
      }}
    >
      {photo ? <img src={photo} alt="" /> : initial}
    </div>
  );
}

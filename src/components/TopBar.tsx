import { Mark } from "../brand/Mark";
import { IconClose } from "./icons";

// In-flow header: the TwoAgree mark centred, with an optional close button so the
// user is never stranded (e.g. mid-questions). Answers are saved as you go, so
// leaving is always safe.
export function TopBar({ onExit }: { onExit?: () => void }) {
  return (
    <div className="topbar">
      <span className="topbar-slot" />
      <Mark height={26} title="TwoAgree" colour="var(--berry)" />
      <span className="topbar-slot topbar-slot--right">
        {onExit && (
          <button
            className="iconbtn"
            type="button"
            onClick={onExit}
            aria-label="Close and go home"
          >
            <IconClose size={22} />
          </button>
        )}
      </span>
    </div>
  );
}

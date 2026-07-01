import { useState } from "react";
import { createSession, joinSession } from "../lib/session";
import { setActiveCode } from "../lib/local";
import { prettyError } from "../lib/errors";

// Create a new session or join a partner's by code. The signed-in user's
// profile name rides into the member slot (the account graft).
export default function StartScreen({
  uid,
  name,
  onEnter,
}: {
  uid: string;
  name: string;
  onEnter: (code: string) => void;
}) {
  const [mode, setMode] = useState<"choose" | "join">("choose");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const enter = (c: string) => {
    setActiveCode(uid, c);
    onEnter(c);
  };

  const create = async () => {
    setErr("");
    setBusy(true);
    try {
      const c = await createSession(uid, name);
      enter(c);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  const join = async () => {
    setErr("");
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setErr("Enter the 4-character code your partner shared.");
      return;
    }
    setBusy(true);
    try {
      await joinSession(uid, name, c);
      enter(c);
    } catch {
      setErr("Couldn’t join — check the code and that no one else has joined.");
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 30 }}>
        The two of you
      </div>
      <h1 className="h1 center" style={{ marginTop: 8 }}>
        Start a session
      </h1>
      <p
        className="sub serif center"
        style={{ fontStyle: "italic", margin: "10px 20px 26px" }}
      >
        One of you creates it and shares the code; the other joins. You each
        answer on your own.
      </p>

      {mode === "choose" ? (
        <>
          <button className="btn" type="button" onClick={create} disabled={busy}>
            {busy ? "One moment…" : "Create a session →"}
          </button>
          <button
            className="btn out"
            type="button"
            onClick={() => {
              setErr("");
              setMode("join");
            }}
          >
            I have a code
          </button>
          {err && <div className="err">{err}</div>}
        </>
      ) : (
        <>
          <label htmlFor="code">Partner’s code</label>
          <input
            className="input"
            id="code"
            maxLength={4}
            autoCapitalize="characters"
            placeholder="ABCD"
            style={{ textTransform: "uppercase", letterSpacing: 4 }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {err && <div className="err">{err}</div>}
          <button className="btn" type="button" onClick={join} disabled={busy}>
            {busy ? "Joining…" : "Join →"}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setErr("");
              setMode("choose");
            }}
          >
            ← Back
          </button>
        </>
      )}
    </section>
  );
}

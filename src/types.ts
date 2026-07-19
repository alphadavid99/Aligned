// Shared data-model types. Mirrors the RTDB shape in CLAUDE.md §6.
import type { DeckData, Role } from "./lib/scoring";

export interface Profile {
  name: string;
  bio?: string;
  email?: string;
  photo?: string; // base64 JPEG data URL (~256px square)
  created?: number;
  updated?: number;
}

export interface Member {
  name: string;
  uid: string;
}

// Relationship stage, captured on the couple at pairing (brief §8). Stored on
// the session (not the individual) because it describes the two of you. Drives
// conversation ordering later, and eventually Paths — which are out of scope now.
export type Stage = "dating" | "engaged" | "married" | "blended";

// The generated Path curriculum, written server-side by the generatePath Cloud
// Function (clients read only). A step is a thin sequencer over existing
// question ids — never a new question store.
export interface PathStepData {
  key: string;
  mechanic: "guess" | "noguess";
  qids: string[];
}
export interface SessionPath {
  generatedAt?: number;
  version?: number;
  questionCount?: number;
  steps?: Record<string, PathStepData>;
}

export interface Session {
  created?: number;
  stage?: Stage;
  members?: Partial<Record<Role, Member>>;
  uids?: Record<string, boolean>;
  decks?: Record<string, DeckData>;
  path?: SessionPath;
  pathLamps?: Record<string, boolean>;
}

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

export interface Session {
  created?: number;
  members?: Partial<Record<Role, Member>>;
  uids?: Record<string, boolean>;
  decks?: Record<string, DeckData>;
}

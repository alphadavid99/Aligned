// Shared data-model types. Mirrors the RTDB shape in CLAUDE.md §6.

export interface Profile {
  name: string;
  bio?: string;
  email?: string;
  photo?: string; // base64 JPEG data URL (~256px square)
  created?: number;
  updated?: number;
}

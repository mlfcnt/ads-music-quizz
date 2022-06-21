import { Track } from "./api/spotify";

export type Guesses = Record<number, { correct: boolean | null }>;
export type ArtistForToday = {
  name: string;
  id: string;
  tracks: Track[];
};

export type Mode = "FREE" | "CLASSIC";

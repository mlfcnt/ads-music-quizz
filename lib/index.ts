import { Dispatch, SetStateAction } from "react";
import {
  MoodHappy,
  MoodSad,
  PlayerPlay,
  QuestionMark,
} from "tabler-icons-react";
import { fetchFreeplayArtist } from "../api/spotify";
import { ArtistForToday, Guesses } from "../types";

export const initGuesses = {
  1: {
    correct: null,
  },
  2: {
    correct: null,
  },
  3: {
    correct: null,
  },
  4: {
    correct: null,
  },
  5: {
    correct: null,
  },
};

const icons = {
  currentGuess: PlayerPlay,
  nextGuess: QuestionMark,
  goodGuess: MoodHappy,
  badGuess: MoodSad,
};

const isCurrent = (isCurrentGuess: boolean) => isCurrentGuess;
const isNext = (guess: any) => !guess || guess.correct === null;
const isWrong = (guess: any) => guess.correct === false;
const isCorrect = (guess: any) => guess.correct === true;

export const displayCorrectIcon = (guess: any, isCurrentGuess = false) => {
  if (isCurrent(isCurrentGuess)) return icons["currentGuess"];
  if (isNext(guess)) return icons["nextGuess"];
  if (isWrong(guess)) return icons["badGuess"];
  if (isCorrect(guess)) return icons["goodGuess"];
};

export const displayCorrectColor = (guess: any, isCurrentGuess = false) => {
  if (isCurrent(isCurrentGuess)) return "green";
  if (isNext(guess)) return "cyan";
  if (isWrong(guess)) return "red";
  if (isCorrect(guess)) return "green";
};

export const reinitGame = (
  setGuessNumber: Dispatch<SetStateAction<number>>,
  setGuesses: Dispatch<SetStateAction<Guesses>>,
  setHasWon: Dispatch<SetStateAction<boolean>>,
  setHasLost: Dispatch<SetStateAction<boolean>>
) => {
  setGuessNumber(1);
  setGuesses(initGuesses);
  setHasWon(false);
  setHasLost(false);
};

export const getNewFreeplaySongs = async (
  setFreeplayArtist: Dispatch<SetStateAction<ArtistForToday>>
) => {
  const [artist] = await fetchFreeplayArtist();
  setFreeplayArtist(artist);
};

import { Dispatch, SetStateAction } from "react";
import { MoodHappy, MoodSad, QuestionMark } from "tabler-icons-react";
import { fetchFreeModeArtist } from "../api/spotify";
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
  currentGuess: QuestionMark,
  goodGuess: MoodHappy,
  badGuess: MoodSad,
};

const isCurrent = (guess: any) => !guess || guess.correct === null;
const isWrong = (guess: any) => guess.correct === false;
const isCorrect = (guess: any) => guess.correct === true;

export const displayCorrectIcon = (guess: any) => {
  if (isCurrent(guess)) return icons["currentGuess"];
  if (isWrong(guess)) return icons["badGuess"];
  if (isCorrect(guess)) return icons["goodGuess"];
};

export const displayCorrectColor = (guess: any) => {
  if (isCurrent(guess)) return "cyan";
  if (isWrong(guess)) return "red";
  if (isCorrect(guess)) return "green";
};

export const fakeLog = () => {
  console.log(
    "%cLa réponse est : Michael jackson",
    "color: white; background: red; font-size: 15px"
  );
  console.log("fais confiance...");
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
  setFreeModeArtist: Dispatch<SetStateAction<ArtistForToday>>
) => {
  const [artist] = await fetchFreeModeArtist();
  setFreeModeArtist(artist);
};

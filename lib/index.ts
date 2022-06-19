import { MoodHappy, MoodSad, QuestionMark } from "tabler-icons-react";

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

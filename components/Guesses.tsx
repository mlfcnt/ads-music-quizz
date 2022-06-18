import React from "react";

type Props = {
  currentGuessNumber: number;
};

export const Guesses = ({ currentGuessNumber }: Props) => {
  const maxGuessAmount = 5;
  if (currentGuessNumber === maxGuessAmount) return null;
  return <p>{maxGuessAmount - currentGuessNumber + 1} essai(s) restant</p>;
};

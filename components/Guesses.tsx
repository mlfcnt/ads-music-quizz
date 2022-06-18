import React from "react";

type Props = {
  currentGuessNumber: number;
};

export const Guesses = ({ currentGuessNumber }: Props) => {
  const maxGuessAmount = 5;
  return <p>{maxGuessAmount - currentGuessNumber} essais restant</p>;
};

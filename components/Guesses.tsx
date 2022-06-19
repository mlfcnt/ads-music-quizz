import { Title } from "@mantine/core";
import React from "react";

type Props = {
  currentGuessNumber: number;
};

export const Guesses = ({ currentGuessNumber }: Props) => {
  const maxGuessAmount = 5;
  if (currentGuessNumber === maxGuessAmount + 1) return null;
  return (
    <Title order={5}>
      {maxGuessAmount - currentGuessNumber + 1} essai(s) restant(s)
    </Title>
  );
};

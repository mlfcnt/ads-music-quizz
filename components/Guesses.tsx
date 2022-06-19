import { Checkbox, Grid } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import React from "react";
import { QuestionMark, MoodHappy, MoodSad } from "tabler-icons-react";

type Props = {
  currentGuessNumber: number;
  guesses: Record<
    number,
    {
      correct: boolean | null;
    }
  >;
};

export const Guesses = ({ currentGuessNumber, guesses }: Props) => {
  const { height, width } = useViewportSize();

  const isMobile = height <= 900 && width <= 500;

  const maxGuessAmount = 5;
  if (currentGuessNumber === maxGuessAmount + 1) return null;

  const icons = {
    currentGuess: QuestionMark,
    goodGuess: MoodHappy,
    badGuess: MoodSad,
  };

  const isCurrent = (guess: any) => !guess || guess.correct === null;
  const isWrong = (guess: any) => guess.correct === false;
  const isCorrect = (guess: any) => guess.correct === true;

  const displayCorrectIcon = (guess: any) => {
    if (isCurrent(guess)) return icons["currentGuess"];
    if (isWrong(guess)) return icons["badGuess"];
    if (isCorrect(guess)) return icons["goodGuess"];
  };
  const displayCorrectColor = (guess: any) => {
    if (isCurrent(guess)) return "cyan";
    if (isWrong(guess)) return "red";
    if (isCorrect(guess)) return "green";
  };

  const displayCheckboxes = () => {
    const checkboxes = [];

    for (let index = 1; index < 6; index++) {
      checkboxes.push(
        <Grid.Col span={isMobile ? 2 : 1}>
          <Checkbox
            //@ts-ignore
            icon={displayCorrectIcon(guesses[index])}
            checked
            size="xl"
            color={displayCorrectColor(guesses[index])}
          />
        </Grid.Col>
      );
    }
    return checkboxes;
  };
  return (
    <>
      <Grid justify="center">{displayCheckboxes()}</Grid>{" "}
    </>
  );
};

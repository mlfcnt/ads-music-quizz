import { Checkbox, Grid } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import React from "react";
import { displayCorrectColor, displayCorrectIcon } from "../pages/lib";

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

  const displayCheckboxes = () => {
    const checkboxes = [];

    for (let index = 1; index < 6; index++) {
      checkboxes.push(
        <Grid.Col span={isMobile ? 2 : 1} key={index}>
          <Checkbox
            //@ts-ignore
            icon={displayCorrectIcon(guesses[index])}
            checked
            onChange={() => {}}
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

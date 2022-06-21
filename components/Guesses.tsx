import { Checkbox, Grid, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { displayCorrectColor, displayCorrectIcon } from "../lib";

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
  const isDesktop = useMediaQuery("(min-width: 900px)", false);

  const maxGuessAmount = 5;
  if (currentGuessNumber === maxGuessAmount + 1) return null;

  const displayCheckboxes = () => {
    const checkboxes = [];

    for (let index = 1; index < 6; index++) {
      checkboxes.push(
        <Grid.Col span={2} key={index}>
          {isDesktop && <Text color={"dimmed"}>Extrait {index}</Text>}
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

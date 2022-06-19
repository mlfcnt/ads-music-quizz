import { Button, Card, Checkbox, Collapse, Space, Text } from "@mantine/core";
import React, { useState } from "react";
import { displayCorrectColor, displayCorrectIcon } from "../pages/lib";
import { ArtistForToday, Guesses } from "../types";

type Props = {
  guesses: Guesses;
  artistForToday: ArtistForToday;
};

export const AfterGameRecap = ({ guesses, artistForToday }: Props) => {
  const [opened, setOpen] = useState(false);

  const displayCheckboxesAndText = () => {
    const checkboxesAndText = [];

    for (let index = 1; index < 6; index++) {
      checkboxesAndText.push(
        <>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Checkbox
              //@ts-ignore
              icon={displayCorrectIcon(guesses[index])}
              checked
              onChange={() => {}}
              size="xl"
              color={displayCorrectColor(guesses[index])}
              style={{ marginTop: "20px" }}
            />
            <Text ml={4}>
              Extrait n°{index} : {artistForToday.tracks[index - 1].name} (
              Popularité : {artistForToday.tracks[index - 1].popularity} )
            </Text>
          </div>
        </>
      );
    }
    return checkboxesAndText;
  };

  return (
    <>
      <Button onClick={() => setOpen((o) => !o)}>Récap de la partie</Button>
      <Space h="lg" />
      <Collapse in={opened}>
        <Card shadow="sm" p="lg">
          <Text>
            L&apos;artiste à trouver était :{" "}
            <strong>{artistForToday.name}</strong>
          </Text>
          <div>
            {displayCheckboxesAndText()} <Space h="lg" />
            <Space h="lg" />
            <Text color={"dimmed"} align="center">
              Popularité : indice calculé par Spotify
            </Text>
          </div>
        </Card>
      </Collapse>
    </>
  );
};

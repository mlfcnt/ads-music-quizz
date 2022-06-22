import { Button } from "@mantine/core";
import React from "react";
type Props = {
  reinitGame: any;
  setGuess: any;
  getNewFreeplaySongs: any;
  setFreeplayArtist: any;
  selectedStyles: any;
};
export const GetNewFreeplayArtistButton = ({
  reinitGame,
  setGuess,
  getNewFreeplaySongs,
  setFreeplayArtist,
  selectedStyles,
}: Props) => {
  return (
    <Button
      size="lg"
      variant="gradient"
      gradient={{ from: "indigo", to: "cyan" }}
      onClick={() => {
        reinitGame();
        setGuess("");
        getNewFreeplaySongs(setFreeplayArtist, selectedStyles);
      }}
    >
      Nouvel artiste
    </Button>
  );
};

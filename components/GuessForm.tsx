import { Autocomplete, Box, Button, Group } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDebounce } from "react-use";
import { useArtistSugestions } from "../hooks/useArtistSugestions";
import { getNewFreeplaySongs } from "../lib";
import { ArtistForToday, Mode } from "../types";

type Props = {
  artistToFind: string;
  incrementGuessNumber: () => void;
  handleCorrectGuess: () => void;
  mode: Mode;
  setFreeModeArtist: Dispatch<SetStateAction<ArtistForToday | null>>;
};

export const GuessForm = ({
  artistToFind,
  incrementGuessNumber,
  handleCorrectGuess,
  mode,
  setFreeModeArtist,
}: Props) => {
  const [guess, setGuess] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const autompleteArtists = useArtistSugestions({
    debouncedValue,
  });

  useDebounce(
    () => {
      setDebouncedValue(guess);
    },
    100,
    [guess]
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (guess?.toLowerCase() === artistToFind.toLowerCase()) {
      handleCorrectGuess();
      return;
    }
    setGuess("");
    incrementGuessNumber();
  };

  return (
    <Box mx="auto">
      <form>
        <Autocomplete
          label="Quel est cet artiste...?"
          data={autompleteArtists || []}
          value={guess}
          onChange={setGuess}
        />
        <Group mt="md" position="right">
          <Button type="submit" onClick={handleSubmit} color="orange">
            Envoyer
          </Button>
          {mode === "FREE" && (
            <Button
              color="indigo"
              onClick={() => getNewFreeplaySongs(setFreeModeArtist)}
            >
              Nouvel artiste
            </Button>
          )}
        </Group>
      </form>
    </Box>
  );
};

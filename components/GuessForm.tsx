import { Autocomplete, Box, Button, Group } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDebounce } from "react-use";
import { useArtistSugestions } from "../hooks/useArtistSugestions";

type Props = {
  artistToFind: string;
  incrementGuessNumber: () => void;
  setHasWon: Dispatch<SetStateAction<boolean>>;
};

export const GuessForm = ({
  artistToFind,
  incrementGuessNumber,
  setHasWon,
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
      setHasWon(true);
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
          <Button type="submit" onClick={handleSubmit}>
            Envoyer
          </Button>
        </Group>
      </form>
    </Box>
  );
};

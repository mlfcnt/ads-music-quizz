import { Autocomplete, Box, Button, Group, Text } from "@mantine/core";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import { useDebounce } from "react-use";
import { useArtistSugestions } from "../hooks/useArtistSugestions";
import { getNewFreeplaySongs, reinitGame } from "../lib";
import { ArtistForToday, Mode } from "../types";
import { GetNewFreeplayArtistButton } from "./GetNewFreeplayArtistButton";

type Props = {
  artistToFind: string;
  incrementGuessNumber: () => void;
  handleCorrectGuess: () => void;
  mode: Mode;
  setFreeplayArtist: Dispatch<SetStateAction<ArtistForToday>>;
  reinitGame: () => void;
  selectedStyles: string[];
};

export const GuessForm = ({
  artistToFind,
  incrementGuessNumber,
  handleCorrectGuess,
  mode,
  setFreeplayArtist,
  reinitGame,
  selectedStyles,
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

  const handleSubmit = (
    e: SyntheticEvent,
    artistToFind: ArtistForToday["name"]
  ) => {
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
          {mode === "FREE" && (
            <GetNewFreeplayArtistButton
              getNewFreeplaySongs={getNewFreeplaySongs}
              reinitGame={reinitGame}
              setGuess={setGuess}
              setFreeplayArtist={setFreeplayArtist}
              selectedStyles={selectedStyles}
            />
          )}
          <Button
            type="submit"
            onClick={(e: SyntheticEvent) => handleSubmit(e, artistToFind)}
            size="lg"
            color="green"
            uppercase
          >
            <Group>
              <div>
                <Text>Envoyer</Text>
                <Text size="xs" color="white">
                  ou passer ?? extrait suivant
                </Text>
              </div>
            </Group>
          </Button>
        </Group>
      </form>
    </Box>
  );
};

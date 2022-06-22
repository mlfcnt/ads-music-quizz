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
};

export const GuessForm = ({
  artistToFind,
  incrementGuessNumber,
  handleCorrectGuess,
  mode,
  setFreeplayArtist,
  reinitGame,
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
          <Button
            type="submit"
            onClick={(e: SyntheticEvent) => handleSubmit(e, artistToFind)}
            size="lg"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            <Group>
              <div>
                <Text>Envoyer</Text>
                <Text size="xs" color="gray">
                  ou passer à extrait suivant
                </Text>
              </div>
            </Group>
          </Button>
          {mode === "FREE" && (
            <GetNewFreeplayArtistButton
              getNewFreeplaySongs={getNewFreeplaySongs}
              reinitGame={reinitGame}
              setGuess={setGuess}
              setFreeplayArtist={setFreeplayArtist}
            />
          )}
        </Group>
      </form>
    </Box>
  );
};

import { Autocomplete, Box, Button, Group, Text } from "@mantine/core";
import { useLRAuth } from "loginradius-react";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import { useDebounce } from "react-use";
import { useArtistSugestions } from "../hooks/useArtistSugestions";
import { getNewFreeplaySongs } from "../lib";
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
  isFirstGuess: boolean;
};

export const GuessForm = ({
  artistToFind,
  incrementGuessNumber,
  handleCorrectGuess,
  mode,
  setFreeplayArtist,
  reinitGame,
  selectedStyles,
  isFirstGuess,
}: Props) => {
  const [guess, setGuess] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const autompleteArtists = useArtistSugestions({
    debouncedValue,
  });

  const { user } = useLRAuth();

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
    if (mode === "CLASSIC" && isFirstGuess && !user) {
      const continueWithoutPoints = window.confirm(
        "Envoyer la réponse sans être connecté ? Vos points ne seront pas comptabilisés 😢 "
      );
      if (!continueWithoutPoints) return;
    }
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
                  ou passer à extrait suivant
                </Text>
              </div>
            </Group>
          </Button>
        </Group>
      </form>
    </Box>
  );
};

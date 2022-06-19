import type { GetServerSideProps, NextPage } from "next";
import { Space } from "@mantine/core";
import { getArtistOfTheDay, Track } from "../api/spotify";
import { Player } from "../components/Player";
import { GuessForm } from "../components/GuessForm";
import { useState } from "react";
import { Guesses } from "../components/Guesses";
import { ShareResults } from "../components/ShareResults";

type Props = {
  artistForToday: {
    name: string;
    id: string;
    tracks: Track[];
  };
};

const Home: NextPage<Props> = ({ artistForToday }) => {
  const [guessNumber, setGuessNumber] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [guesses, setGuesses] = useState<
    Record<number, { correct: boolean | null }>
  >({
    1: {
      correct: null,
    },
    2: {
      correct: null,
    },
    3: {
      correct: null,
    },
    4: {
      correct: null,
    },
    5: {
      correct: null,
    },
  });

  const incrementGuessNumber = (guessNumber: number) => {
    if (guessNumber === 5) {
      setGuesses({
        ...guesses,
        [guessNumber]: {
          correct: false,
        },
      });
      setHasLost(true);
      return;
    }
    setGuesses({
      ...guesses,
      [guessNumber]: {
        correct: false,
      },
    });
    setGuessNumber(guessNumber + 1);
  };

  const handleCorrectGuess = () => {
    setGuesses({
      ...guesses,
      [guessNumber]: {
        correct: true,
      },
    });
    setHasWon(true);
  };
  return (
    <>
      {!artistForToday.id && <p>Erreur.. pas dartiste... bravo tommy</p>}

      <Space h="lg" />
      {artistForToday?.tracks?.[guessNumber - 1]?.uri && (
        <Player trackId={artistForToday.tracks[guessNumber - 1].uri} />
      )}
      <Space h="lg" />
      <Space h="xl" />
      <Guesses currentGuessNumber={guessNumber} guesses={guesses} />
      <Space h="xl" />
      {!hasWon && !hasLost && (
        <>
          <Space h="xl" />
          <Space h="xl" />
          <Space h="xl" />
          <GuessForm
            artistToFind={artistForToday.name}
            incrementGuessNumber={() => incrementGuessNumber(guessNumber)}
            handleCorrectGuess={handleCorrectGuess}
          />
          <Space h="lg" />
        </>
      )}

      {(hasWon || hasLost) && (
        <ShareResults guessNumber={guessNumber} hasLost={hasLost} />
      )}
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const artistOfTheDay = await getArtistOfTheDay();
  return {
    props: {
      artistForToday: artistOfTheDay || {},
    },
  };
};

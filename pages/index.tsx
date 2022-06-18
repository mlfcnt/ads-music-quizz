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

  const incrementGuessNumber = () => {
    if (guessNumber === 5) {
      setHasLost(true);
      return;
    }
    setGuessNumber(guessNumber + 1);
  };

  return (
    <>
      {!artistForToday.id && <p>Erreur.. pas dartiste... bravo tommy</p>}

      <Space h="lg" />
      {artistForToday?.tracks?.[guessNumber - 1]?.uri && (
        <Player trackId={artistForToday.tracks[guessNumber - 1].uri} />
      )}
      <Space h="lg" />
      {!hasWon && !hasLost && (
        <>
          <Guesses currentGuessNumber={guessNumber} />
          <Space h="lg" />
          <GuessForm
            artistToFind={artistForToday.name}
            incrementGuessNumber={incrementGuessNumber}
            setHasWon={setHasWon}
          />
        </>
      )}
      {(hasWon || hasLost) && (
        <ShareResults
          guessNumber={guessNumber}
          hasWon={hasWon}
          hasLost={hasLost}
        />
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

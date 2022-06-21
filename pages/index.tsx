import type { GetServerSideProps, NextPage } from "next";
import { Space } from "@mantine/core";
import { getArtistOfTheDay } from "../api/spotify";
import { Player } from "../components/Player";
import { GuessForm } from "../components/GuessForm";
import { useState } from "react";
import { Guesses } from "../components/Guesses";
import { ShareResults } from "../components/ShareResults";
import { ArtistForToday, Guesses as GuessesType, Mode } from "../types";
import { fakeLog, getNewFreeplaySongs, initGuesses, reinitGame } from "../lib";
import { AfterGameRecap } from "../components/AfterGameRecap";
import { ModeSelect } from "../components/ModeSelect";

type Props = {
  artistForToday: ArtistForToday;
};

const Home: NextPage<Props> = ({ artistForToday }) => {
  const [guessNumber, setGuessNumber] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [guesses, setGuesses] = useState<GuessesType>(initGuesses);
  const [mode, setMode] = useState<Mode>("CLASSIC");
  const [freeModeArtist, setFreeModeArtist] = useState<ArtistForToday | null>(
    null
  );

  fakeLog();

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
  const onModeToggle = async () => {
    reinitGame(setGuessNumber, setGuesses, setHasLost, setHasWon);
    if (mode === "CLASSIC") {
      // should be === "FREE" but the state is changed juste underneath
      getNewFreeplaySongs(setFreeModeArtist);
    }
    setMode(mode === "CLASSIC" ? "FREE" : "CLASSIC");
  };

  const songToPlay = () => {
    if (mode === "CLASSIC") {
      return artistForToday?.tracks?.[guessNumber - 1]?.uri;
    } else {
      return freeModeArtist?.tracks?.[guessNumber - 1]?.uri as string;
    }
  };

  return (
    <>
      {!artistForToday.id && <p>Erreur.. pas dartiste... bravo tommy</p>}

      <Space h="xl" />
      <ModeSelect mode={mode} onModeToggle={onModeToggle} />
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      {songToPlay && <Player trackId={songToPlay()} />}
      <Space h="xl" />
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
            mode={mode}
            setFreeModeArtist={setFreeModeArtist}
          />
          <Space h="xl" />
        </>
      )}

      {(hasWon || hasLost) && (
        <>
          <ShareResults guessNumber={guessNumber} hasLost={hasLost} />
          <AfterGameRecap guesses={guesses} artistForToday={artistForToday} />
        </>
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

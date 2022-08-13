import type { GetServerSideProps, NextPage } from "next";
import {
  Button,
  Container,
  Drawer,
  Group,
  Space,
  // Table,
  Text,
} from "@mantine/core";
import { getArtistOfTheDay } from "../api/spotify";
import { Player } from "../components/Player";
import { GuessForm } from "../components/GuessForm";
import { useEffect, useState } from "react";
import { Guesses } from "../components/Guesses";
import { ShareResults } from "../components/ShareResults";
import { ArtistForToday, Guesses as GuessesType, Mode } from "../types";
import { getNewFreeplaySongs, initGuesses, reinitGame } from "../lib";
import { AfterGameRecap } from "../components/AfterGameRecap";
import { ModeSelect } from "../components/ModeSelect";
import { Trophy } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { StylePicker as StylePicker } from "../components/StylePicker";
import { playlists } from "../playlists";
import { GetNewFreeplayArtistButton } from "../components/GetNewFreeplayArtistButton";
import { Rankings } from "../components/Rankings";

type Props = {
  artistForToday: ArtistForToday;
};

const Home: NextPage<Props> = ({ artistForToday }) => {
  const [guessNumber, setGuessNumber] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [guesses, setGuesses] = useState<GuessesType>(initGuesses);
  const [mode, setMode] = useState<Mode>("CLASSIC");
  const [freeplayArtist, setFreeplayArtist] = useState<ArtistForToday>(
    null as unknown as ArtistForToday
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(() =>
    playlists.sort((a, b) => a.style.localeCompare(b.style)).map((x) => x.style)
  );
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (selectedStyles) {
      getNewFreeplaySongs(setFreeplayArtist, selectedStyles);
    }
  }, [selectedStyles]);

  const isClassicMode = mode === "CLASSIC";
  const isFreeplay = !isClassicMode;

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
    isClassicMode &&
      showNotification({
        title: "Bien joué !",
        message: `+ ${6 - guessNumber} points !`,
        icon: <Trophy />,
      });
    setHasWon(true);
  };

  const onModeToggle = async () => {
    reinitGame(setGuessNumber, setGuesses, setHasLost, setHasWon);
    if (isClassicMode) {
      // should be === "FREE" but the state is changed juste underneath
      getNewFreeplaySongs(setFreeplayArtist);
    }
    setMode(isClassicMode ? "FREE" : "CLASSIC");
  };

  const songToPlay = () => {
    if (isClassicMode) {
      return artistForToday?.tracks?.[guessNumber - 1]?.uri;
    } else {
      return freeplayArtist?.tracks?.[guessNumber - 1]?.uri as string;
    }
  };

  if (isFreeplay && !freeplayArtist?.name) return <Text>Chargement...</Text>;

  const artistToFind = isClassicMode
    ? artistForToday.name
    : freeplayArtist?.name;

  return (
    <>
      {!artistForToday.id && <p>Erreur.. pas dartiste... bravo tommy</p>}

      <Drawer
        opened={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title="Paramètres de jeu"
        padding="xl"
        size="xl"
      >
        <Space h="xl" />
        <ModeSelect mode={mode} onModeToggle={onModeToggle} />
        {isFreeplay && (
          <>
            <Space h="xl" /> <Space h="xl" />
            <StylePicker
              selectedStyle={selectedStyles}
              setSelectedStyle={setSelectedStyles}
            />
          </>
        )}
      </Drawer>

      <Group position="right">
        <Button
          onClick={() => setOpenDrawer(true)}
          variant="gradient"
          gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
        >
          Paramètres de jeu
        </Button>
      </Group>
      <Container>
        {songToPlay && <Player trackId={songToPlay()} />}
        <Space h="xl" />
        <Space h="xl" />
        <Guesses currentGuessNumber={guessNumber} guesses={guesses} />
      </Container>
      <Space h="xl" />
      {!hasWon && !hasLost && (
        <>
          <Space h="xl" />
          <Space h="xl" />
          <Space h="xl" />
          <GuessForm
            artistToFind={artistToFind}
            incrementGuessNumber={() => incrementGuessNumber(guessNumber)}
            handleCorrectGuess={handleCorrectGuess}
            mode={mode}
            setFreeplayArtist={setFreeplayArtist}
            reinitGame={() =>
              reinitGame(setGuessNumber, setGuesses, setHasWon, setHasLost)
            }
            selectedStyles={selectedStyles}
            isFirstGuess={guessNumber === 1}
          />
          <Space h="xl" />
        </>
      )}
      {(hasWon || hasLost) && (
        <>
          <ShareResults
            guessNumber={guessNumber}
            hasLost={hasLost}
            isClassicMode={isClassicMode}
            artistId={artistForToday.id}
          />
          <AfterGameRecap
            guesses={guesses}
            artistForToday={isClassicMode ? artistForToday : freeplayArtist}
          />
          {isFreeplay && (
            <GetNewFreeplayArtistButton
              getNewFreeplaySongs={getNewFreeplaySongs}
              reinitGame={() =>
                reinitGame(setGuessNumber, setGuesses, setHasWon, setHasLost)
              }
              setGuess={() => {}}
              setFreeplayArtist={setFreeplayArtist}
              selectedStyles={selectedStyles}
            />
          )}
        </>
      )}
      {isClassicMode && <Rankings />}
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

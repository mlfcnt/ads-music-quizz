import type { GetServerSideProps, NextPage } from "next";
import { Button, Container, Drawer, Group, Space, Text } from "@mantine/core";
import { getArtistOfTheDay } from "../api/spotify";
import { Player } from "../components/Player";
import { GuessForm } from "../components/GuessForm";
import { useEffect, useState } from "react";
import { Guesses } from "../components/Guesses";
import { ArtistForToday, Guesses as GuessesType, Mode } from "../types";
import { getNewFreeplaySongs, initGuesses, reinitGame } from "../lib";
import { AfterGameRecap } from "../components/AfterGameRecap";
import { ModeSelect } from "../components/ModeSelect";
import { StylePicker as StylePicker } from "../components/StylePicker";
import { playlists } from "../playlists";
import { GetNewFreeplayArtistButton } from "../components/GetNewFreeplayArtistButton";
import { Rankings } from "../components/Rankings";
import { useToggle } from "react-use";
import { LeaderAlert } from "../components/LeaderAlert";
import { useCurrentUserIsLeader } from "../hooks/useCurrentUserIsLeader";
import { useUpdateScore } from "../hooks/useUpdateScore";

type Props = {
  artistForToday: ArtistForToday;
};

const Home: NextPage<Props> = ({ artistForToday }) => {
  const [guessNumber, setGuessNumber] = useState(1);
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  const [hasLost, setHasLost] = useState<boolean | null>(null);
  const [guesses, setGuesses] = useState<GuessesType>(initGuesses);
  const [mode, setMode] = useState<Mode>("CLASSIC");
  const [freeplayArtist, setFreeplayArtist] = useState<ArtistForToday>(
    null as unknown as ArtistForToday
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(() =>
    playlists.sort((a, b) => a.style.localeCompare(b.style)).map((x) => x.style)
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const currentUserIsLeader = useCurrentUserIsLeader();

  const [showLeaderModal, toggleLeaderModal] = useToggle(false);

  useEffect(() => {
    if (currentUserIsLeader) {
      toggleLeaderModal();
    }
  }, [currentUserIsLeader, toggleLeaderModal]);

  useEffect(() => {
    if (selectedStyles) {
      getNewFreeplaySongs(setFreeplayArtist, selectedStyles);
    }
  }, [selectedStyles]);

  const isClassicMode = mode === "CLASSIC";
  const isFreeplay = !isClassicMode;

  useUpdateScore({
    hasWon,
    hasLost,
    guessNumber,
    isClassicMode,
    artist: artistForToday,
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
          {hasLost ? (
            <p>Dommage 😟. Retente ta chance demain !</p>
          ) : (
            <p>Vous avez trouvé en {guessNumber} essai(s)! Bravo</p>
          )}
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
      <LeaderAlert show={showLeaderModal} toggle={toggleLeaderModal} />
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

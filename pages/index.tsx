import type { GetServerSideProps, NextPage } from "next";
import { Container, Space, Title } from "@mantine/core";
import { getArtistOfTheDay, Track } from "../api/spotify";
import { Player } from "../components/Player";
import { GuessForm } from "../components/GuessForm";

import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { CountdownToNextGame } from "../components/CountdownToNextGame";
import { useState } from "react";

type Props = {
  artistForToday: {
    name: string;
    id: string;
    tracks: Track[];
  };
};

const Home: NextPage<Props> = ({ artistForToday }) => {
  const [guessNumber, setGuessNumber] = useState(1);
  return (
    <Container>
      <Space h="xl" />
      <ThemeSwitcher />
      <Title order={1} style={{ textAlign: "center" }}>
        ADS music quiz
      </Title>
      {!artistForToday.id && <p>Erreur.. pas dartiste... bravo tommy</p>}

      <Space h="lg" />
      {artistForToday?.tracks?.[guessNumber - 1]?.uri && (
        <Player trackId={artistForToday.tracks[guessNumber - 1].uri} />
      )}
      <Space h="lg" />
      <Title order={2}>Essai {guessNumber}/5</Title>
      <Space h="lg" />
      <GuessForm />
      <CountdownToNextGame />
    </Container>
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

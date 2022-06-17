import type { GetServerSideProps, NextPage } from "next";
import { Container, Space, Title } from "@mantine/core";
import { getTrackToPlay, Track } from "../api/spotify";
import { Player } from "../components/Player";
import { GuessForm } from "../components/GuessForm";

type Props = {
  trackId: Track["id"];
};

const Home: NextPage<Props> = ({ trackId }) => {
  return (
    <Container>
      <Title order={1} style={{ textAlign: "center" }}>
        ADS music quiz
      </Title>
      <Space h="lg" />
      {trackId && <Player trackId={trackId} />}
      <Space h="lg" />
      <Title order={2}>Essai 1/5</Title>
      <Space h="lg" />
      <GuessForm />
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const trackToPlay = await getTrackToPlay();
  return {
    props: {
      trackId: trackToPlay,
    },
  };
};

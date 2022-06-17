import type { GetServerSideProps, NextPage } from "next";
import { Container, Group, Space, Title } from "@mantine/core";
import { getTrackToPlay, Track } from "../api/spotify";

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
      <Space h="lg" />
      {trackId && (
        <iframe
          style={{ borderRadius: "12px" }}
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allowFullScreen={false}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      )}
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

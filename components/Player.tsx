import { Box } from "@mantine/core";
import React from "react";
import { Track } from "../api/spotify";
import { useMediaQuery } from "@mantine/hooks";

export const Player = ({ trackId }: { trackId: Track["id"] }) => {
  const isDesktop = useMediaQuery("(min-width: 900px)", false);
  return (
    <Box>
      <iframe
        style={{ marginLeft: isDesktop ? "25rem" : "8.1rem" }}
        className="frame-spotify"
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="80px"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </Box>
  );
};

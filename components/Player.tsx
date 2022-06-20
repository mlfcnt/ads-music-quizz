import { Box } from "@mantine/core";
import React from "react";
import { Track } from "../api/spotify";

export const Player = ({ trackId }: { trackId: Track["id"] }) => {
  return (
    <Box>
      <iframe
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

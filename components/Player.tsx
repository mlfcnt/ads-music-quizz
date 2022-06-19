import React, { useEffect } from "react";
import { Track } from "../api/spotify";

export const Player = ({ trackId }: { trackId: Track["id"] }) => {
  return (
    <iframe
      style={{ borderRadius: "12px", left: "50%" }}
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0?autoplay=true`}
      width="80px"
      height="80"
      frameBorder="0"
      allowFullScreen={true}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
  );
};

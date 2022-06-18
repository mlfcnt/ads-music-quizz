import React from "react";
import { Track } from "../api/spotify";
import { useOembedPlayer } from "../hooks/useOembedPlayer";

export const Player = ({ trackId }: { trackId: Track["id"] }) => {
  const oEmbed = useOembedPlayer(trackId);

  const createMarkup = (html: any) => ({ __html: html });

  return oEmbed?.html ? (
    <div
      dangerouslySetInnerHTML={createMarkup(oEmbed?.html)}
      className="spotify-oembed"
    />
  ) : null;
};

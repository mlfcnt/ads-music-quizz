import { useEffect, useState } from "react";

export const useOembedPlayer = (trackId: string) => {
  const [oEmbed, setOEmbed] = useState<any>(null);

  useEffect(() => {
    const url = `https://open.spotify.com/oembed?url=http://open.spotify.com/track/${trackId}`;
    const fetchOembedSpotifyPlayer = async () => {
      const res = await fetch(url);
      const oEmbedPlayer = await res.json();
      setOEmbed(oEmbedPlayer);
    };
    fetchOembedSpotifyPlayer();
  }, [trackId]);

  return oEmbed;
};

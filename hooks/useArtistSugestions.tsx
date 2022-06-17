import { useEffect, useRef, useState } from "react";
import { searchArtistsByName } from "../api/spotify";

type Props = {
  debouncedValue: string;
};

export const useArtistSugestions = ({ debouncedValue }: Props) => {
  const [autompleteArtists, setAutompleteArtists] = useState<any[]>([]);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;

    const getArtists = async () => {
      const artists = await searchArtistsByName(debouncedValue);
      if (isMounted) {
        setAutompleteArtists(artists);
      }
    };

    getArtists().catch(console.error);

    return () => {
      isMounted.current = false;
    };
  }, [debouncedValue]);
  return autompleteArtists;
};

import { NextApiRequest, NextApiResponse } from "next";
import {
  getArtistFromPlaylist,
  getPlaylist,
  getTopTacksFromArtist,
  Track,
} from "../../../api/spotify";
import { supabase } from "../../../supabaseClient";
import dayjs from "dayjs";

type Props = {
  isFreeplay: boolean;
  styles: string[];
};

export const getArtistAndTracksOfTheDay = async ({
  isFreeplay = false,
  styles,
}: Props) => {
  //TODO auth pour pas que nimporte qui puisse refresh..
  const playlist = await getPlaylist(isFreeplay, styles);
  const artist = getArtistFromPlaylist(playlist);
  if (!artist) return null;
  // check si l'artiste a deja été tiré le mois précédent
  if (!isFreeplay) {
    const { data: alreadyChosen } = await supabase
      .from("artist-of-the-day")
      .select("*")
      .eq("artistId", artist.id);

    if (alreadyChosen?.length) {
      const aMonthAgo = dayjs().diff(dayjs().subtract(1, "month"));
      const lastPicked = dayjs(alreadyChosen?.[0]?.created_at).diff(dayjs());
      if (lastPicked < aMonthAgo)
        console.log(
          `L'artiste ${artist.name} à déjà été séctionné ${dayjs(
            alreadyChosen?.[0]?.created_at
          ).fromNow()}... On en met un autre`
        );
      getArtistAndTracksOfTheDay({
        isFreeplay: false,
      });
      return;
    }
  }

  const topTracks = await getTopTacksFromArtist(artist.id);
  if (topTracks?.length < 5) return;

  //TODO gestion des erreurs

  if (!isFreeplay) {
    const { error, data } = await supabase.from("artist-of-the-day").insert([
      {
        artistId: artist.id,
        artistName: artist.name,
        tracks: getFiveMostPopoularTracksFromArtist(topTracks),
      },
    ]);
    return data;
  } else {
    return [
      {
        id: artist.id,
        name: artist.name,
        tracks: getFiveMostPopoularTracksFromArtist(topTracks),
      },
    ];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let artistAndTracksOfTheDay = [];
  while (!artistAndTracksOfTheDay.length) {
    const data = await getArtistAndTracksOfTheDay({
      isFreeplay: false,
    });
    data?.length && (artistAndTracksOfTheDay = data);
  }

  res.status(200).json(artistAndTracksOfTheDay);
}

const getFiveMostPopoularTracksFromArtist = (topTracks: Track[]) => {
  try {
    let tracks = [];
    for (let index = 0; index < 5; index++) {
      tracks.push({
        name: topTracks[index].name,
        popularity: topTracks[index].popularity,
        uri: topTracks[index].uri.split(":")[2],
      });
    }
    return tracks.sort((a, b) => a.popularity - b.popularity);
  } catch (error) {
    console.log("error", { topTracks, error });
  }
};

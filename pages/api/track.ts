import { NextApiRequest, NextApiResponse } from "next";
import {
  getArtistFromPlaylist,
  getPlaylist,
  getTopTacksFromArtist,
  Track,
} from "../../api/spotify";
import { supabase } from "../../supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO auth pour pas que nimporte qui puisse refresh..
  const playlist = await getPlaylist();
  const artist = getArtistFromPlaylist(playlist);
  //TODO ne pas pick un artist si il a deja ete selectionné dans le passé ?
  const topTracks = await getTopTacksFromArtist(artist.id);

  //TODO gestion des erreurs

  const { error } = await supabase.from("artist-of-the-day").insert([
    {
      artistId: artist.id,
      artistName: artist.name,
      tracks: getFiveMostPopoularTracksFromArtist(topTracks),
    },
  ]);

  console.log(error);

  res.status(200).json("cool");
}

const getFiveMostPopoularTracksFromArtist = (topTracks: Track[]) => {
  let tracks = [];
  for (let index = 1; index < 5; index++) {
    tracks.push({
      name: topTracks[index].name,
      popularity: topTracks[index].popularity,
      uri: topTracks[index].uri.split(":")[2],
    });
  }
  return tracks.sort((a, b) => a.popularity - b.popularity);
};

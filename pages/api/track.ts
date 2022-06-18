import { NextApiRequest, NextApiResponse } from "next";
import {
  getArtistFromPlaylist,
  getPlaylist,
  getTopTacksFromArtist,
  Track,
} from "../../api/spotify";
import db from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO auth pour pas que nimporte qui puisse refresh..
  const playlist = await getPlaylist();
  const artist = getArtistFromPlaylist(playlist);
  //TODO ne pas pick un artist si il a deja ete selectionné dans le passé ?
  const topTracks = await getTopTacksFromArtist(artist.id);
  //@ts-ignore
  db.data = {
    artistOfTheDay: {
      name: artist.name,
      id: artist.id,
      tracks: getFiveMostPopoularTracksFromArtist(topTracks),
    },
  };
  db.write();
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

import { NextApiRequest, NextApiResponse } from "next";
import {
  getArtistFromPlaylist,
  getPlaylist,
  getTopTacksFromArtist,
} from "../../api/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO auth pour pas que nimporte qui puisse refresh..
  const playlist = await getPlaylist();
  const artist = getArtistFromPlaylist(playlist);
  //TODO ne pas pick un artiste si il a deja ete selectionné dans le passé ?
  const topTracks = await getTopTacksFromArtist(artist.id);
  // random top 10 song from artist
  //TODO passer le numero de lessai et renvoyer une difficulté conséquente (de + dur a moins dur)
  const randomTrackIndex = Math.floor(Math.random() * topTracks.length);
  res.status(200).json(topTracks[randomTrackIndex].id);
}

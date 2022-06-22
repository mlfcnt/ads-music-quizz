import { NextApiRequest, NextApiResponse } from "next";
import { getArtistAndTracksOfTheDay } from ".";
import { playlists } from "../../../playlists";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ALL_STYLES = playlists.map((x) => x.style);
  const body = req.body;
  let styles = JSON.parse(body);

  if (!styles.length) {
    styles = ALL_STYLES;
  }
  let artistAndTracksOfTheDay = [];
  const data = await getArtistAndTracksOfTheDay({
    isFreeplay: true,
    styles,
  });

  data?.length && (artistAndTracksOfTheDay = data);

  res.status(200).json(artistAndTracksOfTheDay);
}

import { NextApiRequest, NextApiResponse } from "next";
import { getArtistAndTracksOfTheDay } from ".";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let artistAndTracksOfTheDay = [];
  const data = await getArtistAndTracksOfTheDay({
    isFreeplay: true,
  });

  data?.length && (artistAndTracksOfTheDay = data);

  res.status(200).json(artistAndTracksOfTheDay);
}

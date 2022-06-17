import { NextApiRequest, NextApiResponse } from "next";
import { requestAccessToken } from "../../api/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = "https://api.spotify.com/v1/search";
  const accessToken = await requestAccessToken();
  const name = req.query.name;
  const result = await fetch(`${url}?q=${name}&type=artist`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { artists } = await result.json();
  res.status(200).json(artists?.items?.map((x: any) => x.name) || []);
}

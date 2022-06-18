import { NextApiRequest, NextApiResponse } from "next";
import db from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const artistOfTheDay = db.data;
  console.log("db", { artistOfTheDay });
  res.status(200).json(artistOfTheDay);
}

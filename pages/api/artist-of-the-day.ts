import { NextApiRequest, NextApiResponse } from "next";
import db from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const trackDb = db.data;
  res.status(200).json(trackDb);
}

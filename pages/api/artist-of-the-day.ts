import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO gestion des erreurs
  const { data: db, error } = await supabase
    .from("artist-of-the-day")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .single();
  const mapped = {
    name: db.artistName,
    id: db.artistId,
    tracks: db.tracks,
  };
  res.status(200).json(mapped);
}

import { User } from "loginradius-react/build/LRClient";
import { supabase } from "../supabaseClient";
import { Artist } from "./spotify";

export const saveUserScore = async (
  userId: User["ID"],
  amountOfPoints: number,
  artistId: Artist["id"]
) => {
  const { data, error } = await supabase
    .from("points")
    .insert([{ userId, amountOfPoints, artistId }]);

  console.log({ data, error });
};

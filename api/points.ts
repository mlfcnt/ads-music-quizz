import { User } from "loginradius-react/build/LRClient";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Artist } from "./spotify";
import { groupBy } from "lodash";
import dayjs from "dayjs";

export const saveUserPoints = async (
  userId: User["Uid"],
  amountOfPoints: number,
  artistId: Artist["id"]
) => {
  const { data, error } = await supabase
    .from("points")
    .insert([{ userId, amountOfPoints, artistId }]);

  console.log({ data, error });
};

export type WeekPoints = Record<
  string,
  {
    firstName: User["FirstName"];
    userId: User["Uid"];
    amountOfPoints: number;
    artistId: Artist["id"];
  }[]
>;
export const useAllWeekPoints = (): {
  weekPoints: WeekPoints;
  users: User[];
} => {
  const [weekPoints, setWeekPoints] = useState<WeekPoints>({});
  const [users, setUsers] = useState<User[]>([]);
  //TODO only for current week
  const getWeekPoints = async () => {
    const { data, error } = await supabase.from("points").select("*");
    return data;
  };
  //TODO handle error

  const getUsers = async (userIds: User["Uid"][]) => {
    const uniqUsers = Array.from(new Set(userIds));
    const users: User[] = [];
    for (const userId of uniqUsers) {
      const res = await fetch(
        `https://api.loginradius.com/identity/v2/manage/account/${userId}?apiKey=${process.env.NEXT_PUBLIC_LOGINRADIUS_API_KEY}&apiSecret=${process.env.NEXT_PUBLIC_LOGINRADIUS_API_SECRET}`
      );
      const json = await res.json();
      users.push(json);
    }
    return users;
  };

  useEffect(() => {
    getWeekPoints().then((data) => {
      if (!data?.length) return;
      const userIds = data.map((data) => data.userId);
      if (!userIds) return;
      getUsers(data.map((x) => x.userId)).then((users) => {
        setUsers(users);
        const dataWithUsernames = data.map((x) => ({
          ...x,
          firstName: users.find((user) => user.Uid === x.userId)?.FirstName,
        }));

        const grouppedByDate = groupBy(dataWithUsernames, (d) =>
          dayjs(d.created_at)
        );

        console.log([grouppedByDate]);

        setWeekPoints(grouppedByDate);
      });
    });
  }, []);

  return { weekPoints, users };
};

import { User } from "loginradius-react/build/LRClient";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Artist } from "./spotify";
import { groupBy } from "lodash";
import dayjs from "dayjs";

export const playerAlreadySubmitted = async (userId: User["Uid"]) => {
  const { data, error } = await supabase
    .from("points")
    .select("*")
    .eq("userId", userId)
    .gte("created_at", dayjs().startOf("day").toISOString());

  return !!data?.length;
};

export const saveUserPoints = async (
  userId: User["Uid"],
  amountOfPoints: number,
  artistId: Artist["id"],
  artistName: Artist["name"],
  reaction?: string
) => {
  const hasAlreadyPlayed = await playerAlreadySubmitted(userId);
  if (hasAlreadyPlayed) {
    throw new Error("Vous avez déjà joué aujourd'hui 👿");
  }

  await supabase
    .from("points")
    .insert([{ userId, amountOfPoints, artistId, artistName, reaction }]);
};

export type WeekPoints = Record<
  string,
  {
    firstName: User["FirstName"];
    userId: User["Uid"];
    amountOfPoints: number;
    artistId: Artist["id"];
    artistName: Artist["name"];
  }[]
>;
export const useAllWeekPoints = (): {
  weekPoints: WeekPoints;
  users: User[];
} => {
  const [weekPoints, setWeekPoints] = useState<WeekPoints>({});
  const [users, setUsers] = useState<User[]>([]);
  const getWeekPoints = async () => {
    const { data } = await supabase.from("points").select("*");
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

        const filterForWeek = dataWithUsernames.filter((x) => {
          return (
            dayjs(x.createdAt).isBefore(
              dayjs().endOf("week").subtract(2, "day")
            ) && dayjs().startOf("week").isBefore(dayjs(x.created_at))
          );
        });

        const grouppedByDate = groupBy(filterForWeek, (d) =>
          dayjs(d.created_at).startOf("day")
        );

        setWeekPoints(grouppedByDate);
      });
    });
  }, []);

  return { weekPoints, users };
};

export const useWeekRankings = () => {
  const { weekPoints } = useAllWeekPoints();
  const totalPointsPerUsers: Record<User["Uid"], number> = Object.values(
    weekPoints
  )
    .flatMap((x) => x)
    .reduce<Record<User["Uid"], number>>((acc, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = 0;
      }
      acc[curr.userId] += curr.amountOfPoints;
      return acc;
    }, {});
  return Object.entries(totalPointsPerUsers).sort(
    ([_1, points1], [_2, points2]) => points2 - points1
  );
};

export const useCurrentLeader = (): User["Uid"] | null => {
  const weeklyRankings = useWeekRankings();
  const maxScoreIs0 = weeklyRankings?.[0]?.[1] === 0;
  if (maxScoreIs0) return null;

  const leaderId = weeklyRankings?.[0]?.[0];
  return leaderId;
};

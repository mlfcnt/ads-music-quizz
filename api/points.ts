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
    reaction?: string;
  }[]
>;

type Point = {
  id: number;
  artistId: Artist["id"];
  artistName: Artist["name"];
  amountOfPoints: number;
  created_at: Date;
  reaction: string | null;
  userId: User["ID"];
};

const getAllPoints = async () => {
  const { data } = await supabase.from<Point>("points").select("*");
  return data;
};

export const useAllWeekPoints = (
  users: User[]
): {
  weekPoints: WeekPoints;
  users: User[];
} => {
  const [weekPoints, setWeekPoints] = useState<WeekPoints>({});

  useEffect(() => {
    getAllPoints().then((data) => {
      if (!data?.length) return;
      const dataWithUsernames = data.map((x) => ({
        ...x,
        firstName: users.find((user) => user.Uid === x.userId)?.FirstName,
      }));

      const filterForWeek = dataWithUsernames.filter((x) => {
        return (
          dayjs(x.created_at).isBefore(
            dayjs().endOf("week").subtract(2, "day")
          ) && dayjs().startOf("week").isBefore(dayjs(x.created_at))
        );
      });

      const grouppedByDate = groupBy(filterForWeek, (d) =>
        dayjs(d.created_at).startOf("day")
      );
      //@ts-ignore
      setWeekPoints(grouppedByDate);
    });
  }, [users]);

  return { weekPoints, users };
};

export const useWeekRankings = (users: User[]) => {
  const { weekPoints } = useAllWeekPoints(users);
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

export const useCurrentLeader = (users: User[]): User["Uid"] | null => {
  const weeklyRankings = useWeekRankings(users);
  const maxScoreIs0 = weeklyRankings?.[0]?.[1] === 0;
  if (maxScoreIs0) return null;

  const leaderId = weeklyRankings?.[0]?.[0];
  return leaderId;
};

export const getAllTimeRankings = async (users?: User[]) => {
  if (!users) return {};
  type DateString = string;
  const res = await getAllPoints();

  const grouppedByWeek: Record<DateString, Point[]> = groupBy(res, (r) =>
    dayjs(r.created_at).startOf("week").format()
  );

  const currentWeek = dayjs().startOf("week").format();
  delete grouppedByWeek[currentWeek]; // on en traite pas la semaine en cours

  const allWeeks = Object.keys(grouppedByWeek);

  const totalPointsPerUsersPerWeek: Record<DateString, number[]> =
    allWeeks.reduce((acc, week) => {
      acc = {
        ...acc,
        [week]: grouppedByWeek[week].reduce<{
          userId: User["Uid"];
          totalPoints: number;
        }>(
          (acc, curr) => {
            //@ts-ignore
            if (acc[curr.userId]) {
              //@ts-ignore
              acc[curr.userId] += curr.amountOfPoints;
            } else {
              //@ts-ignore
              acc[curr.userId] = curr.amountOfPoints;
            }
            return acc;
          },
          {} as {
            userId: User["Uid"];
            totalPoints: number;
          }
        ),
      };
      return acc;
    }, {});

  const winnersPerWeek: Record<DateString, User["Uid"][]> = allWeeks.reduce(
    (acc, week) => {
      acc = {
        ...acc,
        [week]: Object.entries(totalPointsPerUsersPerWeek[week]).reduce<
          { userId: User["Uid"]; totalPoints: number }[]
        >(
          (acc, [userId, userPointsForWeek]) => {
            if (acc[0].totalPoints < userPointsForWeek) {
              acc = [{ userId, totalPoints: userPointsForWeek }];
            } else if (acc[0].totalPoints === userPointsForWeek) {
              acc = [...acc, { userId, totalPoints: userPointsForWeek }];
            } else return acc;
            return acc;
          },
          [{ userId: "null", totalPoints: 0 }]
        ),
      };
      return acc;
    },
    {}
  );

  const allUsersIds = users.map((x) => x.Uid);

  const final: Record<User["Uid"], number> = {};

  const test = Object.values(winnersPerWeek).flatMap((week) =>
    //@ts-ignore jai niqué le type qq part
    week.map((y) => y.userId)
  );
  for (const userId of allUsersIds) {
    //@ts-ignore
    final[users.find((x) => x.Uid === userId)?.FirstName] = test.filter(
      (x) => x === userId
    )?.length;
  }
  return final;
};

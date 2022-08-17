import { Space, Table, Title } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useAllWeekPoints, useWeekRankings } from "../api/points";
import { Artist } from "../api/spotify";
import { emojiByRanking } from "../lib/misc";

export const Rankings = () => {
  const { weekPoints, users } = useAllWeekPoints();
  const weeklyRankings = useWeekRankings();

  const isLoading = !weekPoints;

  const noResultsYet = !Object.values(weekPoints)?.length;

  const displayArtist = (date: string, artistName: Artist["name"]) => {
    if (dayjs(date).isSame(dayjs(), "day")) {
      return "";
    }
    return artistName;
  };

  return (
    <>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Title>Classement (beta = bugs à prévoir 🐛)</Title>
      <Space h="xl" />
      <Space h="xl" />
      <Table striped>
        <thead>
          <th style={{ fontWeight: "bold", color: "gold" }}>
            Cummulé (semaine en cours)
          </th>
        </thead>
        <thead>
          <th align="left">Utilisateur</th>
          <th align="left">Points</th>
        </thead>
        <Space h={"md"} />
        <tbody>
          {isLoading && <p>Chargement...</p>}
          {noResultsYet && <p>Pas encore de résultats</p>}

          {weeklyRankings.map(([userId, points], idx) => {
            return (
              <tr key={userId}>
                <td>{users.find((x) => x.Uid === userId)?.FirstName}</td>
                <td>{`${points || 0} point(s) ${emojiByRanking(idx + 1)}`}</td>
              </tr>
            );
          })}
        </tbody>
        <Space h="xl" />
        <Space h="xl" />
        <thead>
          <th
            style={{ fontWeight: "bold", color: "gold", margin: "left auto" }}
          >
            Par jour
          </th>
        </thead>
        <thead>
          <th align="left">Utilisateur</th>
          <th align="left">Points</th>
          <th align="left">Avis sur l&apos;artiste</th>
        </thead>
        {Object.entries(weekPoints)
          .sort(([day1], [day2]) => dayjs(day2).unix() - dayjs(day1).unix())
          .map(([day, values], idx) => {
            const isToday = dayjs(day).isSame(dayjs(), "day");
            return (
              <>
                <Space h={"md"} />
                <thead>
                  <th key={idx} align="left">
                    {
                      <strong>
                        {`📆 ${
                          isToday
                            ? "Aujourd'hui"
                            : `${dayjs(day).format("dddd")} -`
                        } ${displayArtist(day, values?.[0]?.artistName)}`}{" "}
                      </strong>
                    }
                    <Space h={"md"} />
                  </th>
                </thead>

                <tbody>
                  {(values || [])
                    .sort((a, b) => b.amountOfPoints - a.amountOfPoints)
                    .map((value) => (
                      <tr key={idx}>
                        <td>{value.firstName}</td>
                        <td>{`${value.amountOfPoints || 0} point(s)`}</td>
                        <td>{value.reaction}</td>
                      </tr>
                    ))}
                </tbody>
              </>
            );
          })}
      </Table>
    </>
  );
};

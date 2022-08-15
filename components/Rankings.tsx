import { Space, Table, Title } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useAllWeekPoints, useWeekRankings } from "../api/points";
import { Artist } from "../api/spotify";
import { emojiByRanking } from "../lib/misc";

export const Rankings = () => {
  const { weekPoints, users } = useAllWeekPoints();
  const weeklyRankings = useWeekRankings();

  const noResultsYet = !Object.values(weekPoints)?.length;

  const displayArtist = (date: string, artistName: Artist["name"]) => {
    if (dayjs(date).isSame(dayjs(), "day")) {
      return "mystère...";
    }
    return artistName;
  };

  return (
    <>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Title>Classement (beta = bugs à prévoir)</Title>
      <Space h="xl" />
      <Space h="xl" />
      <Table striped highlightOnHover>
        <thead>
          <th style={{ fontWeight: "bold", color: "gold" }}>De la semaine</th>
        </thead>
        <tbody>
          {noResultsYet && <p>Pas encore de résultats</p>}

          {
            <div>
              {weeklyRankings.map(([userId, points], idx) => {
                return (
                  <tr key={userId}>
                    <td>{users.find((x) => x.Uid === userId)?.FirstName}</td>
                    <td>{`${points} point(s) ${emojiByRanking(idx + 1)}`}</td>
                  </tr>
                );
              })}
            </div>
          }
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
        {Object.entries(weekPoints).map(([day, values], idx) => {
          return (
            <>
              <thead>
                <th key={idx}>{`${dayjs(day).format("dddd")} - ${displayArtist(
                  day,
                  values?.[0]?.artistName
                )}`}</th>
              </thead>
              <tbody>
                {(values || [])
                  .sort((a, b) => b.amountOfPoints - a.amountOfPoints)
                  .map((value) => (
                    <tr key={idx}>
                      <td>{value.firstName}</td>
                      <td>{`${value.amountOfPoints} point(s)`}</td>
                      <td>Avis sur l&apos;artiste : Pas encore implémenté</td>
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

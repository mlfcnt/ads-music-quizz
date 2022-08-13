import { Space, Table, Title } from "@mantine/core";
import dayjs from "dayjs";
import { User } from "loginradius-react/build/LRClient";
import React from "react";
import { useAllWeekPoints } from "../api/points";
import { emojiByRanking } from "../lib/misc";

export const Rankings = () => {
  const { weekPoints, users } = useAllWeekPoints();

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

  return (
    <>
      <Space h="xl" />
      <Space h="xl" />
      <Space h="xl" />
      <Title>Classement (early beta = pleins de bugs à prévoir)</Title>
      <Space h="xl" />
      <Space h="xl" />
      <Table striped highlightOnHover>
        <thead>
          <th style={{ fontWeight: "bold", color: "gold" }}>De la semaine</th>
        </thead>
        <tbody>
          {
            <>
              {Object.entries(totalPointsPerUsers)
                .sort(([_1, points1], [_2, points2]) => points2 - points1)
                .map(([userId, points], idx) => (
                  <tr key={userId}>
                    <td>{users.find((x) => x.Uid === userId)?.FirstName}</td>
                    <td>{`${points} point(s) ${emojiByRanking(idx + 1)}`}</td>
                  </tr>
                ))}
            </>
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
                <th key={idx}>{dayjs(day).format("dddd")}</th>
                {/** !TODO ajouter artist name */}
              </thead>
              <tbody>
                {(values || [])
                  .sort((a, b) => b.amountOfPoints - a.amountOfPoints)
                  .map((value) => (
                    <tr key={value.userId}>
                      <td>{value.firstName}</td>
                      <td>{`${value.amountOfPoints} point(s)`}</td>
                      <td>TODO</td>
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

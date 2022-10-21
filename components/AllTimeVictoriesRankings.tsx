import { Space } from "@mantine/core";
import React from "react";
import { useAsync } from "react-use";
import { getAllTimeRankings } from "../api/points";
import { useUsers } from "../api/users";

export const AllTimeVictoriesRankings = () => {
  const { users } = useUsers();
  const { loading, value: allTimeRankings } = useAsync(async () => {
    return getAllTimeRankings(users);
  }, [users]);

  return (
    <>
      <thead>
        <th
          style={{
            fontWeight: "bold",
            color: "darkorange",
            margin: "left auto",
          }}
        >
          Hall of fame
        </th>
      </thead>
      <thead>
        <th align="left">Utilisateur</th>
        <th align="left">Victoires</th>
      </thead>
      <Space h={"md"} />
      <tbody>
        {loading || (!allTimeRankings && <p>Chargement...</p>)}
        {Object.entries(allTimeRankings!)
          .sort((a, b) => b[1] - a[1])
          .map(([name, victories]) => {
            return (
              <tr key={name}>
                <td>{name}</td>
                <td style={{ fontSize: "100%" }}>{`${
                  victories || 0
                } victoires(s) `}</td>
              </tr>
            );
          })}
      </tbody>
    </>
  );
};

import { Container, Space, Title } from "@mantine/core";
import React from "react";
import { useUsers } from "../api/users";
import { CountdownToNextGame } from "../components/CountdownToNextGame";
import { Login } from "../components/Login";
import { Rules } from "../components/Rules";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

type Props = {
  children: any; //TODO
};

export const Default = ({ children }: Props) => {
  const { data: users } = useUsers();
  return (
    <Container size={"xl"}>
      <Space h="xl" />
      <Login users={users || []} />
      <ThemeSwitcher />
      <Title
        order={1}
        align="center"
        style={{ color: "lightblue" }}
        className="main-title"
      >
        ADS Music Quiz
      </Title>
      <Title order={2} align="center" className="subtitle">
        Halloween edition
      </Title>

      <CountdownToNextGame />
      <Space h="lg" />
      <Rules />
      <Space h="lg" />
      {children}
    </Container>
  );
};

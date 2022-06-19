import { Container, Space, Title } from "@mantine/core";
import React from "react";
import { CountdownToNextGame } from "../components/CountdownToNextGame";
import { Rules } from "../components/Rules";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

type Props = {
  children: any; //TODO
};

export const Default = ({ children }: Props) => {
  return (
    <Container>
      <Space h="xl" />
      <ThemeSwitcher />
      <Title order={1} align="center" style={{ color: "lightblue" }}>
        ADS Music Quiz
      </Title>
      <CountdownToNextGame />
      <Space h="lg" />
      <Rules />
      <Space h="lg" />
      {children}
    </Container>
  );
};

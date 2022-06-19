import { Text } from "@mantine/core";
import React from "react";
import { useTimeRemainingToNextArtist } from "../hooks/useTimeRemainingToNextArtist";

export const CountdownToNextGame = () => {
  const timeRemainingToNextArtist = useTimeRemainingToNextArtist();

  return (
    <Text size="sm" align="center" color="dimmed">
      Nouvel artiste mystère {timeRemainingToNextArtist} ...
    </Text>
  );
};

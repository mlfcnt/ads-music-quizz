import { Grid, Space, Switch, Text } from "@mantine/core";
import React from "react";
import { Mode } from "../types";

type Props = {
  mode: Mode;
  onModeToggle: () => void;
};

export const ModeSelect = ({ mode, onModeToggle }: Props) => {
  const isFreeplay = mode === "FREE";
  return (
    <div>
      <Grid justify="right">
        <Switch
          mr={4}
          label={
            isFreeplay
              ? "Mode libre (pour du beurre)"
              : "Mode classique (défaut)"
          }
          size="md"
          checked={!isFreeplay}
          style={{ marginLeft: "auto", textAlign: "end" }}
          onChange={onModeToggle}
        />
      </Grid>
      <Space h="xl" />
      <Grid justify="right">
        <Text color={"dimmed"}>
          {isFreeplay
            ? "Parties illimitées. Les points ne comptent pas"
            : "Un artiste par jour. Les points comptent pour le classement"}
        </Text>
      </Grid>
    </div>
  );
};

import { ActionIcon, Affix, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { MoonStars, Sun } from "tabler-icons-react";

export const ThemeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <Affix position={{ top: 15, right: 15 }}>
      <ActionIcon
        variant="hover"
        color={dark ? "yellow" : "blue"}
        onClick={() => toggleColorScheme()}
        title="Changer de theme"
      >
        {dark ? <Sun size={32} /> : <MoonStars size={32} />}
      </ActionIcon>
    </Affix>
  );
};

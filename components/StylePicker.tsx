import { MultiSelect } from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";
import { mapPlaylistForStylePicker } from "../lib";

type Props = {
  selectedStyle: string[];
  setSelectedStyle: Dispatch<SetStateAction<string[]>>;
};

export const StylePicker = ({ selectedStyle, setSelectedStyle }: Props) => {
  const styles = mapPlaylistForStylePicker();
  return (
    <MultiSelect
      size="md"
      width={"100px"}
      data={styles}
      label="Choisissez les styles de musique souhaité"
      value={selectedStyle}
      onChange={setSelectedStyle}
    />
  );
};

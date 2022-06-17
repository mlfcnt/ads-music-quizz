import { Autocomplete, Box, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import React, { useState } from "react";
import { useDebounce } from "react-use";
import { useArtistSugestions } from "../../hooks/useArtistSugestions";

export const GuessForm = () => {
  const [guess, setGuess] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const autompleteArtists = useArtistSugestions({
    debouncedValue,
  });

  useDebounce(
    () => {
      setDebouncedValue(guess);
    },
    100,
    [guess]
  );

  const form = useForm({
    initialValues: {
      guess: "",
    },
  });
  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Autocomplete
          label="Qui est cet artiste...?"
          data={autompleteArtists || []}
          value={guess}
          onChange={setGuess}
        />
        <Group mt="md" position="right">
          <Button type="submit">Envoyer</Button>
        </Group>
      </form>
    </Box>
  );
};

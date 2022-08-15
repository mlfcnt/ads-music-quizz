import { Modal, Text, Space, Group, Button } from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  show: boolean;
  toggle: () => void;
  setReaction: Dispatch<SetStateAction<string | null>>;
};

export const ReactionModal = ({ show, toggle, setReaction }: Props) => {
  const reactions = ["👍", "👎"];

  const handleReaction = (e: any) => {
    e.preventDefault();
    setReaction(e?.target?.textContent || null);
    toggle();
  };

  return (
    <Modal withCloseButton={false} opened={show} onClose={toggle}>
      <>
        <Text size="lg">Qu&apos;avez vous pensé de cet artiste ?</Text>
        <Space h="lg" />
        <Group>
          {reactions.map((reaction) => (
            <Button
              key={reaction}
              color="gray"
              value={reaction}
              onClick={handleReaction}
            >
              {reaction}
            </Button>
          ))}
          <Button key={"no-reaction"} color="gray" onClick={handleReaction}>
            Pas d&apos;avis
          </Button>
        </Group>
      </>
    </Modal>
  );
};

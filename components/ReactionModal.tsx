import { Modal, Text, Space, Group, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useLRAuth } from "loginradius-react";
import { useRouter } from "next/router";
import React from "react";
import { Trophy } from "tabler-icons-react";
import { saveUserPoints } from "../api/points";
import { Artist } from "../api/spotify";

type Props = {
  show: boolean;
  toggle: () => void;
  pointsToSave: number;
  artist: Artist;
};

export const ReactionModal = ({
  show,
  toggle,
  pointsToSave,
  artist,
}: Props) => {
  const { user } = useLRAuth();
  const reactions = ["👍", "👎", "💩", "🥰", "😀", "😭", "🤷‍♀️"];
  const router = useRouter();

  const handleReaction = async (reaction?: string) => {
    if (!user) return;
    try {
      if (!user?.Uid) return;

      await saveUserPoints(
        user.Uid,
        pointsToSave,
        artist.id,
        artist.name,
        reaction
      );

      if (pointsToSave > 0) {
        showNotification({
          title: "Bien joué !",
          message: `+ ${pointsToSave} points !`,
          icon: <Trophy />,
        });
        router.reload();
      }
    } catch (error: any) {
      showNotification({
        title: "Bien tenté..",
        message: error?.message || "Error lors de la sauvegarde du score :/",
      });
    }
    toggle();
  };
  return (
    <Modal withCloseButton={false} opened={show} onClose={handleReaction}>
      <>
        <Text size="lg">Qu&apos;avez vous pensé de cet artiste ?</Text>
        <Space h="lg" />
        <Group>
          {reactions.map((reaction) => (
            <Button
              key={reaction}
              size="xl"
              color="gray"
              value={reaction}
              onClick={(e: any) => handleReaction(e.target.innerText)}
            >
              <span style={{ fontSize: "200%" }}>{reaction}</span>
            </Button>
          ))}
          <Button
            key={"no-reaction"}
            color="gray"
            onClick={() => handleReaction()}
            size="xl"
          >
            Pas d&apos;avis
          </Button>
        </Group>
      </>
    </Modal>
  );
};

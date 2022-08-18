import { Modal, Text, Space } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useLRAuth } from "loginradius-react";
import { useRouter } from "next/router";
import React from "react";
import { Trophy } from "tabler-icons-react";
import { saveUserPoints } from "../api/points";
import { Artist } from "../api/spotify";
import data from "@emoji-mart/data";
//@ts-ignore
import Picker from "@emoji-mart/react";

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
        <Text size="lg">Qu&apos;avez vous pensé de ces chansons ?</Text>
        <Space h="lg" />
        <Picker
          data={data}
          onEmojiSelect={(e: any) => handleReaction(e.native)}
        />
      </>
    </Modal>
  );
};

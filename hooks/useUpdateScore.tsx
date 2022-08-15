import { showNotification } from "@mantine/notifications";
import { useLRAuth } from "loginradius-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { Trophy } from "tabler-icons-react";
import { saveUserPoints } from "../api/points";

type Props = {
  hasWon: boolean | null;
  hasLost: boolean | null;
  isClassicMode: boolean;
  guessNumber: number;
  artistId: string;
};

export const useUpdateScore = ({
  hasWon,
  hasLost,
  isClassicMode,
  guessNumber,
  artistId,
}: Props) => {
  const { user } = useLRAuth();
  const router = useRouter();

  const savePoints = useCallback(
    async (type: "VICTORY" | "LOST") => {
      const isVictory = type === "VICTORY";
      try {
        if (!user?.Uid || !isClassicMode) return;
        const pointsToSave = isVictory ? 6 - guessNumber : 0;
        await saveUserPoints(user.Uid, pointsToSave, artistId);

        if (isVictory) {
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
    },
    [artistId, guessNumber, isClassicMode, router, user]
  );

  useEffect(() => {
    if (!hasWon && !hasLost) return;
    if (hasWon) {
      savePoints("VICTORY");
      return;
    }
    savePoints("LOST");
    return;
  }, [
    hasWon,
    hasLost,
    isClassicMode,
    user,
    guessNumber,
    router,
    artistId,
    savePoints,
  ]);
};

import { useLRAuth } from "loginradius-react";
import React from "react";
import { Artist } from "../api/spotify";
import { saveUserPoints } from "../api/points";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { User } from "loginradius-react/build/LRClient";

type Props = {
  guessNumber: number;
  hasLost: boolean;
  isClassicMode: boolean;
  artistId: Artist["id"];
};

export const ShareResults = ({
  guessNumber,
  hasLost,
  isClassicMode,
  artistId,
}: Props) => {
  const { user } = useLRAuth();
  const router = useRouter();

  if (hasLost) {
    return (
      <p>
        Aie aie aie... coup dur pour le joueur francais. Retente ta chance
        demain !
      </p>
    );
  }

  const handleSave = async (user: User) => {
    try {
      await saveUserPoints(user.Uid, 6 - guessNumber, artistId);
      <p>Vous avez trouvé en {guessNumber} essai(s)! Bravo</p>;
      router.reload();
    } catch (error: any) {
      showNotification({
        title: "Bien tenté..",
        message: error?.message || "Error lors de la sauvegarde du score :/",
      });
      return null;
    }
  };

  if (isClassicMode && user) {
    handleSave(user);
    return null;
  } else {
    return <p>Vous avez trouvé en {guessNumber} essai(s)! Bravo</p>;
  }
};

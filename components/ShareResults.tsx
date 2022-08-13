import { useLRAuth } from "loginradius-react";
import React from "react";
import { Artist } from "../api/spotify";
import { saveUserPoints } from "../api/points";

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
  if (hasLost) {
    return (
      <p>
        Aie aie aie... coup dur pour le joueur francais. Retente ta chance
        demain !
      </p>
    );
  }

  if (isClassicMode && user) {
    saveUserPoints(user.Uid, 6 - guessNumber, artistId);
  }
  return <p>Vous avez trouvé en {guessNumber} essai(s)! Bravo</p>;
};

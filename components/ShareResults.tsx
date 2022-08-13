import { useLRAuth } from "loginradius-react";
import React from "react";
import { Artist } from "../api/spotify";
import { saveUserScore } from "../api/user";

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
    console.log("HERE");
    saveUserScore(user.ID, 6 - guessNumber, artistId);
  }
  return <p>Vous avez trouvé en {guessNumber} essai(s)! Bravo</p>;
};

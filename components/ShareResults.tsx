import React from "react";

type Props = {
  guessNumber: number;
  hasWon: boolean;
  hasLost: boolean;
};

export const ShareResults = ({ guessNumber, hasWon, hasLost }: Props) => {
  if (hasLost) {
    return <p>Aie aie aie... coup dur pour le joueur francais</p>;
  }
  return <div>Vous avez trouvé en {guessNumber} essais! Bravo</div>;
};

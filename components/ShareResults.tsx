import React from "react";

type Props = {
  guessNumber: number;
  hasLost: boolean;
};

export const ShareResults = ({ guessNumber, hasLost }: Props) => {
  if (hasLost) {
    return (
      <p>
        Aie aie aie... coup dur pour le joueur francais. Retente ta chance
        demain !
      </p>
    );
  }
  return <p>Vous avez trouvé en {guessNumber + 1} essais! Bravo</p>;
};

import React from "react";
import { useTimeRemainingToNextArtist } from "../hooks/useTimeRemainingToNextArtist";

export const CountdownToNextGame = () => {
  const timeRemainingToNextArtist = useTimeRemainingToNextArtist();

  return (
    <span
      style={{
        position: "fixed",
        left: "50%",
        bottom: "20px",
        margin: "0 auto",
        transform: "translate(-50%, -50%)",
      }}
    >
      Prochaine partie {timeRemainingToNextArtist} ...
    </span>
  );
};

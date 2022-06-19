import { useState } from "react";
import { useInterval } from "react-use";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export const useTimeRemainingToNextArtist = () => {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useInterval(() => {
    setTimeRemaining(dayjs().endOf("day").fromNow());
  }, 1000);
  return timeRemaining;
};

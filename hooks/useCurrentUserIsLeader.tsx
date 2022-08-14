import { useLRAuth } from "loginradius-react";
import { useMemo } from "react";
import { useCurrentLeader } from "../api/points";

export const useCurrentUserIsLeader = () => {
  const { user } = useLRAuth();
  const currentLeaderId = useCurrentLeader();
  const isCurrentLeader = useMemo(
    () => user?.Uid === currentLeaderId,
    [currentLeaderId, user?.Uid]
  );
  return isCurrentLeader;
};

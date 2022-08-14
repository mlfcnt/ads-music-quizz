import { useLRAuth } from "loginradius-react";
import { useEffect, useState } from "react";
import { useCurrentLeader } from "../api/points";

export const useCurrentUserIsLeader = () => {
  const [isCurrentLeader, setIsCurrentLeader] = useState(false);
  const { user } = useLRAuth();
  const currentLeaderId = useCurrentLeader();
  useEffect(() => {
    if (!user?.Uid || !currentLeaderId) return;
    setIsCurrentLeader(user.Uid === currentLeaderId);
  }, [currentLeaderId, user?.Uid]);

  return isCurrentLeader;
};

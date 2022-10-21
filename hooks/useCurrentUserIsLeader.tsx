import { useLRAuth } from "loginradius-react";
import { User } from "loginradius-react/build/LRClient";
import { useEffect, useState } from "react";
import { useCurrentLeader } from "../api/points";

export const useCurrentUserIsLeader = (users: User[]) => {
  const [isCurrentLeader, setIsCurrentLeader] = useState(false);
  const { user } = useLRAuth();
  const currentLeaderId = useCurrentLeader(users);
  useEffect(() => {
    if (!user?.Uid || !currentLeaderId) return;
    setIsCurrentLeader(user.Uid === currentLeaderId);
  }, [currentLeaderId, user?.Uid]);

  return isCurrentLeader;
};

export const useCurrentLeaderName = (users: User[]) => {
  const currentLeaderId = useCurrentLeader(users);
  return users.find((x) => x.Uid === currentLeaderId)?.FirstName;
};

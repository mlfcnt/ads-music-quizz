import { User } from "loginradius-react/build/LRClient";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const fetchAllUsers = async () => {
  const { data: userIds } = await supabase.from("points").select("userId");
  const pluckedIds = (userIds || []).map((x) => x.userId);
  const uniqUsers = Array.from(new Set(pluckedIds));
  const users: User[] = [];
  for (const userId of uniqUsers) {
    const res = await fetch(
      `https://api.loginradius.com/identity/v2/manage/account/${userId}?apiKey=${process.env.NEXT_PUBLIC_LOGINRADIUS_API_KEY}&apiSecret=${process.env.NEXT_PUBLIC_LOGINRADIUS_API_SECRET}`
    );
    const json = await res.json();
    users.push(json);
  }
  return users;
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetchAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return { users };
};

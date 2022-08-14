import { Affix, Button, Group } from "@mantine/core";
import React, { ReactNode } from "react";
import { useLRAuth } from "loginradius-react";
import { useCurrentUserIsLeader } from "../hooks/useCurrentUserIsLeader";

export const Login = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useLRAuth();
  const currentUserIsLeader = useCurrentUserIsLeader();

  let content: ReactNode;

  if (!isAuthenticated) {
    content = <Button onClick={() => loginWithRedirect()}>Connexion</Button>;
  } else {
    content = (
      <>
        <p style={{ marginRight: "10px" }}>
          Hey {user?.FirstName}{" "}
          {currentUserIsLeader && (
            <span style={{ verticalAlign: "text-bottom" }}>👑</span>
          )}
        </p>
        <Button onClick={() => logout()}>Déconnexion</Button>
      </>
    );
  }

  return (
    <div>
      <Affix position={{ top: 15, left: 15 }}>{content}</Affix>
    </div>
  );
};

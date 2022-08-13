import { Affix, Button, Group } from "@mantine/core";
import React, { ReactNode } from "react";
import { useLRAuth } from "loginradius-react";

export const Login = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useLRAuth();

  let content: ReactNode;

  if (!isAuthenticated) {
    content = <Button onClick={() => loginWithRedirect()}>Connexion</Button>;
  } else {
    content = (
      <>
        <p style={{ marginRight: "10px" }}>Bonjour {user?.FirstName}</p>
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

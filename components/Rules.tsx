import { Button, Center, Modal, Space, Text, Title } from "@mantine/core";
import React, { useState } from "react";

export const Rules = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ textAlign: "right" }}>
      <Button color="gray" uppercase onClick={() => setShowModal(true)}>
        Règles du jeu
      </Button>
      <Modal
        withCloseButton={false}
        opened={showModal}
        onClose={() => setShowModal(false)}
      >
        <>
          <Text size="lg">
            Vous devez trouver l&apos;artiste du jour, en 5 essais ou moins.
          </Text>
          <Space h="lg" />
          <Text size="md">
            Lorsque vous envoyez une réponse incorrecte, l&apos;extrait suivant
            est disponible
          </Text>
          <Space h="lg" />
          <Text size="md">
            Les extraits sont de plus en plus facile (populaire) jusqu&apos;au
            5è qui est la chanson la plus populaire de l&apos;artiste mystère
          </Text>
          <Space h="lg" />
          <Text size="md">
            La partie se termine lorsque vous trouvez l&apos;artiste mystère ou
            que vous avez donné 5 mauvaises réponses
          </Text>
          <Space h="lg" />
          <Text size="md">
            L&apos;artiste mystère change toutes les 24 heures
          </Text>
          <Space h="lg" />
          <Text size="md">Good luck 👍👍</Text>
        </>
      </Modal>
    </div>
  );
};

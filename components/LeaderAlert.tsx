import React from "react";
import { Modal, Space, Text } from "@mantine/core";

type Props = {
  show: boolean;
  toggle: () => void;
};

export const LeaderAlert = ({ show, toggle }: Props) => {
  return (
    <Modal withCloseButton={false} opened={show} onClose={toggle}>
      <>
        <Text size="xl" align="center">
          👑
        </Text>
        <Space h="lg" />
        <Text size="lg">Tu es actuellement le leader de la semaine 😎</Text>
        <Space h="lg" />
        <Text size="md">
          Pour le moment ca n&apos;apporte pas d&apos;avantages autre que de
          l&apos;immense fierté, mais dans le futur peut être qu&apos;il y aura
          une histoire de récompense.. ou de gage 😈
        </Text>
        <Space h="lg" />
        <Text size="md">
          (si vous avez des idées cool n&apos;hésitez pas à les partager)
        </Text>
      </>
    </Modal>
  );
};

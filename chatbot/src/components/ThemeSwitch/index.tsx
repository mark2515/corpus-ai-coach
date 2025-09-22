import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";

export const ThemeSwitch = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
  return (
    <ActionIcon
      variant="subtle"
      size="xs"
      onClick={() => toggleColorScheme()}
    >
      {colorScheme === "dark" ? <IconMoon /> : <IconSun />}
    </ActionIcon>
  );
};
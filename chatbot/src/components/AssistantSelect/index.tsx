import React, { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { Assistant, AssistantList } from "@/types";
import assistantStore from "@/utils/assistantStore";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/slices/usersSlice";

type Props = {
  value: string;
  loading?: boolean;
  onChange: (value: Assistant) => void;
};

export const AssistantSelect = ({
  value,
  loading = false,
  onChange,
}: Props) => {
  const [list, setList] = useState<AssistantList>([]);
  const currentUser = useAppSelector(selectCurrentUser);
  useEffect(() => {
    const init = async () => {
      if (currentUser && !currentUser.isGuest) {
        const server = await assistantStore.syncAssistantsFromServer(currentUser._id);
        setList(server);
      } else {
        setList(assistantStore.getList());
      }
    };
    void init();
  }, [currentUser]);
  const onAssistantChange = (value: string) => {
    const assistant = list.find((item) => item.id === value);
    onChange(assistant!);
  };

  return (
    <Select
      size="sm"
      onChange={onAssistantChange}
      value={value}
      className="w-48 mx-5"
      disabled={loading}
      data={list.map((item) => ({
        value: item.id,
        label: item.name,
      }))}
    ></Select>
  );
};

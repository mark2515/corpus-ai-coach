import React, { useEffect, useState } from "react";
import * as chatStorage from "@/utils/chatStorage";
import { Message } from "@/components/Message";
import { Session } from "../Session";
import { MediaQuery } from "@mantine/core";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/slices/usersSlice";
import { updateMessage } from "@/utils/chatStorage";

export const Chat = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const currentUser = useAppSelector(selectCurrentUser);
  const isGuest = currentUser?.isGuest || (currentUser === null);
  useEffect(() => {
    const init = () => {
      const list = chatStorage.getSessionStore();
      const id = list[0].id;
      setSessionId(id);
      if (!isGuest) {
        updateMessage(sessionId, []);
      }
    };
    init();
  }, [isGuest]);

  return (
    <div className="h-screen flex w-screen">
      <MediaQuery
        smallerThan="md"
        styles={{
          width: "0 !important",
          padding: "0 !important",
          overflow: "hidden",
        }}
      >
        <Session sessionId={sessionId} onChange={setSessionId}></Session>
      </MediaQuery>
      <Message sessionId={sessionId}></Message>
    </div>
  );
};
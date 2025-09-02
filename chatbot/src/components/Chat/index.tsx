import React, { useEffect, useState } from "react";
import * as chatStorage from "@/utils/chatStorage";
import { getCookie } from "@/utils/storage";
import { CURRENT_SESSION_COOKIE } from "@/utils/constant";
import { Message } from "@/components/Message";
import { Session } from "../Session";
import { MediaQuery } from "@mantine/core";
import assistantStore from "@/utils/assistantStore";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/slices/usersSlice";

export const Chat = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const init = async () => {
      let list;
      if (currentUser && currentUser._id && !currentUser.isGuest) {
        try {
          await assistantStore.syncAssistantsFromServer(currentUser._id);
          list = await chatStorage.syncSessionsFromServer(currentUser._id);
        } catch (error) {
          console.error("Failed to sync data from server:", error);
          list = chatStorage.getSessionStore();
        }
      } else {
        list = chatStorage.getSessionStore();
      }
      
      if (list && list.length > 0) {
        const savedSessionId = getCookie(CURRENT_SESSION_COOKIE);
        const sessionExists = savedSessionId && list.some(session => session.id === savedSessionId);
        
        if (sessionExists) {
          setSessionId(savedSessionId);
        } else {
          setSessionId(list[0].id);
        }
      }
    };
    void init();
  }, [currentUser]);

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
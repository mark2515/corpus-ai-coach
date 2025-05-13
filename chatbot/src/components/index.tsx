import { useEffect, useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea, Button } from "@mantine/core";
import { getChatLogs, updateChatLogs } from "@/utils/chatStorage";
import { ChatLogsType } from "@/types";
import clsx from "clsx";

const LOCAL_KEY = 'ai_demo';

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  const [chatList, setChatList] = useState<ChatLogsType>([]);

  useEffect(()=>{
    const logs = getChatLogs(LOCAL_KEY);
    setChatList(logs);
  }, []);

  const setChatLogs = (logs: ChatLogsType) => {
    setChatList(logs);
    updateChatLogs(LOCAL_KEY, logs);
  }

  const getAIResp = async() => {
    const list = [
      ...chatList,
      {
        role: "user",
        content: prompt,
      },
    ];
    setChatLogs(list);
    const resp = await getCompletion({
      prompt: prompt,
    });
    setCompletion(resp.content);
    setChatLogs([
      ...list,
      {
        role: "assistant",
        content: resp.content,
      },
    ]);
  }

  return (
    <div className="h-screen flex flex-col items-center">
      <div
        className={clsx([
          "flex-col",
          "h-[calc(100vh-10rem)]",
          "w-full",
          "overflow-y-auto",
          "rounded-sm",
          "px-8",
        ])}
      >
        {chatList.map((item, idx) => (
          <div key={`${item.role}-${idx}`}
          className={clsx(
            {
              flex: item.role === "user",
              "flex-col": item.role === "user",
              "items-end": item.role === "user",
            },
            "mt-4",
          )}>
            <div> {item.role} </div>
            <div
              className={clsx(
                "rounded-md",
                "shadow-md",
                "px-4",
                "py-2",
                "mt-1",
                "w-full",
                "max-w-4xl"
              )}
            > 
             {item.content} 
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center w-3/5">
        <Textarea
        className="w-full"
        value={prompt} 
        onChange={(evt)=>setPrompt(evt.target.value)}
        placeholder="Enter your prompt">
        </Textarea>
        <Button
          style={{ color: 'white', backgroundColor: 'green'}}
          onClick={() => getAIResp()}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
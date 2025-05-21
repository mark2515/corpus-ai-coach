import { useEffect, useState, KeyboardEvent } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { ActionIcon, Textarea } from "@mantine/core";
import { clearChatLogs, getChatLogs, updateChatLogs } from "@/utils/chatStorage";
import { IconSend, IconEraser } from "@tabler/icons-react";
import { ChatLogsType } from "@/types";
import clsx from "clsx";

const LOCAL_KEY = 'ai_demo';

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [completion, setCompletion] = useState<string>("");
  const [chatList, setChatList] = useState<ChatLogsType>([]);

  useEffect(()=>{
    const logs = getChatLogs(LOCAL_KEY);
    setChatList(logs);
  }, []);

  const onClear = () => {
    clearChatLogs(LOCAL_KEY);
    setChatList([]);
  }

  const onKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if(evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      getAIResp();
    }
  }

  const setChatLogs = (logs: ChatLogsType) => {
    setChatList(logs);
    updateChatLogs(LOCAL_KEY, logs);
  }

  const getAIResp = async() => {
    setLoading(true);
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
      history: chatList.slice(-4),
    });
    setPrompt("");
    setCompletion(resp.content);
    setChatLogs([
      ...list,
      {
        role: "assistant",
        content: resp.content,
      },
    ]);
    setLoading(false);
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
        <ActionIcon className="mr-2" disabled={loading} onClick={()=>onClear()}>
          <IconEraser></IconEraser>
        </ActionIcon>
        <Textarea
        className="w-full"
        value={prompt} 
        disabled={loading}
        onKeyDown={(evt) => onKeyDown(evt)}
        onChange={(evt)=>setPrompt(evt.target.value)}
        placeholder="Enter your prompt">
        </Textarea>
        <ActionIcon className="ml-2" loading={loading} onClick={()=>getAIResp()}>
          <IconSend></IconSend>
        </ActionIcon>
      </div>
    </div>
  )
}
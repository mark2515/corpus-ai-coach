import { useEffect, useState, KeyboardEvent } from "react";
import chatService from "@/utils/chatService";
import { ActionIcon, Textarea } from "@mantine/core";
import { clearMessage, getMessage, updateMessage } from "@/utils/chatStorage";
import { IconSend, IconSendOff, IconEraser } from "@tabler/icons-react";
import { MessageList } from "@/types";
import clsx from "clsx";

const LOCAL_KEY = 'ai_demo';

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<MessageList>([]);

  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: () => {
      setLoading(false);
    }
  }

  useEffect(()=>{
    const logs = getMessage(LOCAL_KEY);
    setChatList(logs);
  }, []);

  const onClear = () => {
    clearMessage(LOCAL_KEY);
    setChatList([]);
  }

  const onKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if(evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      onSubmit();
    }
  }

  const setSuggestion = (suggestion: string) => {
    if(suggestion === '') return;
    const len = chatList.length;
    const lastMessage = len ? chatList[len - 1] : null;
    let newList : MessageList = [];
    if(lastMessage?.role === 'assistant') {
      newList = [
        ...chatList.slice(0, len - 1),
        {
          ...lastMessage,
          content: suggestion
        }
      ]
    } else {
      newList = [
        ...chatList,
        {
          role: "assistant",
          content: suggestion
        }
      ]
    }
    setMessages(newList);
  }

  const setMessages = (msg: MessageList) => {
    setChatList(msg);
    updateMessage(LOCAL_KEY, msg);
  }

  const onSubmit = () => {
    if(loading) {
      return chatService.cancel();
    }
    if(!prompt.trim()) return;
    let list : MessageList = [
      ...chatList,
      {
        role: "user",
        content: prompt,
      },
    ];
    setMessages(list);
    setLoading(true);
    chatService.getStream({
      prompt,
      history: list.slice(-6),
    });
    setPrompt("");
  };

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
        <ActionIcon className="ml-2" onClick={()=>onSubmit()}>
          { loading ? <IconSendOff /> : <IconSend /> }
        </ActionIcon>
      </div>
    </div>
  )
}
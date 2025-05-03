import { useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea, Button } from "@mantine/core";
import { ChatLogsType } from "@/types";

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  const [chatList, setChatList] = useState<ChatLogsType>([]);

  const getAIResp = async() => {
    const list = [
      ...chatList,
      {
        role: "user",
        content: prompt,
      },
    ];
    setChatList(list);
    const resp = await getCompletion({
      prompt: prompt,
    });
    setCompletion(resp.content);
    setChatList([
      ...list,
      {
        role: "assistant",
        content: resp.content,
      },
    ]);
  }

  return (
    <div className="h-screen flex flex-col items-center">
      <div>
        {chatList.map((item, idx) => <div key={`${item.role}-${idx}`}>
            <div> {item.role} </div>
            <div> {item.content} </div>
          </div>
        )}
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
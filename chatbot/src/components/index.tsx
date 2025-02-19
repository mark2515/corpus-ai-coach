import { useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea, Button } from "@mantine/core";

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  const getAIResp = async() => {
    const resp = await getCompletion({
      prompt: prompt,
    });
    setCompletion(resp.content);
  }

  return (
    <div className="h-screen flex flex-col items-center">
      <div>
        {completion}
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
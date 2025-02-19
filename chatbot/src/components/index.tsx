import { useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea } from "@mantine/core";

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");

  return (
    <div className="p-10">
      <div>
        {completion}
      </div>
      <Textarea
      style={{width: '60%'}}
      value={prompt} 
      onChange={(evt)=>setPrompt(evt.target.value)}
      placeholder="Enter your prompt">
      </Textarea>
    </div>
  )
}
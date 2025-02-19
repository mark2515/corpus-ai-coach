import { useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { Textarea } from "@mantine/core";

export const Chat = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div>
      <Textarea
      style={{width: '60%'}}
      value={prompt} 
      onChange={(evt)=>setPrompt(evt.target.value)}
      placeholder="Enter your prompt">
      </Textarea>
    </div>
  )
}
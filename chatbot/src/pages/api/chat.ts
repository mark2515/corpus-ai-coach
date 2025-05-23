import type { NextRequest } from "next/server";
import {createParser, ParseEvent, ReconnectInterval} from 'eventsource-parser'
import { type MessageList } from "@/types";

type StreamPayload = {
  model: string;
  message: MessageList;
  temperature?: number;
  stream: boolean;
  max_token?: number;
}

export default async function handler(req: NextRequest) {

  const { prompt, history = [], options = {} } = await req.json();

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "you are a language learn chatbot"
      },
      ...history,
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    ...options,
  };

  const stream = await requestStream(data);
  return new Response(stream);
}

const requestStream = async (payload: StreamPayload) => {
  let counter = 0;
  const resp = await fetch(`${process.env.END_POINT}/v1/chat/completions`, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  if(resp.status !== 200) {
    return resp.body;
  }
  return createStream(resp, counter);
}

const createStream = (response: Response, counter: number) => {
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParseEvent | ReconnectInterval) => {
        if(event.type === "event") {
          const data = event.data
          if(data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0]?.delta?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const q = encoder.encode(text);
            controller.enqueue(q);
            counter++;
          } catch (error) {

          }
        }
      }
      const parser = createParser(onParse);
      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  })
}

export const config = {
  runtime: "edge"
}
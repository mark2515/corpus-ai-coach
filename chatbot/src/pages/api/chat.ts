import type { NextRequest } from "next/server";
import { type MessageList } from "@/types";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { MAX_TOKEN, OPENAI_END_POINT, TEAMPERATURE, TOP_P } from "@/utils/constant";

type StreamPayload = {
  model: string;
  messages: MessageList;
  temperature?: number;
  top_p?: number;
  stream: boolean;
  max_tokens?: number;
};

export default async function handler(req: NextRequest) {
  const { prompt, history = [], options = {} } = await req.json();
  const { temperature, top_p, max_tokens } = options;
  const data = {
    model: options.model || "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: options.prompt,
      },
      ...history,
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    temperature: +temperature || TEAMPERATURE,
    top_p: +top_p || TOP_P,
    max_tokens: max_tokens || MAX_TOKEN,
  };

  const stream = await requestStream(data);
  return new Response(stream);
}

const requestStream = async (payload: StreamPayload) => {
  let counter = 0;
  const resp = await fetch(
    `${process.env.END_POINT ?? OPENAI_END_POINT}/v1/chat/completions`,
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  if (resp.status !== 200) {
    return resp.body;
  }
  return createStream(resp, counter);
};

const createStream = (response: Response, counter: number) => {
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
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
          } catch (error) {}
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
};

export const config = {
  runtime: "edge",
};
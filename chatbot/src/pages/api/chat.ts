import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { prompt, history = [], options = {} } = await req.body;

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
    ...options,
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: any = await resp.json();
  res.status(200).json({...json.choices[0].message});
}
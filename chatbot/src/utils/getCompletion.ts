import { ChatLogType } from "@/types";

type Props = {
    prompt: string;
    history?: ChatLogType[];
    options?: {
        temperature?: number;
        max_token?: number;
    };
}

export const getCompletion = async (params: Props) => {
    const resp = await fetch("/api/chat", {
        body: JSON.stringify({params})
    })
    if(!resp.ok) {
        throw new Error(resp.statusText);
    }

    const data = resp.json;
    return data;
}
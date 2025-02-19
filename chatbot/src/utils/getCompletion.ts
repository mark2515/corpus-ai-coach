import { ChatLogType } from "@/types";

type Props = {
    prompt: string;
    history?: ChatLogType[];
    options?: {
        temperature?: number;
        max_token?: number;
    };
};

export const getCompletion = async (params: Props) => {
    const resp = await fetch("/api/chat", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(params),
    })
    if(!resp.ok) {
        throw new Error(resp.statusText);
    }

    return await resp.json();
}
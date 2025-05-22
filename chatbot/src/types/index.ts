export type Role = "user" | "assistant" | "system";

export type Message = {
    role: Role;
    content: string;
}

export type MessageList = Message[];

export type ChatLogsStorageType = {
    [key: string]: MessageList
};
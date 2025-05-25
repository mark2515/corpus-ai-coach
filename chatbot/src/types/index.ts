export type Role = "user" | "assistant" | "system";

export type Message = {
    role: Role;
    content: string;
}

export type MessageList = Message[];

export type Session = {
    name: string;
    id: string;
};

export type SessionList = Session[];

export type ChatLogsStorageType = {
    [key: string]: MessageList
};
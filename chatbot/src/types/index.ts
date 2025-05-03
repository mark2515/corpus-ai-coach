export type ChatLogType = {
    role: string;
    content: string;
}

export type ChatLogsType = ChatLogType[];

export type ChatLogsStorageType = {
    [key: string]: ChatLogsType
};
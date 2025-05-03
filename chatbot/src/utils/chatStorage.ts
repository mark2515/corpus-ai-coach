import { ChatLogsType, ChatLogsStorageType } from "@/types";
import { getLocal, setLocal } from "./storage";

const CHAT_LOGS_KEY = "ai_chatLogs";

export const getChatLogsContainer = () => {
    let list = getLocal<ChatLogsStorageType>
    (CHAT_LOGS_KEY);
    if(!list) {
        list = {};
        setLocal(CHAT_LOGS_KEY, list);
    }
    return list;
};

export const getChatLogs = (id: string) => {
    const logs = getChatLogsContainer()
    return logs[id] || [];
}

export const updateChatLogs = (id: string, log: ChatLogsType) => {
    const logs = getChatLogsContainer();
    if(logs[id]) {
        logs[id] = log;
        setLocal(CHAT_LOGS_KEY, logs);
    }
}

export const clearChatLogs = (id: string) => {
    const logs = getChatLogsContainer();
    if(logs[id]) {
        logs[id] = [];
    }
    setLocal(CHAT_LOGS_KEY, logs);
}
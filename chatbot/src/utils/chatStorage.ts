import { SESSION_STORE, MESSAGE_STORE } from "./constant";
import type {
  ChatLogsStorageType,
  MessageList,
  Session,
  SessionInfo,
  SessionList,
} from "@/types";
import { getLocal, setLocal } from "./storage";
import assistantStore from "./assistantStore";
import { API_BASE } from "./constant";

/* Message */
export const getMessageStore = () => {
  let list = getLocal<ChatLogsStorageType>(MESSAGE_STORE);
  if (!list) {
    list = {};
    setLocal(MESSAGE_STORE, list);
  }
  return list;
};

export const getMessage = (id: string) => {
  const logs = getMessageStore();
  return logs[id] || [];
};

export const updateMessage = (id: string, log: MessageList) => {
  const logs = getMessageStore();
  logs[id] = log;
  setLocal(MESSAGE_STORE, logs);
};

export const clearMessage = (id: string) => {
  const logs = getMessageStore();
  if (logs[id]) {
    logs[id] = [];
  }
  setLocal(MESSAGE_STORE, logs);
};

export const clearMessagesFromServer = async (sessionId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/messages/session/${sessionId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    await res.json();
    return true;
  } catch (e) {
    console.error("Failed to clear messages from server:", e);
    return false;
  }
};

export const syncMessagesFromServer = async (userId: string, sessionId: string): Promise<MessageList> => {
  try {
    const res = await fetch(`${API_BASE}/messages?userId=${encodeURIComponent(userId)}&sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const serverMessages = await res.json();
    
    const normalizedMessages: MessageList = serverMessages.map((msg: any) => ({
      _id: msg._id,
      role: msg.role,
      content: msg.content,
      user: msg.user,
      session: msg.session,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));
    
    updateMessage(sessionId, normalizedMessages);
    return normalizedMessages;
  } catch (e) {
    console.error("Failed to sync messages from server:", e);
    return getMessage(sessionId);
  }
};

/* Session */
export const getSessionStore = (): SessionList => {
  let list: SessionList = getLocal(SESSION_STORE) as SessionList;
  const assistant = assistantStore.getList()[0];
  if (!list) {
    const session = {
      name: "Session-1",
      assistant: assistant.id,
      id: Date.now().toString(),
    };
    list = [session];
    updateMessage(session.id, []);
    setLocal(SESSION_STORE, list);
  }
  return list;
};

export const updateSessionStore = (list: SessionList) => {
  setLocal(SESSION_STORE, list);
};

export const addSession = async (session: Session, userId?: string): Promise<SessionList> => {
  const list = getSessionStore();
  list.unshift(session);
  updateSessionStore(list);
  if (userId) {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          name: session.name,
          assistant: session.assistant,
        }),
      });
      const created = await res.json();
      const newList = getSessionStore().map((s) => (s.id === session.id ? { ...s, id: created._id } : s));
      updateSessionStore(newList);
      return newList;
    } catch (e) {
      console.error("Failed to save session to DB:", e);
    }
  }
  return list;
};

export const getSession = (id: string): SessionInfo | null => {
  const list = getSessionStore();

  const session = list.find((session) => session.id === id);
  if (!session) return null;

  const { assistant } = session;
  let assistantInfo = assistantStore.getAssistant(assistant);
  if (!assistantInfo) {
    assistantInfo = assistantStore.getList()[0];
    updateSession(session.id, { assistant: assistantInfo.id });
  }
  return {
    ...session,
    assistant: assistantInfo,
  };
};

export const updateSession = (
  id: string,
  data: Partial<Omit<Session, "id">>, 
  userId?: string,
): SessionList => {
  const list = getSessionStore();
  const index = list.findIndex((session) => session.id === id);
  if (index > -1) {
    list[index] = {
      ...list[index],
      ...data,
    };
    updateSessionStore(list);
  }
  if (userId) {
    fetch(`${API_BASE}/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((e) => console.error("Failed to update session in DB:", e));
  }
  return list;
};

export const removeSession = (id: string, userId?: string) => {
  const list = getSessionStore();
  const newList = list.filter((session) => session.id !== id);
  updateSessionStore(newList);
  if (userId) {
    fetch(`${API_BASE}/sessions/${id}`, { method: "DELETE" }).catch((e) =>
      console.error("Failed to delete session in DB:", e),
    );
  }
  return newList;
};

export const syncSessionsFromServer = async (userId: string) => {
  try {
    const res = await fetch(`${API_BASE}/sessions?user=${encodeURIComponent(userId)}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const serverList = await res.json();
    
    if (!Array.isArray(serverList)) {
      console.error("Server returned non-array response:", serverList);
      return getSessionStore();
    }
    
    const normalized: SessionList = serverList.map((item: any) => ({
      id: item._id,
      name: item.name,
      assistant: item.assistant,
    }));
    
    if (normalized.length > 0) {
      updateSessionStore(normalized);
      return normalized;
    }
    return getSessionStore();
  } catch (e) {
    console.error("Failed to sync sessions:", e);
    return getSessionStore();
  }
};

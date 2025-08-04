export type Role = "user" | "assistant" | "system";

export type Message = {
  role: Role;
  content: string;
};

export type MessageList = Message[];

export type Session = {
  name: string;
  assistant: string;
  id: string;
};
export type SessionInfo = Omit<Session, "assistant"> & {
  assistant: Assistant;
};
export type SessionList = Session[];

export type ChatLogsStorageType = {
  [key: string]: MessageList;
};

export type Assistant = {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  temperature?: number;
  max_log: number;
  max_tokens: number;
};

export type AssistantList = Assistant[];

export type EditAssistant = Omit<Assistant, "id"> & Partial<Pick<Assistant, "id">>;

export type User = {
  _id: string;
  name: string;
  email: string;
  picture: string;
  isGuest: boolean;
};
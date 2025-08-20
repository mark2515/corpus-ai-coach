export type Role = "user" | "assistant" | "system";

export type Message = {
  _id?: string;
  role: Role;
  content: string;
  user?: string;
  session?: string;
  createdAt?: string;
  updatedAt?: string;
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
  model?: string;
  description?: string;
  prompt: string;
  temperature?: number;
  top_p?: number;
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
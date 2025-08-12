export const MESSAGE_STORE = "ai_assistant_message";
export const SESSION_STORE = "ai_assistant_session";
export const ASSISTANT_STORE = "ai_assistant_assistant";

export const MAX_TOKEN = 800;
export const TEAMPERATURE = 0.7;
export const TOP_P = 0.9;

export const ASSISTANT_INIT = [
  {
    name: "Chatbot No.1",
    model: "gpt-3.5-turbo",
    prompt: "You are a language-learn chatbot. Your task is to communicate with users using appropriate and natural English.",
    temperature: 0.7,
    top_p: 0.9,
    max_log: 4,
    max_tokens: 800,
  },
];

export const OPENAI_END_POINT = "https://api.openai.com";

export const API_BASE = "http://localhost:5000/api";

export const USERMAP = {
  user: "👨‍💻‍",
  assistant: "🤖",
  system: "⚙️",
};
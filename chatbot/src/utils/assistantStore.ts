import { getLocal, setLocal } from "./storage";
import { ASSISTANT_STORE, ASSISTANT_INIT, API_BASE } from "./constant";
import type { AssistantList, Assistant } from "@/types";

const getList = (): AssistantList => {
  let list = getLocal(ASSISTANT_STORE) as AssistantList;
  if (!list) {
    list = ASSISTANT_INIT.map((item, index) => {
      return {
        ...item,
        id: index + Date.now().toString(),
      };
    });
    updateList(list);
  }
  return list;
};

const updateList = (list: AssistantList) => {
  setLocal(ASSISTANT_STORE, list);
};

const addAssistant = async (assistant: Assistant, userId?: string): Promise<AssistantList> => {
  const list = getList();
  list.push(assistant);
  updateList(list);

  if (userId) {
    try {
      const res = await fetch(`${API_BASE}/assistants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          name: assistant.name,
          model: assistant.model,
          description: assistant.description,
          prompt: assistant.prompt,
          temperature: assistant.temperature,
          top_p: assistant.top_p,
          max_log: assistant.max_log,
          max_tokens: assistant.max_tokens,
        }),
      });
      const created = await res.json();
      const newList = getList().map((a) => (a.id === assistant.id ? { ...a, id: created._id } : a));
      updateList(newList);
      return newList;
    } catch (e) {
      console.error("Failed to save assistant to DB:", e);
    }
  }

  return list;
};

const updateAssistant = async (
  id: string,
  data: Partial<Omit<Assistant, "id">>,
  userId?: string,
): Promise<AssistantList> => {
  const list = getList();
  const index = list.findIndex((item) => item.id === id);
  if (index > -1) {
    list[index] = {
      ...list[index],
      ...data,
    };
    updateList(list);
  }

  if (userId) {
    try {
      await fetch(`${API_BASE}/assistants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Failed to update assistant in DB:", e);
    }
  }
  return getList();
};

const removeAssistant = async (id: string, userId?: string): Promise<AssistantList> => {
  const list = getList();
  const newList = list.filter((item) => item.id !== id);
  updateList(newList);

  if (userId) {
    try {
      await fetch(`${API_BASE}/assistants/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete assistant in DB:", e);
    }
  }

  return newList;
};

const getAssistant = (id: string): Assistant | null => {
  const list = getList();
  return list.find((item) => item.id === id) || null;
};

const syncFromServer = async (userId: string) => {
  try {
    const res = await fetch(`${API_BASE}/assistants?user=${encodeURIComponent(userId)}`);
    const serverList = await res.json();
    const normalized: AssistantList = serverList.map((item: any) => ({
      id: item._id,
      name: item.name,
      model: item.model,
      description: item.description,
      prompt: item.prompt,
      temperature: item.temperature,
      top_p: item.top_p,
      max_log: item.max_log,
      max_tokens: item.max_tokens,
    }));
    if (normalized.length > 0) {
      updateList(normalized);
      return normalized;
    }
    return getList();
  } catch (e) {
    console.error("Failed to sync assistants:", e);
    return getList();
  }
};

export default {
  getList,
  updateList,
  addAssistant,
  updateAssistant,
  removeAssistant,
  getAssistant,
  syncFromServer,
};
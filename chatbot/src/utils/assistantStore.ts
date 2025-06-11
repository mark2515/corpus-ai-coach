import { getLocal, setLocal } from "./storage";
import { ASSISTANT_STORE, ASSISTANT_INIT } from "./constant";
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

const addAssistant = (assistant: Assistant): AssistantList => {
  const list = getList();
  list.push(assistant);
  updateList(list);
  return list;
};

const updateAssistant = (
  id: string,
  data: Partial<Omit<Assistant, "id">>,
): AssistantList => {
  const list = getList();
  const index = list.findIndex((item) => item.id === id);
  if (index > -1) {
    list[index] = {
      ...list[index],
      ...data,
    };
    updateList(list);
  }
  return list;
};

const removeAssistant = (id: string): AssistantList => {
  const list = getList();
  const newList = list.filter((item) => item.id !== id);
  updateList(newList);
  return newList;
};

const getAssistant = (id: string): Assistant | null => {
  const list = getList();
  return list.find((item) => item.id === id) || null;
};

export default {
  getList,
  addAssistant,
  updateAssistant,
  removeAssistant,
  getAssistant,
};
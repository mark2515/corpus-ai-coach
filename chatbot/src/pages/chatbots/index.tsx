import type { AssistantList, EditAssistant } from "@/types";
import assistantStore from "@/utils/assistantStore";
import { ASSISTANT_INIT } from "@/utils/constant";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { AssistantConfig } from "@/components/AssistantConfig";
import Link from "next/link";
import { ActionIcon, Card, Text, Group, Drawer, Badge } from "@mantine/core";
import { IconChevronLeft, IconUserPlus, IconPencil } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const showNotification = (message: string) => {
  notifications.show({
    id: "Success",
    title: "Success",
    message,
    color: "green",
    autoClose: 1000,
  });
};

const Assistant: NextPage = () => {
  const router = useRouter();
  const [assistantList, setAssistantList] = useState<AssistantList>([]);
  const [opened, drawerHandler] = useDisclosure(false);
  const [editAssistant, setEditAssistant] = useState<EditAssistant>();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!isReady) return;

    const init = async () => {
      setLoading(true);
      
      const urlUserId = router.query.id as string;
      
      if (!urlUserId) {
        const cookieUserId = getCurrentUserId();
        if (cookieUserId) {
          router.replace(`/chatbots?id=${cookieUserId}`);
          return;
        } else {
          router.replace('/chatbots?id=guest');
          return;
        }
      }

      try {
        if (urlUserId === 'guest') {
          const list = assistantStore.getList();
          setAssistantList(list);
        } else {
          const list = await assistantStore.syncAssistantsFromServer(urlUserId);
          setAssistantList(list);
        }
      } catch (error) {
        console.error("Failed to load assistants:", error);
        const list = assistantStore.getList();
        setAssistantList(list);
      } finally {
        setLoading(false);
      }
    };
    
    void init();
  }, [isReady, router]);

  const getCurrentUserId = () => {
    return router.query.id as string;
  };

  const saveAssistant = async (data: EditAssistant) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    if (data.id) {
      const newAssistantList = await assistantStore.updateAssistant(
        data.id,
        data,
        userId === 'guest' ? undefined : userId,
      );
      setAssistantList(newAssistantList);
    } else {
      const newAssistant = {
        ...data,
        id: Date.now().toString(),
      };
      const newAssistantList = await assistantStore.addAssistant(
        newAssistant,
        userId === 'guest' ? undefined : userId,
      );
      setAssistantList(newAssistantList);
    }
    showNotification("Save Successfully");
    drawerHandler.close();
  };

  const removeAssistant = async (id: string) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const newAssistantList = await assistantStore.removeAssistant(
      id,
      userId === 'guest' ? undefined : userId,
    );
    setAssistantList(newAssistantList);
    showNotification("Remove Successfully");
    drawerHandler.close();
  };

  const onEditAssistant = (data: EditAssistant) => {
    setEditAssistant(data);
    drawerHandler.open();
  };

  const onAddAssistant = () => {
    const newAssistant = {
      ...ASSISTANT_INIT[0],
      name: `Chatbot No.${assistantList.length + 1}`,
    };
    setEditAssistant(newAssistant);
    drawerHandler.open();
  };

  if (!isReady || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between p-4 shadow-sm">
        <Link href="/">
          <ActionIcon>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        <Text weight={500} size="lg">
          Chatbot Management
        </Text>
        <ActionIcon onClick={() => onAddAssistant()}>
          <IconUserPlus></IconUserPlus>
        </ActionIcon>
      </div>

      <div className="flex gap-8 flex-wrap p-4 overflow-y-auto">
        {assistantList.map((item) => (
          <Card
            key={item.id}
            shadow="sm"
            padding="lg"
            radius="md"
            className="w-full max-w-sm group transition-all duration-300 relative"
          >
            <Text weight={500} className="line-clamp-1">
              {item.name}
            </Text>
            <Text size="sm" color="dimmed" className="line-clamp-3 mt-2">
              {item.prompt}
            </Text>
            <Group className="mt-4 flex items-center flex-wrap">
              <Badge size="md" color="violet" radius="sm">
                MODEL: {item.model}
              </Badge>
              <Badge size="md" color="green" radius="sm">
                TOKEN: {item.max_tokens}
              </Badge>
              <Badge size="md" color="blue" radius="sm">
                TEMP: {item.temperature}
              </Badge>
              <Badge size="md" color="blue" radius="sm">
                TOP_P: {item.top_p}
              </Badge>
              <Badge size="md" color="cyan" radius="sm">
                LOGS: {item.max_log}
              </Badge>
            </Group>
            
            <ActionIcon 
              size="sm" 
              onClick={() => onEditAssistant(item)}
              className="absolute bottom-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 bg-gray-100 hover:bg-gray-200"
            >
              <IconPencil />
            </ActionIcon>
          </Card>
        ))}
      </div>
      <Drawer
        opened={opened}
        onClose={drawerHandler.close}
        size="lg"
        position="right"
      >
        <AssistantConfig
          assistant={editAssistant!}
          save={saveAssistant}
          remove={removeAssistant}
        />
      </Drawer>
    </div>
  );
};

export default Assistant;

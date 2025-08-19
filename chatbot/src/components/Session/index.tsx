import type { Session as ISession, SessionList } from "@/types";
import * as chatStorage from "@/utils/chatStorage";
import React, { useEffect, useState } from "react";
import { IconTrash, IconMessagePlus } from "@tabler/icons-react";
import { EditableText } from "../EditableText";
import assistantStore from "@/utils/assistantStore";
import {
  useMantineColorScheme,
  ActionIcon,
  Modal,
  Button,
  Drawer,
  useMantineTheme,
  MediaQuery,
  Burger,
} from "@mantine/core";
import clsx from "clsx";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/slices/usersSlice";

type Props = {
  sessionId: string;
  onChange: (arg: string) => void;
  className?: string;
};

const itemBaseClasses = "flex cursor-pointer h-[2.4rem] items-center justify-around group px-4 rounded-md";

const generateItemClasses = (
  id: string,
  sessionId: string,
  colorScheme: string,
) => {
  return clsx([
    itemBaseClasses,
    {
      "hover:bg-gray-300/60": colorScheme === "light",
      "bg-gray-200/60": id !== sessionId && colorScheme === "light",
      "bg-gray-300": id === sessionId && colorScheme === "light",
      "hover:bg-zinc-800/50": colorScheme === "dark",
      "bg-zinc-800/20": id !== sessionId && colorScheme === "dark",
      "bg-zinc-800/90": id === sessionId && colorScheme === "dark",
    },
  ]);
};

export const Session = ({ sessionId, onChange, className }: Props) => {
  const [sessionList, setSessionList] = useState<SessionList>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useMantineTheme();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const init = async () => {
      if (currentUser && !currentUser.isGuest) {
        await assistantStore.syncAssistantsFromServer(currentUser._id);
        const list = await chatStorage.syncSessionsFromServer(currentUser._id);
        setSessionList(list);
      } else {
        const list = chatStorage.getSessionStore();
        setSessionList(list);
      }
    };
    void init();
  }, [currentUser]);

  const createSession = () => {
    const assistantList = assistantStore.getList();
    const newSession: ISession = {
      name: `Session-${sessionList.length + 1}`,
      assistant: assistantList[0].id,
      id: Date.now().toString(),
    };
    onChange(newSession.id);
    const save = async () => {
      await chatStorage.addSession(
        newSession,
        currentUser && !currentUser.isGuest ? currentUser._id : undefined,
      );

      if (currentUser && !currentUser.isGuest) {
        const remoteList = await chatStorage.syncSessionsFromServer(currentUser._id);
        setSessionList(remoteList);
        if (remoteList.length > 0) {
          onChange(remoteList[0].id);
        }
      } else {
        const list = chatStorage.getSessionStore();
        setSessionList(list);
      }
    };
    void save();
  };

  const removeSession = (id: string) => {
    let list = chatStorage.removeSession(
      id,
      currentUser && !currentUser.isGuest ? currentUser._id : undefined,
    );
    if (sessionId === id && list.length > 0) {
      onChange(list[0].id);
    }
    setSessionList(list);
  };

  const updateSession = (name: string) => {
    let newSessionList = chatStorage.updateSession(
      sessionId,
      { name },
      currentUser && !currentUser.isGuest ? currentUser._id : undefined,
    );
    setSessionList(newSessionList);
  };

  return (
    <>
      <Modal
        opened={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Deletion"
        centered
      >
        <div className="mb-4">Are you sure you want to delete this session?</div>
        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            style={{ color: 'white', backgroundColor: 'red'}}
            onClick={() => {
              if (pendingDeleteId) {
                removeSession(pendingDeleteId);
              }
              setShowConfirm(false);
              setPendingDeleteId(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <div
          className={clsx(
            {
              "bg-black/10": colorScheme === "dark",
              "bg-gray-100": colorScheme === "light",
            },
            "h-screen",
            "w-64",
            "flex",
            "flex-col",
            "px-2",
            className,
          )}
        >
          <div className="flex justify-center py-2 w-full">
            <ActionIcon onClick={() => createSession()} color="green" size="sm">
              <IconMessagePlus size="1rem" />
            </ActionIcon>
          </div>

          <div
            className={clsx([
              "pb-4",
              "overflow-y-auto",
              "scrollbar-none",
              "flex",
              "flex-col",
              "gap-y-2",
            ])}
          >
            {sessionList.map(({ id, name }) => (
              <div
                key={id}
                className={generateItemClasses(id, sessionId, colorScheme)}
                onClick={() => onChange(id)}
              >
                <EditableText
                  text={name}
                  onSave={(name: string) => updateSession(name)}
                />
                {sessionList.length > 1 && (
                  <IconTrash
                    size=".8rem"
                    color="gray"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setPendingDeleteId(id);
                      setShowConfirm(true);
                    }}
                    className="mx-1 invisible group-hover:visible"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </MediaQuery>

      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Sessions"
          position="left"
          size="xs"
        >
          <div className="flex justify-center py-2 w-full">
            <ActionIcon onClick={() => createSession()} color="green" size="sm">
              <IconMessagePlus size="1rem" />
            </ActionIcon>
          </div>

          <div
            className="pb-4 overflow-y-auto flex flex-col gap-y-2"
          >
            {sessionList.map(({ id, name }) => (
              <div
                key={id}
                className={generateItemClasses(id, sessionId, colorScheme)}
                onClick={() => onChange(id)}
              >
                <EditableText
                  text={name}
                  onSave={(name: string) => updateSession(name)}
                />
                {sessionList.length > 1 && (
                  <IconTrash
                    size=".8rem"
                    color="gray"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setPendingDeleteId(id);
                      setShowConfirm(true);
                    }}
                    className="mx-1"
                  />
                )}
              </div>
            ))}
          </div>
        </Drawer>
      </MediaQuery>

      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Burger
          onClick={() => setDrawerOpen(true)}
          opened = {false}
          style={{
            position: 'relative',
            top: 20,
            left: 5,
            marginRight: '10px',
          }}
        >
          <IconMessagePlus size="1rem" />
        </Burger>
      </MediaQuery>
    </>
  );
};

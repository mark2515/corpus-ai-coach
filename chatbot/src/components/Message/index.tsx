import { useEffect, useState, KeyboardEvent } from "react";
import chatService from "@/utils/chatService";
import { Markdown } from "../Markdown";
import { Voice } from "../Voice";
import {
  ActionIcon,
  Loader,
  Textarea,
  useMantineColorScheme,
  Button,
  Popover,
  Modal,
} from "@mantine/core";
import Link from "next/link";
import * as chatStorage from "@/utils/chatStorage";
import { ThemeSwitch } from "../ThemeSwitch";
import { USERMAP } from "@/utils/constant";
import { AssistantSelect } from "../AssistantSelect";
import {
  IconSend,
  IconSendOff,
  IconEraser,
  IconDotsVertical,
  IconHeadphones,
  IconHeadphonesOff,
} from "@tabler/icons-react";
import { Assistant, MessageList } from "@/types";
import clsx from "clsx";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/store";
import {  saveUser, clearUser } from "@/slices/usersSlice";
import { User, GoogleUser } from "../../types/index";

type Props = {
  sessionId: string;
};

const guestUser: User = {
  name: "Guest",
  picture: "/guest.png",
};

export const Message = ({ sessionId }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [openedModal, setOpenedModal] = useState(false);
  const [message, setMessage] = useState<MessageList>([]);
  const [assistant, setAssistant] = useState<Assistant>();
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [openedLoginPopover, setOpenedLoginPopover] = useState(false);
  const [openedLogoutPopover, setOpenedLogoutPopover] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const [guest, setGuest] = useState<User | null>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const dispatch = useAppDispatch();

  const updateMessage = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };
  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: () => {
      setLoading(false);
    },
  };

  useEffect(() => {
    const storedUser = Cookies.get("googleUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const session = chatStorage.getSession(sessionId);
    setAssistant(session?.assistant);
    const msg = chatStorage.getMessage(sessionId);
    setMessage(msg);
    if (loading) {
      chatService.cancel();
    }
  }, [sessionId, mode]);

  const onAssistantChange = (assistant: Assistant) => {
    setAssistant(assistant);
    chatStorage.updateSession(sessionId, {
      assistant: assistant.id,
    });
  };

  const onClear = () => {
    updateMessage([]);
  };

  const onKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      onSubmit();
    }
  };

  const setSuggestion = (suggestion: string) => {
    if (suggestion === "") return;
    const len = message.length;
    const lastMessage = len ? message[len - 1] : null;
    let newList: MessageList = [];
    if (lastMessage?.role === "assistant") {
      newList = [
        ...message.slice(0, len - 1),
        {
          ...lastMessage,
          content: suggestion,
        },
      ];
    } else {
      newList = [
        ...message,
        {
          role: "assistant",
          content: suggestion,
        },
      ];
    }
    setMessages(newList);
  };

  const setMessages = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  const onSubmit = () => {
    if (loading) {
      return chatService.cancel();
    }
    if (!prompt.trim()) return;
    let list: MessageList = [
      ...message,
      {
        role: "user",
        content: prompt,
      },
    ];
    setMessages(list);
    setLoading(true);
    chatService.getStream({
      prompt,
      options: assistant,
      history: list.slice(-assistant?.max_log!),
    });
    setPrompt("");
  };

  const onLogout = () => {
    Cookies.remove("googleUser");
    setUser(null);
    setGuest(null);
    setOpenedLogoutPopover(false);
    dispatch(clearUser());
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div
        className={clsx([
          "flex",
          "justify-between",
          "items-center",
          "p-4",
          "shadow-sm",
          "h-[6rem]",
        ])}
      >
        <Modal
          opened={openedModal}
          onClose={() => setOpenedModal(false)}
          title="Sign In"
          centered
        >
          <p>Choose a method to continue.</p>
          <GoogleLogin 
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);

                axios.post("http://localhost:5000/api/users/google-login", {
                  name: decoded.name,
                  email: decoded.email,
                  picture: decoded.picture,
                }).then((response) => {
                  const userData = response.data;
                  dispatch(saveUser({ _id: userData._id, name: userData.name, email: userData.email, picture: userData.picture }));
                  Cookies.set("googleUser", JSON.stringify(userData), { expires: 7 });
                  setUser(userData);
                  setOpenedModal(false);
                  console.log("User saved");
                }).catch((err) => {
                  console.error("Failed to save user", err);
                });
              }
            }}
            onError={() => console.log("Login Failed")} 
            auto_select={true}
          />
        </Modal>
        <Popover width={100} position="bottom" withArrow shadow="sm">
          <Link href="/test" passHref legacyBehavior>
            <Button
              size="xs"
              variant="light"
              color="blue"
              className="ml-4"
              style={{ height: "2rem" }}
            >
              Go to /test
            </Button>
          </Link>
          <Popover.Target>
            <Button
              size="sm"
              variant="subtle"
              className="px-1"
              rightIcon={<IconDotsVertical size="1rem"></IconDotsVertical>}
            >
              AI Chatbots
            </Button>
          </Popover.Target>
          <Popover.Dropdown className="p-3 min-w-[200px]">
            <Link href="/chatbots" className="no-underline text-green-600">
              Chatbot Management
            </Link>
          </Popover.Dropdown>
        </Popover>
        <div className="flex items-center mr-auto">
          <ActionIcon
            size="sm"
            onClick={() => setMode(mode === "text" ? "voice" : "text")}
          >
            {mode === "text" ? (
              <IconHeadphones color="green" size="1rem"></IconHeadphones>
            ) : (
              <IconHeadphonesOff color="gray" size="1rem"></IconHeadphonesOff>
            )}
          </ActionIcon>
          <AssistantSelect
            value={assistant?.id!}
            onChange={onAssistantChange}
          ></AssistantSelect>
          <ThemeSwitch></ThemeSwitch>
        </div>
        {user || guest ? (
          <Popover
            opened={openedLogoutPopover}
            onClose={() => setOpenedLogoutPopover(false)}
            position="bottom-end"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <img
                src={(user || guest)?.picture}
                alt={(user || guest)?.name}
                className="w-8 h-8 rounded-full border cursor-pointer"
                title={(user || guest)?.name}
                onClick={() => setOpenedLogoutPopover((v) => !v)}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <div className="flex flex-col items-start">
                <div className="mb-2 text-sm text-gray-700">{(user || guest)?.name}</div>
                <Button
                  size="xs"
                  variant="outline"
                  color="red"
                  onClick={onLogout}
                  fullWidth
                >
                  Log out
                </Button>
              </div>
            </Popover.Dropdown>
          </Popover>
        ) : (
          <>
            <div className="hidden md:flex gap-2 items-center">
              <Button
                  size="sm"
                  variant="subtle"
                  className="px-1"
                  onClick={() => setGuest(guestUser)}
              >
                Guest Login
              </Button>
              <Button variant="filled" style={{ color: 'white', backgroundColor: 'teal' }} onClick={() => setOpenedModal(true)}>
                Sign In With Google
              </Button>
            </div>
            <div className="flex md:hidden items-center">
              <Popover 
                opened={openedLoginPopover}
                onClose={() => setOpenedLoginPopover(false)}
                position="bottom-end" 
                withArrow 
                shadow="md"
              >
                <Popover.Target>
                  <ActionIcon variant="subtle" onClick={() => setOpenedLoginPopover((v) => !v)}>
                    <IconDotsVertical />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Button
                    fullWidth
                    variant="subtle"
                    className="mb-2"
                    onClick={() => {
                      setGuest(guestUser)
                      setOpenedLoginPopover(false)
                    }}
                  >
                    Guest Login
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outline"
                    onClick={() => {
                      setOpenedModal(true) 
                      setOpenedLoginPopover(false)
                    }}
                  >
                    Sign In With Google
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </div>
          </>)}
          </div>
      {mode === "text" ? (
        <>
          <div
            className={clsx([
              "flex-col",
              "h-[calc(100vh-10rem)]",
              "w-full",
              "overflow-y-auto",
              "rounded-sm",
              "px-8",
            ])}
          >
            {message.map((item, idx) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={`${item.role}-${idx}`}
                  className={clsx(
                    {
                      flex: item.role === "user",
                      "flex-col": item.role === "user",
                      "items-end": item.role === "user",
                    },
                    "mt-4",
                  )}
                >
                  <div>
                    {USERMAP[item.role]}
                    {!isUser && idx === message.length - 1 && loading && (
                      <Loader size="sm" variant="dots" className="ml-2" />
                    )}
                  </div>
                  <div
                    className={clsx(
                      {
                        "bg-gray-100": colorScheme === "light",
                        "bg-zinc-700/40": colorScheme === "dark",
                        "whitespace-break-spaces": isUser,
                      },
                      "rounded-md",
                      "shadow-md",
                      "px-4",
                      "py-2",
                      "mt-1",
                      "w-full",
                      "max-w-4xl",
                      "min-h-[3rem]",
                    )}
                  >
                    {isUser ? (
                      <div>{item.content}</div>
                    ) : (
                      <Markdown markdownText={item.content}></Markdown>
                    )}
                  </div>
                </div>
              );
            })}
         </div>
          <div
            className={clsx(
              "flex",
              "items-center",
              "justify-center",
              "self-end",
              "my-4",
              "w-full",
            )}
          >
            <ActionIcon
              className="mr-2"
              disabled={loading}
              onClick={() => onClear()}
            >
              <IconEraser></IconEraser>
            </ActionIcon>
            <Textarea
              placeholder="Talk with the chatbot to improve your English"
              className="w-3/5"
              value={prompt}
              disabled={loading}
              onKeyDown={(evt) => onKeyDown(evt)}
              onChange={(evt) => setPrompt(evt.target.value)}
            ></Textarea>
            <ActionIcon
              color="green"
              className="ml-2"
              onClick={() => onSubmit()}
            >
              {loading ? <IconSendOff /> : <IconSend />}
            </ActionIcon>
          </div>
        </>
      ) : (
        <div className="h-[calc(100vh-6rem)] w-full">
          <Voice sessionId={sessionId} assistant={assistant!}></Voice>
        </div>
      )}
    </div>
  );
};

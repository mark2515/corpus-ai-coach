import { useEffect, useState, useRef, KeyboardEvent } from "react";
import chatService from "@/utils/chatService";
import { Markdown } from "../Markdown";
import {
  ActionIcon,
  Loader,
  Textarea,
  useMantineColorScheme,
  Button,
  Popover,
  Modal,
} from "@mantine/core";
import * as chatStorage from "@/utils/chatStorage";
import assistantStore from "@/utils/assistantStore";
import { ThemeSwitch } from "../ThemeSwitch";
import { USERMAP, MESSAGE_STORE, SESSION_STORE, ASSISTANT_STORE, CURRENT_SESSION_COOKIE } from "@/utils/constant";
import { removeLocal, removeCookie } from "@/utils/storage";
import { AssistantSelect } from "../AssistantSelect";
import {
  IconSend,
  IconSendOff,
  IconEraser,
  IconDotsVertical,
  IconUser,
  IconSettings,
  IconRobot,
  IconNotebook,
  IconLogout,
} from "@tabler/icons-react";
import { Assistant, MessageList } from "@/types";
import clsx from "clsx";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store";
import { saveGuestUser, saveGoogleUser, clearUser, selectCurrentUser } from "@/slices/usersSlice";
import { User } from "../../types/index";
import { API_BASE } from "@/utils/constant";

type Props = {
  sessionId: string;
};

const guestUser: User = {
  _id: "guest-id",
  name: "Guest",
  email: "guest@example.com",
  picture: "/guest.png",
  isGuest: true,
};

export const Message = ({ sessionId }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [openedModal, setOpenedModal] = useState(false);
  const [openedLoginRequiredModal, setOpenedLoginRequiredModal] = useState(false);
  const [message, setMessage] = useState<MessageList>([]);
  const [assistant, setAssistant] = useState<Assistant>();
  const [openedLoginPopover, setOpenedLoginPopover] = useState(false);
  const [openedLogoutPopover, setOpenedLogoutPopover] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const messageRef = useRef<MessageList>([]);
  const dispatch = useAppDispatch();

  const updateMessage = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  chatService.actions = {
    onCompleting: (partial) => {
      setSuggestion(partial);
    },
    onCompleted: async (finalText) => {
      setLoading(false);
      if (!finalText) return;

      const list = [...messageRef.current];
      const last = list[list.length - 1];

      if (last && last.role === "assistant") {
        list[list.length - 1] = { ...last, content: finalText };
      } else {
        list.push({ role: "assistant", content: finalText });
      }

      setMessages(list);
      await saveMessageToDB("assistant", finalText);
    },
  };

  useEffect(() => {
    const init = async () => {
      if (currentUser && !currentUser.isGuest) {
        await assistantStore.syncAssistantsFromServer(currentUser._id);
        const syncedMessages = await chatStorage.syncMessagesFromServer(currentUser._id, sessionId);
        setMessage(syncedMessages);
      } else {
        const msg = chatStorage.getMessage(sessionId);
        setMessage(msg);
      }
      
      const session = chatStorage.getSession(sessionId);
      setAssistant(session?.assistant);
      
      if (loading) {
        chatService.cancel();
      }
    };
    void init();
  }, [sessionId, currentUser]);

  useEffect(() => {
    const storedGuestUser = Cookies.get("guestUser");
    const storedGoogleUser = Cookies.get("googleUser");
    
    if (storedGoogleUser) {
      try {
        const parsedUser = JSON.parse(storedGoogleUser);
        if (parsedUser && parsedUser._id && parsedUser.email) {
          dispatch(saveGoogleUser(parsedUser));
        } else {
          console.error("Invalid Google user data in cookie");
          Cookies.remove("googleUser");
        }
      } catch (error) {
        console.error("Failed to parse Google user cookie:", error);
        Cookies.remove("googleUser");
      }
    } else if (storedGuestUser) {
      try {
        const parsedUser = JSON.parse(storedGuestUser);
        if (parsedUser) {
          dispatch(saveGuestUser(parsedUser));
        }
      } catch (error) {
        console.error("Failed to parse guest user cookie:", error);
        Cookies.remove("guestUser");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onAssistantChange = (assistant: Assistant) => {
    setAssistant(assistant);
    chatStorage.updateSession(
      sessionId, 
      {
        assistant: assistant.id,
      },
      currentUser && !currentUser.isGuest ? currentUser._id : undefined
    );
  };

  const onClear = async () => {
    updateMessage([]);
    
    if (currentUser && !currentUser.isGuest) {
      try {
        const success = await chatStorage.clearMessagesFromServer(sessionId);
        if (success) {
          console.log("Successfully cleared messages from database");
        } else {
          console.error("Failed to clear messages from database");
        }
      } catch (error) {
        console.error("Error clearing messages from database:", error);
      }
    }
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
    messageRef.current = msg;
    chatStorage.updateMessage(sessionId, msg);
  };

  const saveMessageToDB = async (
    role: "user" | "assistant",
    content: string,
  ) => {
    if ( !currentUser || currentUser?.isGuest) return;
    try {
      await axios.post(`${API_BASE}/messages`, {
        user: currentUser?._id,
        session: sessionId,
        role,
        content,
      });
    } catch (err) {
      console.error(`Failed to save ${role} message:`, err);
    }
  };

  const onSubmit = async () => {
    if (loading) {
      return chatService.cancel();
    }
    if (!prompt.trim()) return;
    if (!currentUser) {
      setOpenedLoginRequiredModal(true);
      return;
    }
    let list: MessageList = [
      ...message,
      {
        role: "user",
        content: prompt,
      },
    ];
    setMessages(list);
    await saveMessageToDB("user", prompt);
    
    setLoading(true);
    chatService.getStream({
      prompt,
      options: assistant,
      history: list.slice(-assistant?.max_log!),
    });
    setPrompt("");
  };

  const onLogout = () => {
    dispatch(clearUser());
    Cookies.remove("guestUser");
    Cookies.remove("googleUser");
    removeLocal(MESSAGE_STORE); 
    removeLocal(SESSION_STORE);
    removeLocal(ASSISTANT_STORE);
    removeCookie(CURRENT_SESSION_COOKIE);
    setOpenedLogoutPopover(false);
    window.location.reload();
  };

  const handleGuestLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/users/guest-login`, {
        name: guestUser.name,
        email: guestUser.email,
        picture: guestUser.picture,
      });

      const userData = response.data;
      dispatch(saveGuestUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      }));
      Cookies.set("guestUser", JSON.stringify(userData), { expires: 7 });
      console.log("User saved");
    } catch (err) {
      console.error("Failed to save user", err);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      console.error("No credential received from Google");
      return;
    }

    setGoogleLoginLoading(true);
    
    try {
      const decoded = jwtDecode<User>(credentialResponse.credential);

      const result = await dispatch(saveGoogleUser({
        _id: decoded._id || '',
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      }));

      if (saveGoogleUser.fulfilled.match(result)) {
        const userData = result.payload;
        Cookies.set("googleUser", JSON.stringify(userData), { expires: 7 });
        console.log("User saved successfully");
        setOpenedModal(false);
      } else {
        throw new Error('Failed to save user to server');
      }
      
    } catch (err) {
      console.error("Failed to save user", err);
      const isError = (error: unknown): error is Error => {
        return error instanceof Error;
      };
      
      if (isError(err)) {
        if (err.message === 'Request timeout') {
          console.error("Login request timed out. Please try again.");
        } else {
          console.error("Login failed. Please try again.");
        }
      } else {
        console.error("An unknown error occurred during login.");
      }
    } finally {
      setGoogleLoginLoading(false);
    }
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
          opened={openedLoginRequiredModal}
          onClose={() => setOpenedLoginRequiredModal(false)}
          title={<strong>Login Required</strong>}
          centered
        >
          <p>You must be logged in to send a message. Please choose a login option below:</p>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                handleGuestLogin();
                setOpenedLoginRequiredModal(false);
              }}
            >
              Continue as Guest
            </Button>
            <Button
              variant="filled" style={{ color: 'white', backgroundColor: 'teal' }} 
              onClick={() => {
                setOpenedLoginRequiredModal(false);
                setOpenedModal(true);
              }}
            >
              Sign in with Google
            </Button>
          </div>
        </Modal>

         <Modal
          opened={openedModal}
          onClose={() => setOpenedModal(false)}
          title="Sign In"
          centered
          closeOnClickOutside={!googleLoginLoading}
          closeOnEscape={!googleLoginLoading}
        >
          <p>Choose a method to continue.</p>
          {googleLoginLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size="md" />
              <span className="ml-2">Signing in with Google...</span>
            </div>
          ) : (
            <GoogleLogin 
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google Login Failed");
                setOpenedModal(false);
              }}
              auto_select={true}
            />
          )}
        </Modal>
        
        <div className="flex items-center mr-auto">
          <AssistantSelect
            value={assistant?.id!}
            onChange={onAssistantChange}
          ></AssistantSelect>
          <ThemeSwitch></ThemeSwitch>
        </div>
        
        {isClient && (Cookies.get("googleUser") || Cookies.get("guestUser")) ? (
          <Popover
            opened={openedLogoutPopover}
            onClose={() => setOpenedLogoutPopover(false)}
            position="bottom-end"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <img
                src={
                  Cookies.get("googleUser") 
                    ? JSON.parse(Cookies.get("googleUser") || '{}')?.picture 
                    : JSON.parse(Cookies.get("guestUser") || '{}')?.picture
                }
                alt={
                  Cookies.get("googleUser") 
                    ? JSON.parse(Cookies.get("googleUser") || '{}')?.name 
                    : JSON.parse(Cookies.get("guestUser") || '{}')?.name
                }
                className="w-8 h-8 rounded-full border cursor-pointer"
                title={JSON.parse(Cookies.get("googleUser") || '{}')?.name}
                onClick={() => setOpenedLogoutPopover((v) => !v)}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <div className="flex flex-col items-start min-w-[180px]">
                <div className="mb-3 pb-2 border-b border-gray-200 w-full">
                  <div className={`text-sm font-medium ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {
                      Cookies.get("googleUser") 
                        ? JSON.parse(Cookies.get("googleUser") || '{}')?.name 
                        : JSON.parse(Cookies.get("guestUser") || '{}')?.name
                    }
                  </div>
                  <div className="text-xs text-gray-500">{JSON.parse(Cookies.get("googleUser") || '{}')?.email}</div>
                </div>
                
                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  leftIcon={<IconUser size="0.9rem" />}
                  onClick={() => {/* Handle profile */}}
                  fullWidth
                  className={`justify-start mb-1 pl-2 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                  styles={{
                    inner: { justifyContent: 'flex-start' },
                    leftIcon: { marginRight: '12px' }
                  }}
                >
                  Account
                </Button>
                                
                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  leftIcon={<IconRobot size="0.9rem" />}
                  onClick={() => window.location.href = '/chatbots'}
                  fullWidth
                  className={`justify-start mb-1 pl-2 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                  styles={{
                    inner: { justifyContent: 'flex-start' },
                    leftIcon: { marginRight: '12px' }
                  }}
                >
                  My Chatbots
                </Button>
                
                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  leftIcon={<IconNotebook size="0.9rem" />}
                  onClick={() => {/* Handle chat history */}}
                  fullWidth
                  className={`justify-start mb-1 pl-2 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                  styles={{
                    inner: { justifyContent: 'flex-start' },
                    leftIcon: { marginRight: '12px' }
                  }}
                >
                  My WordList
                </Button>

                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  leftIcon={<IconSettings size="0.9rem" />}
                  onClick={() => {/* Handle settings */}}
                  fullWidth
                  className={`justify-start mb-1 pl-2 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                  styles={{
                    inner: { justifyContent: 'flex-start' },
                    leftIcon: { marginRight: '12px' }
                  }}
                >
                  Settings
                </Button>
                
                <div className="w-full border-t border-gray-200 mt-2 pt-2">
                  <Button
                    size="xs"
                    variant="outline"
                    color="red"
                    leftIcon={<IconLogout size="0.9rem" />}
                    onClick={onLogout}
                    fullWidth
                    className="justify-start pl-2"
                    styles={{
                      inner: { justifyContent: 'flex-start' },
                      leftIcon: { marginRight: '12px' }
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </Popover.Dropdown>
          </Popover>
        ) : isClient ? (
          <>
            <div className="hidden md:flex gap-2 items-center">
              <Button
                  size="sm"
                  variant="subtle"
                  className="px-1"
                  onClick={handleGuestLogin}
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
                    onClick={async () => {
                      await handleGuestLogin();
                      setOpenedLoginPopover(false);
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
          </>
        ) : null}
      </div>
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

    </div>
  );
};

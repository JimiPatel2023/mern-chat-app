import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const chatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [userChatsLoading, setUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(false);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState(null);

  console.log(baseUrl);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    user?._id && socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });
    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some(
        (id) => id === res?.senderId
      );
      if (isChatOpen === true) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else if (isChatOpen === false) {
        setNotifications((prev) => [res, ...prev]);
      }
    });
    return () => {
      return () => {
        socket.off("getMessage");
        socket.off("getNotification");
      };
    };
  }, [socket]);

  useEffect(() => {
    const getMessages = async () => {
      setMessagesLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setMessages(false);
      if (response.error) {
        console.log("error:", response.message);
        return setMessagesError(response.message);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("error:", response.message);
      }
      const filteredChats = response.users.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u?._id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat?.members[0] === u._id || chat?.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats([...filteredChats]);
      setAllUsers(response.users);
    };
    getUsers();
  }, [user?._id, userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response.message);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage.trim().length) {
        return console.log("Please enter the message");
      }
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setSendTextMessageError(response.message);
      }
      setNewMessage(response);
      setMessages((prev) => {
        return [...prev, response];
      });
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log("error:", response.message);
    }
    setUserChats((prev) => {
      return [...prev, response];
    });
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications?.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      const desiredChat = userChats?.find((chat) => {
        const chatMembers = [user?._id, n?.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers?.includes(member);
        });
        return isDesiredChat;
      });
      const mNotifications = notifications?.map((el) => {
        if (n?.senderId === el.senderId) {
          return {
            ...n,
            isRead: true,
          };
        }
        return { ...el };
      });
      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <chatContext.Provider
      value={{
        userChats,
        userChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        messagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

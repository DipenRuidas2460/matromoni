import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

function ChatProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const host = `http://localhost:3010`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios
        .get(`${host}/customer/getUserById`, config)
        .then(({ data }) => {
          if (data.status === "success") {
            setUser(data.data);
          }
        })
        .catch((err) => {
          toast({
            title: err.message,
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

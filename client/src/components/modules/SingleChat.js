import React, { useCallback, useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../chatLogic/chatLogics";
import ProfileMenu from "../miscellaneous/ProfileMenu";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie-player";
import animationData from "../../animation/typing.json";
import { useRef } from "react";
import { FaVideo } from "react-icons/fa";
import { useSocket } from "../../context/SocketProvider";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";

function SingleChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showVideoCallNotification, setShowVideoCallNotification] =
    useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const host = config.BCKHOST;
  const socket = useRef(null);
  const toast = useToast();
  const videoSocket = useSocket();
  const navigate = useNavigate();

  const handleJoinVideoCall = useCallback(() => {
    videoSocket.emit("room:join", {
      email: selectedChat.chatsender.email,
      room: selectedChat.id,
    });
    videoSocket.emit("join-video-call", {
      room: selectedChat?.id,
      sender: selectedChat?.chatsender.id,
      receiver: selectedChat?.receive.id,
    });
    setShowVideoCallNotification(false);
    navigate("/video-call");
  }, [videoSocket, selectedChat, navigate]);

  const handleCancelVideoCall = useCallback(() => {
    videoSocket.emit("cancel-video-call", {
      room: selectedChat?.id,
      sender: selectedChat?.chatsender.id,
      receiver: selectedChat?.receive.id,
    });
    setShowVideoCallNotification(false);
  }, [videoSocket, selectedChat]);

  const handleVideoCall = useCallback(() => {
    videoSocket.emit("room:join", {
      email: selectedChat.chatsender.email,
      room: selectedChat.id,
    });

    videoSocket.emit("video-request", {
      room: selectedChat.id,
      receiver: selectedChat.receive.id,
    });
    // setShowVideoCallNotification(true);
    navigate("/video-call");
  }, [videoSocket, selectedChat, navigate]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedChat) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setloading(true);

      const { data } = await axios.get(
        `${host}/message/${selectedChat.id}`,
        config
      );

      setMessages(data);
      setloading(false);
      socket.current.emit("join chat", {
        sender: selectedChat?.chatsender.id,
        receiver: selectedChat?.receive.id,
        room: selectedChat?.id,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const sendMessages = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (newMessage) {
        socket.current.emit("stop typing", {
          room: selectedChat.id,
          receiver: selectedChat.receive.id,
        });
        try {
          const token = localStorage.getItem("token");
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

          setNewMessage("");

          const { data } = await axios.post(
            `${host}/message`,
            {
              content: newMessage,
              chatId: selectedChat.id,
            },
            config
          );

          socket.current.emit("new message", data);
          setMessages([...messages, data]);
        } catch (err) {
          console.log(err);
          toast({
            title: "Error Occured!",
            description: err.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", {
        room: selectedChat.id,
        receiver: selectedChat.receive.id,
      });
    }

    // Debouncing:--

    const lastTypingTime = new Date().getTime();
    const timerLength = 2500;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", {
          room: selectedChat.id,
          receiver: selectedChat.receive.id,
        });
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket.current = io(host);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));
    socket.current.on("typing", ({ room, receiver }) => {
      if (
        selectedChat !== undefined &&
        room === selectedChat.id &&
        receiver === selectedChat.chatsender.id
      ) {
        setIsTyping(true);
      }
    });
    socket.current.on("stop typing", ({ room, receiver }) => {
      if (
        selectedChat !== undefined &&
        room === selectedChat.id &&
        receiver === selectedChat.chatsender.id
      ) {
        setIsTyping(false);
      }
    });

    socket.current.on("video-call-request", ({ room, receiver }) => {
      if (
        selectedChat !== undefined &&
        room === selectedChat.id &&
        receiver === selectedChat.chatsender.id
      ) {
        setShowVideoCallNotification(true);
      }
    });

    socket.current.on("cancel-video-call", ({ room, sender, receiver }) => {
      if (
        selectedChat !== undefined &&
        room === selectedChat.id &&
        receiver === selectedChat.chatsender.id
      ) {
        setShowVideoCallNotification(true);
        navigate("/new-chats");
        window.location.reload();
      }
    });

    return () => {
      socket.current.off("setup", user);
      socket.current.off("cancel-video-call", ({ room, sender, receiver }) => {
        if (
          selectedChat !== undefined &&
          room === selectedChat.id &&
          receiver === selectedChat.chatsender.id
        ) {
          setShowVideoCallNotification(true);
          navigate("/new-chats");
          window.location.reload();
        }
      });
    };
  }, [socket, selectedChat, host, user, navigate]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.current.on("message recieved", (data) => {
      if (selectedChat !== undefined && data.chatId === selectedChat.id) {
        setMessages([...messages, data]);
      }
    });
  }, [messages, selectedChat, socket]);

  return (
    <>
      {selectedChat !== undefined && Object.keys(selectedChat).length > 0 ? (
        <>
          <Box
            fontSize={{ base: "23px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            <>
              {getSender(user, [
                selectedChat?.chatsender,
                selectedChat?.receive,
              ])}

              <Box
                width="34%"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
              >
                <Button
                  color="#19B300"
                  cursor="pointer"
                  marginRight="5px"
                  isDisabled={showVideoCallNotification ? true : false}
                  onClick={() => handleVideoCall()}
                >
                  <FaVideo />
                </Button>

                <ProfileMenu
                  user={getSenderFull(user, [
                    selectedChat.chatsender,
                    selectedChat.receive,
                  ])}
                />
              </Box>
            </>
          </Box>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {showVideoCallNotification ? (
              <div className="notification">
                <p
                  style={{ marginBottom: "10px", marginTop: "10px" }}
                >{`Video Call Coming...!`}</p>
                <div className="notification-button">
                  <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={handleJoinVideoCall}
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mb-3"
                    onClick={handleCancelVideoCall}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}

            <FormControl onKeyDown={sendMessages} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    play
                    loop
                    animationData={animationData}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                      height: 100,
                      width: 100,
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button
                  size="sm"
                  borderRadius="50%"
                  backgroundColor="#333"
                  color="#fff"
                  _hover={{ backgroundColor: "#000" }}
                  onClick={sendMessages}
                >
                  <IoSend />
                </Button>
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a partner to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;

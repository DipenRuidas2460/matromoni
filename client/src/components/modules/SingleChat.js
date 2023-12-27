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
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import peer from "../../service/peer";

function SingleChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setloading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [senderName, setSenderName] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const host = `http://localhost:3010`;
  const socket = useRef(null);
  const toast = useToast();
  const videoSocket = useSocket();
  const navigate = useNavigate();

  const handleUserjoined = useCallback(
    ({ email, receiverFullName, senderFullName, id }) => {
      console.log(
        `Email ${email} joined room receiver:-${receiverFullName} sender:- ${senderFullName}`
      );
      setRemoteSocketId(id);
      setReceiverName(receiverFullName);
      setSenderName(senderFullName);
    },
    []
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      const isTrackAlreadyAdded = peer.peer
        .getSenders()
        .some((sender) => sender.track === track);
      if (!isTrackAlreadyAdded) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      videoSocket.emit("call:accepted", { to: from, ans });
    },
    [videoSocket]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    videoSocket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, videoSocket]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    videoSocket.emit("peer:nego:needed", { to: remoteSocketId, offer });
  }, [remoteSocketId, videoSocket]);

  const handleNegoNeededIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      videoSocket.emit("peer:nego:done", { to: from, ans });
    },
    [videoSocket]
  );

  const handleNegoNeededFinal = useCallback(async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleVideoCall = useCallback(
    () => {
      videoSocket.emit("room:join", {
        email: selectedChat.chatsender.email,
        receiverFullName: `${selectedChat.chatsender.firstName} ${selectedChat.chatsender.lastName}`,
        senderFullName: `${selectedChat.receive.firstName} ${selectedChat.receive.lastName}`,
        room: selectedChat.id,
      });
    },
    // eslint-disable-next-line
    [videoSocket, selectedChat]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      navigate(`/room/${data.room}`);
    },
    [navigate]
  );

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
      socket.current.emit("join chat", selectedChat.id);
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
        socket.current.emit("stop typing", selectedChat.id);
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
      socket.current.emit("typing", selectedChat.id);
    }

    // Debouncing:--

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChat.id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStm = ev.streams;
      setRemoteStream(remoteStm[0]);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    videoSocket.on("user:joined", handleUserjoined);
    videoSocket.on("incoming:call", handleIncomingCall);
    videoSocket.on("call:accepted", handleCallAccepted);
    videoSocket.on("peer:nego:needed", handleNegoNeededIncoming);
    videoSocket.on("peer:nego:final", handleNegoNeededFinal);

    return () => {
      videoSocket.off("user:joined", handleUserjoined);
      videoSocket.off("incoming:call", handleIncomingCall);
      videoSocket.off("call:accepted", handleCallAccepted);
      videoSocket.off("peer:nego:needed", handleNegoNeededIncoming);
      videoSocket.off("peer:nego:final", handleNegoNeededFinal);
    };
  }, [
    videoSocket,
    handleUserjoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeededIncoming,
    handleNegoNeededFinal,
  ]);

  useEffect(() => {
    socket.current = io(host);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));
    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.current.off("setup", user);
    };
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.current.on("message recieved", (newMessageReceived) => {
      setMessages([...messages, newMessageReceived]);
    });
  });

  useEffect(() => {
    videoSocket.on("room:join", handleJoinRoom);
    return () => {
      videoSocket.off("room:join", handleJoinRoom);
    };
  }, [videoSocket, handleJoinRoom]);

  return (
    <>
      {selectedChat ? (
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
                <FaVideo
                  color="#19B300"
                  cursor="pointer"
                  onClick={() => handleVideoCall()}
                />
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

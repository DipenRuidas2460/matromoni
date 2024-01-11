import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../../service/peer";
import HeadingDashboard from "../dashboard/HeadingDashboard";
import CountryAndPrivacy from "../miscellaneous/CountryAndPrivacy";
import Footer from "../miscellaneous/Footer";
import { useNavigate } from "react-router-dom";
import { IoCall } from "react-icons/io5";
import {
  FaVideo,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
} from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../chatLogic/chatLogics";

function RoomPage({ token }) {
  const navigate = useNavigate();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { user, selectedChat } = ChatState();

  const handleUserjoined = useCallback(({ email, id, room }) => {
    setRemoteSocketId(id);
  }, []);

  const sendStreams = useCallback(() => {
    if (myStream) {
      myStream.stream.getTracks().forEach((track) => {
        if (track) {
          const isTrackAlreadyAdded = peer.peer
            .getSenders()
            .some((sender) => sender.track === track);

          if (!isTrackAlreadyAdded) {
            const trackWithMetadata = {
              track: track,
              metadata: {
                name: myStream.name,
              },
            };
            peer.peer.addTrack(trackWithMetadata.track, myStream.stream);
          }
        }
      });
    }
  }, [myStream]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream({ stream, name: `${user.firstName} ${user.lastName}` });
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket, user]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleCallUser = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream({ stream, name: `${user.firstName} ${user.lastName}` });
      }
    } catch (err) {
      console.log("err:-", err);
    }
  }, [remoteSocketId, socket, user]);

  const handleEndCall = useCallback(() => {
    myStream?.stream.getTracks().forEach((track) => track.stop());
    for (const sender of peer.peer.getSenders()) {
      peer.peer.removeTrack(sender);
    }
    socket.emit("call:end", { to: remoteSocketId });
    setRemoteSocketId(null);
    setMyStream(null);
    setRemoteStream(null);
    navigate("/new-chats");
    window.location.reload();
  }, [myStream, remoteSocketId, socket, navigate]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleNegoNeededIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeededFinal = useCallback(async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleToggleAudio = useCallback(() => {
    setIsAudioMuted((prevIsAudioMuted) => {
      myStream?.stream.getAudioTracks().forEach((track) => {
        track.enabled = prevIsAudioMuted;
      });
      return !prevIsAudioMuted;
    });
  }, [myStream]);

  const handleToggleVideo = useCallback(() => {
    setIsVideoMuted((prevIsVideoMuted) => {
      myStream?.stream.getVideoTracks().forEach((track) => {
        track.enabled = prevIsVideoMuted;
      });
      return !prevIsVideoMuted;
    });
  }, [myStream]);

  const handleBackArrowEndCall = useCallback(() => {
    myStream?.stream.getTracks().forEach((track) => track.stop());
    for (const sender of peer.peer.getSenders()) {
      peer.peer.removeTrack(sender);
    }
    socket.emit("disconnect-video", {
      room: selectedChat?.id,
      sender: selectedChat?.chatsender.id,
      receiver: selectedChat?.receive.id,
    });
    setRemoteSocketId(null);
    setMyStream(null);
    setRemoteStream(null);
    navigate("/new-chats");
    window.location.reload();
  }, [socket, myStream, selectedChat, navigate]);

  useEffect(() => {
    window.addEventListener("popstate", handleBackArrowEndCall);
  }, [handleBackArrowEndCall]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStm = ev.streams;
      setRemoteStream({
        stream: remoteStm[0],
        name: getSender(user, [
          selectedChat?.chatsender,
          selectedChat?.receive,
        ]),
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserjoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeededIncoming);
    socket.on("peer:nego:final", handleNegoNeededFinal);
    socket.on("call:end", handleEndCall);
    socket.on("user-disconnected-video", handleBackArrowEndCall)

    return () => {
      socket.off("user:joined", handleUserjoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeededIncoming);
      socket.off("peer:nego:final", handleNegoNeededFinal);
      socket.off("call:end", handleEndCall);
      socket.off("user-disconnected-video", handleBackArrowEndCall)
    };
  }, [
    socket,
    handleUserjoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeededIncoming,
    handleNegoNeededFinal,
    handleEndCall,
    handleBackArrowEndCall
  ]);

  return (
    <>
      {token ? (
        <div>
          <HeadingDashboard token={token} />
          <div className="black-space-div-chat"></div>
          <div className="white-space-div-video">
            <div
              style={{
                height: "95vh",
                width: "70%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                position: "absolute",
                borderRadius: "10px",
                bottom: "18%",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  zIndex: 1,
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {remoteSocketId ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h4>Connected</h4>
                  </div>
                ) : (
                  <div>
                    <h4>Calling</h4>
                    <Button
                      position="absolute"
                      bottom="10%"
                      onClick={() => handleEndCall()}
                    >
                      <MdCallEnd fontSize="1.5em" color="red" />
                    </Button>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 1,
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  {myStream?.stream && (
                    <Button marginRight="10px" onClick={() => sendStreams()}>
                      <IoCall fontSize="1.5em" color="#19B300" />
                    </Button>
                  )}

                  {remoteSocketId && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "83%",
                      }}
                    >
                      <Button
                        marginRight="5px"
                        isDisabled={myStream?.stream ? true : false}
                        onClick={() => handleCallUser()}
                      >
                        <FaVideo fontSize="1.5em" color="#19B300" />
                      </Button>
                      <Button onClick={() => handleEndCall()}>
                        <MdCallEnd fontSize="1.5em" color="red" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {myStream?.stream && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "absolute",
                    zIndex: 1,
                    bottom: "20%",
                    transform: "translate(-17%, 50%)",
                  }}
                >
                  <ReactPlayer
                    playing
                    height="20vh"
                    width="40%"
                    muted
                    url={myStream?.stream}
                  />
                </div>
              )}

              {remoteStream?.stream && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "1%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5
                    style={{
                      color: "green",
                      position: "absolute",
                      zIndex: 1,
                      bottom: "15%",
                      transform: "translate(70%, 0%)",
                    }}
                  >
                    {remoteStream?.name}
                  </h5>

                  <ReactPlayer
                    playing
                    muted
                    height="70vh"
                    width="100%"
                    url={remoteStream?.stream}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      zIndex: 1,
                      width: "30%",
                      position: "absolute",
                      bottom: "1%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginRight: "10px",
                      }}
                    >
                      {isAudioMuted ? (
                        <Button onClick={handleToggleAudio}>
                          <FaMicrophoneSlash fontSize="1em" color="#FF0000" />
                        </Button>
                      ) : (
                        <Button onClick={handleToggleAudio}>
                          <FaMicrophone fontSize="1em" color="blue" />
                        </Button>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {isVideoMuted ? (
                        <Button onClick={handleToggleVideo}>
                          <FaVideoSlash fontSize="1em" color="#FF0000" />
                        </Button>
                      ) : (
                        <Button onClick={handleToggleVideo}>
                          <FaVideo fontSize="1em" color="blue" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <CountryAndPrivacy />
          <Footer />
        </div>
      ) : (
        navigate("/404")
      )}
    </>
  );
}

export default RoomPage;

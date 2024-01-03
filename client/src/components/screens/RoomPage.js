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

function RoomPage({ token }) {
  const navigate = useNavigate();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const handleUserjoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
  }, []);

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
      const stream = await navigator?.mediaDevices?.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleCallUser = useCallback(async () => {
    const stream = await navigator?.mediaDevices?.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleEndCall = useCallback(() => {
    myStream?.getTracks().forEach((track) => track.stop());
    for (const sender of peer.peer.getSenders()) {
      peer.peer.removeTrack(sender);
    }
    socket.emit("call:end", { to: remoteSocketId });
    setRemoteSocketId(null);
    setMyStream(null);
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

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleToggleAudio = useCallback(() => {
    setIsAudioMuted((prevIsAudioMuted) => {
      myStream?.getAudioTracks().forEach((track) => {
        track.enabled = prevIsAudioMuted;
      });
      return !prevIsAudioMuted;
    });
  }, [myStream]);

  const handleToggleVideo = useCallback(() => {
    setIsVideoMuted((prevIsVideoMuted) => {
      myStream?.getVideoTracks().forEach((track) => {
        track.enabled = prevIsVideoMuted;
      });
      return !prevIsVideoMuted;
    });
  }, [myStream]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStm = ev.streams;
      setRemoteStream(remoteStm[0]);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserjoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeededIncoming);
    socket.on("peer:nego:final", handleNegoNeededFinal);

    return () => {
      socket.off("user:joined", handleUserjoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeededIncoming);
      socket.off("peer:nego:final", handleNegoNeededFinal);
    };
  }, [
    socket,
    handleUserjoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeededIncoming,
    handleNegoNeededFinal,
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
                    <MdCallEnd
                      fontSize="1.8em"
                      color="red"
                      cursor="pointer"
                      style={{ position: "absolute", bottom: "10%" }}
                      onClick={() => handleEndCall()}
                    />
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
                  {myStream && (
                    <IoCall
                      fontSize="1.8em"
                      color="#19B300"
                      cursor="pointer"
                      onClick={() => sendStreams()}
                    />
                  )}

                  {remoteSocketId && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "63%",
                      }}
                    >
                      <FaVideo
                        fontSize="1.8em"
                        color="#19B300"
                        cursor="pointer"
                        onClick={() => handleCallUser()}
                      />
                      <MdCallEnd
                        fontSize="1.8em"
                        color="red"
                        cursor="pointer"
                        onClick={() => handleEndCall()}
                      />
                    </div>
                  )}
                </div>
              </div>

              {myStream && (
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
                    url={myStream}
                  />
                </div>
              )}

              {remoteStream && (
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
                  <ReactPlayer
                    playing
                    muted
                    height="70vh"
                    width="100%"
                    url={remoteStream}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      zIndex: 1,
                      width: "15%",
                      position: "absolute",
                      bottom: "1%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {isAudioMuted ? (
                        <FaMicrophoneSlash
                          fontSize="1.5em"
                          color="#FF0000"
                          cursor="pointer"
                          onClick={handleToggleAudio}
                        />
                      ) : (
                        <FaMicrophone
                          fontSize="1.5em"
                          color="blue"
                          cursor="pointer"
                          onClick={handleToggleAudio}
                        />
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
                        <FaVideoSlash
                          fontSize="1.5em"
                          color="#FF0000"
                          cursor="pointer"
                          onClick={handleToggleVideo}
                        />
                      ) : (
                        <FaVideo
                          fontSize="1.5em"
                          color="blue"
                          cursor="pointer"
                          onClick={handleToggleVideo}
                        />
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

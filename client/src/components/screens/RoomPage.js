import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../../service/peer";
import HeadingDashboard from "../dashboard/HeadingDashboard";
import CountryAndPrivacy from "../miscellaneous/CountryAndPrivacy";
import Footer from "../miscellaneous/Footer";

function RoomPage({ token }) {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [senderName, setSenderName] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

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
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

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
    <div>
      <HeadingDashboard token={token} />
      <div className="black-space-div-chat"></div>
      <div className="white-space-div-video">
        <div
          style={{
            height:"85vh",
            width:"70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            position:"absolute",
            borderRadius:"10px",
            bottom:"28%",
            boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.25)",
            backgroundColor:"#fff",
          }}
        >
          <h4 className="mt-3 mb-3">
            {remoteSocketId
              ? "Connected"
              : "No one is Connected on Video Call!"}
          </h4>
          {myStream && (
            <button
              type="submit"
              className="btn btn-primary mr-3"
              onClick={sendStreams}
            >
              Accept
            </button>
          )}
          {remoteSocketId && (
            <button
              type="submit"
              className="btn btn-primary m-3"
              onClick={handleCallUser}
            >
              Call
            </button>
          )}
          {myStream && (
            <div
              style={{
                width:"100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                position:"relative",
                bottom:"3%"
              }}
            >
              <ReactPlayer
                playing
                height="50vh"
                width="100%"
                muted
                url={myStream}
              />
              <h6
                style={{
                  position: "absolute",
                  bottom: "6%",
                  display: "flex",
                  flexDirection: "column",
                  color: "green",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                {senderName}
              </h6>
            </div>
          )}

          {remoteStream && (
            <div
              style={{
                position: "absolute",
                bottom: "15%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ReactPlayer
                playing
                muted
                height="90px"
                width="150px"
                url={remoteStream}
              />
              <h6
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  color: "blue",
                  justifyContent: "flex-start",
                  bottom:"5%"
                }}
              >
                {receiverName}
              </h6>
            </div>
          )}
        </div>
      </div>
      <CountryAndPrivacy />
      <Footer />
    </div>
  );
}

export default RoomPage;

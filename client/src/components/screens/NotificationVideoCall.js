import React, { useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useSocket } from "../../context/SocketProvider";

function NotificationVideoCall() {
  const { user, selectedChat } = ChatState();
  const videoSocket = useSocket();

  useEffect(() => {
    videoSocket.on("video-call-receive")
    return () => {
     videoSocket.off("video-call-receive") 
    }
  }, [videoSocket])
  
  return (
    <>
      <p>
        Video Call Coming From {user.firstName} {user.lastName}!
      </p>
      <div className="notification-button">
        <button type="button" className="btn btn-primary">Join</button>
        <button type="button" className="btn btn-danger">Cancel</button>
      </div>
    </>
  );
}

export default NotificationVideoCall;

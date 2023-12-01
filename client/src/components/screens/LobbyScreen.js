import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";

function LobbyScreen() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate()

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    // eslint-disable-next-line
    [email, room, socket]
  );

  const handleJoinRoom = useCallback((data) => {
    navigate(`/room/${data.room}`)
  }, [navigate]);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="lobby-container">
      <h1 className="mb-3 mt-2">Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <div className="mb-3 mt-2">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email Id
          </label>
          <input
            type="email"
            className="form-control-lobby"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="room" className="form-label">
            Room Number
          </label>
          <input
            type="text"
            className="form-control-lobby"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Join
        </button>
      </form>
    </div>
  );
}

export default LobbyScreen;

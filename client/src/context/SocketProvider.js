import config from "../config/config";

const { createContext, useMemo, useContext } = require("react");
const { io } = require("socket.io-client");

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(config.BCKHOST), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const { createContext, useMemo, useContext } = require("react");
const { io } = require("socket.io-client");

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(`http://192.168.1.19:3010`), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

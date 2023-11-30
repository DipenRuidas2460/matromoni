import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ChatProvider from "./context/ChatProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ChatProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ChatProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

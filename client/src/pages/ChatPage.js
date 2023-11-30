import { ChatState } from "../context/ChatProvider";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideBarDrawer from "../components/miscellaneous/SideBarDrawer";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

function ChatPage({ token, userInfo }) {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%" }}>
      {token ? (
        <Box>
          {user && <SideBarDrawer />}
          <div className="newChatPage">
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </div>
        </Box>
      ) : (
        navigate("/404")
      )}
    </div>
  );
}

export default ChatPage;

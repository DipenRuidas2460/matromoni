import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../chatLogic/chatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m.id}>
            {(isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
              <Tooltip
                label={m.sender.fullName}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.fullName}
                  src={m.sender.photo}
                />
              </Tooltip>
            )}

            <span
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 5 : 17,
                backgroundColor: `${
                  m.sender.id === user.id ? "#B9F5D0" : "#BEE3F8"
                }`,
                borderRadius: "20px",
                padding: "5px 10px",
                maxWidth: "75%",
              }}
            >
              {
                <>
                  {
                    <sup>
                      {m.createdAt.slice(8, 10) +
                        "." +
                        m.createdAt.slice(5, 7) +
                        "." +
                        m.createdAt.slice(2, 4)}
                    </sup>
                  }
                  {<br />}
                  {m.content} {<sub>{m.createdAt.slice(11, 16)}</sub>}
                </>
              }
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

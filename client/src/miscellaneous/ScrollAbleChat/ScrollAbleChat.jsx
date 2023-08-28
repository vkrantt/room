import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isLastMessageForSender,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isSender,
} from "../../chatlogics/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import dayjs from "dayjs";

const ScrollAbleChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", position: "relative" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <>
                  <Avatar
                    mt="23px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.picture}
                  />

                  <p
                    style={{
                      fontSize: "8px",
                      fontWeight: "bold",
                      color: "#888",
                      height: "10px",
                      position: "absolute",
                      bottom: "-12px",
                      left: "37px",
                    }}
                  >
                    {dayjs(m.createdAt).format("MM/DD/YY hh:mm A")}
                  </p>
                </>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "var(--primary)" : "#FFFFFF"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 5 : 30,
                padding: "12px",
                maxWidth: "75%",
                fontSize: "14px",
                color: `${
                  m.sender._id === user._id
                    ? "#ffffff"
                    : "rgba(50, 71, 92, 0.87)"
                }`,
                boxShadow:
                  "rgba(50, 71, 92, 0.2) 0px 2px 1px -1px, rgba(50, 71, 92, 0.14) 0px 1px 1px 0px, rgba(50, 71, 92, 0.12) 0px 1px 3px 0px",
                borderTopRightRadius: `${
                  m.sender._id === user._id ? "5px" : "5px"
                }`,
                borderBottomLeftRadius: `${
                  m.sender._id === user._id ? "5px" : "5px"
                }`,
                borderTopLeftRadius: `${
                  m.sender._id === user._id ? "5px" : ""
                }`,
                borderBottomRightRadius: `${
                  m.sender._id === user._id ? "" : "5px"
                }`,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollAbleChat;

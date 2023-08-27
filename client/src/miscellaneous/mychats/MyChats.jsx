import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { sendError } from "../../handlers/errorHandler";
import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/react";
import ChatLoading from "../../components/ChatLoading";
import { getSender, getSenderPic } from "../../chatlogics/ChatLogics";
import GroupChatModal from "../groupchatmodal/GroupChatModal";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, user, setSelectedChat, chats, setChats } = ChatState();
  const [loading, setLoading] = useState(false);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
      setLoading(false);
      setChats(data);
    } catch (error) {
      setLoading(false);
      sendError(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("room_token")));
    fetchChat();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "25px", md: "30px" }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="end"
        fontWeight="bold"
      >
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            <AiOutlineUsergroupAdd />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        flexDir="column"
        display="flex"
        p={3}
        bg="#f8f8f8"
        width="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {/* {loading && <ChatLoading />} */}
        {!loading && chats.length === 0 ? (
          <Box display="flex" justifyContent="center" margin="10px 0">
            Search people and chat
          </Box>
        ) : (
          ""
        )}
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8e8e8"}
                color={selectedChat === chat ? "#fff" : "#000"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
              >
                {!chat.isGroupChat && (
                  <Avatar
                    src={getSenderPic(loggedUser, chat.users)}
                    alt={getSenderPic(loggedUser, chat.users)}
                    me={2}
                    width="35px"
                    height="35px"
                  />
                )}
                <Text display="flex" flexDir="column">
                  <Text style={{ fontWeight: "bold" }}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat?.latestMessage ? (
                    <span style={{ fontSize: "11px" }}>
                      <b style={{ paddingRight: "5px" }}>
                        {chat?.latestMessage?.sender?.name}:
                      </b>
                      <span>{chat?.latestMessage?.content}</span>
                    </span>
                  ) : (
                    ""
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

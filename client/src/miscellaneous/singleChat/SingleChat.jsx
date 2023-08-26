import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import "./SingleChat.css";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from "../updategroupmodal/UpdateGroupChatModal";
import { getSender, getSenderFull } from "../../chatlogics/ChatLogics";
import ProfileModal from "../ProfileModal";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import ScrollAbleChat from "../ScrollAbleChat/ScrollAbleChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../asset/animation_llrv8nzg.json";
import nochat from "../../asset/nochat.png";
import { BiSolidPaperPlane } from "react-icons/bi";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  // SOCKET
  useEffect(() => {
    socket = io(BASE_URL);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      // call api
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        fetchMessages();
      } catch (error) {
        toast({
          title: "An error occured",
          status: "error",
          position: "top",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("joinchat", selectedChat._id);
    } catch (error) {
      toast({
        title: "An error occured",
        status: "error",
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // send notificaton
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {/* Messages here */}

            {loading ? (
              <Spinner
                size="sm"
                w={10}
                h={10}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {/* Messages */}
                <ScrollAbleChat messages={messages} />
              </div>
            )}

            <FormControl isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottm: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Box display="flex">
                <Input
                  variant="filled"
                  bg="#e0e0e0"
                  onChange={typingHandler}
                  value={newMessage}
                  placeholder="Type your message here..."
                />
                <Button
                  type="button"
                  onClick={() => sendMessage()}
                  borderRadius="100%"
                  marginLeft="10px"
                  width="20px"
                  heigh="20px"
                >
                  <span style={{ fontSize: "20px" }}>
                    <BiSolidPaperPlane />
                  </span>
                </Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          width="100%"
          height="100%"
        >
          <Image src={nochat} alt="No chats" width="40%" />
          <Text fontSize="35px " pb={3}>
            <span>Select a user to Chat</span>
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

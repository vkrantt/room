import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../../miscellaneous/sidedrawer/SideDrawer";
import MyChats from "../../miscellaneous/mychats/MyChats";
import ChatBox from "../../miscellaneous/chatbox/ChatBox";
const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        w="100%"
        h="91.5vh"
        p="10px"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;

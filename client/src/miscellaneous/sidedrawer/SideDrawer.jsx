import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { FiBell } from "react-icons/fi";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "../ProfileModal";
import { useHistory } from "react-router-dom";
import { sendError } from "../../handlers/errorHandler";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import ChatLoading from "../../components/ChatLoading";
import UserListItem from "../../components/avatar/UserListItem";
import { getSender } from "../../chatlogics/ChatLogics";

const SideDrawer = () => {
  const history = useHistory();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const logoutHandler = () => {
    localStorage.removeItem("room_token");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${BASE_URL}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      sendError(error);
    }
  };

  //   access chat on click
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/api/chat`,
        { userId },
        config
      );

      //   if already in chats
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      sendError(error);
    }
  };
  return (
    <>
      <Box
        style={{ display: "flex", justifyContent: "space-between" }}
        alignItems="center"
        w="100%"
        p="5px 10px 5pxd 10px "
        boxShadow="md"
      >
        <Tooltip label="Search users to chat" aria-label="A tooltip">
          <Button variant="none" onClick={onOpen}>
            <span style={{ fontSize: "20px" }}>
              <BiSearch />
            </span>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="'Pacifico', cursive">
          room
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <Badge ml="1" colorScheme="red">
                {notifications.length}
              </Badge>

              <FiBell />
            </MenuButton>
            <MenuList p={2}>
              {!notifications.length && "No notification"}

              {notifications.map((n) => (
                <MenuItem
                  key={n._id}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotifications(
                      notifications.filter((notification) => notification !== n)
                    );
                  }}
                >
                  {n.chat.isGroupChat
                    ? `New Message in ${n.chat.chayName}`
                    : `${getSender(user, n.chat.users)} just messaged you`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              variant="none"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="button" onClick={handleSearch}>
                Go
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              <span>
                {searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
              </span>
            )}
          </DrawerBody>
          {loadingChat && <Spinner ml="auto" display="flex" />}
          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

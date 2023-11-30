import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
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
  useToast,
} from "@chakra-ui/react";
import React, { useState} from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import axios from "axios";
import ChatLoading from "../modules/ChatLoading";
import UserListItems from "../userAvatar/UserListItems";

function SideBarDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const host = `http://localhost:3010`;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter somthing in search!",
        status: "warning",
        duration: 3000,
        isCloseable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(
        `${host}/customer/getAllUsers?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(response.data.data);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const accessChat = async (personId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(`${host}/chat`, { personId }, config);

      let allChats;
      if (response.data.fullChat !== undefined) {
        allChats = response.data.fullChat;
      } else {
        allChats = response.data.isChat;
      }

      if (!chats?.find((c) => c?.id === allChats.id))
        setChats([allChats, ...chats]);

      setSelectedChat(allChats);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div className="sidebar-chat">
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <div>
          <Menu>
            <MenuButton p={1}>
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.fullName}
                src={user?.photo}
              />
            </MenuButton>
            <MenuList>
              <ProfileMenu user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileMenu>
              <MenuDivider />
              <MenuItem>Manage Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItems
                  key={u.id}
                  u={u}
                  handleFunction={() => accessChat(u.id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBarDrawer;

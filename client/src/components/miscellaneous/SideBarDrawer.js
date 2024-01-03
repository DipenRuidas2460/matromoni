import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileMenu from "./ProfileMenu";

function SideBarDrawer() {
  const { user } = ChatState();
  const host = `http://192.168.1.19:3010`;

  return (
    <>
      <div className="sidebar-chat">
        <div
          style={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "self-start",
            justifyContent: "space-around",
          }}
        >
          <Menu>
            <MenuItem
              w="80%"
              fontWeight="600"
              fontSize="20px"
              fontFamily="Montserrat"
              wordBreak="break-word"
              color="#565656"
            >{`${user.firstName} ${user.lastName}`}</MenuItem>
          </Menu>
          <div
            className="available-text"
          >
            Available
          </div>
        </div>
        <div className="profile-photo-icon">
          <Menu>
            <MenuButton p={1}></MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={`${user.firstName} ${user.lastName}`}
                src={
                  user.photo != null
                    ? `${host}/assets/image/${user.id}_profile.jpg`
                    : ""
                }
              />
            </MenuButton>
            <MenuList>
              <ProfileMenu user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileMenu>
              <MenuDivider />
              <MenuDivider />
            </MenuList>
          </Menu>
        </div>
      </div>
    </>
  );
}

export default SideBarDrawer;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function HeadingDashboard({token}) {
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const navigate = useNavigate();
  const host = `http://localhost:3010`;
  const toast = useToast();
  const fields = [
    "Dashboard",
    "Profile",
    "Search Preferences",
    "Settings",
    "More",
  ];

  const headingFields = ["My Diaspora", "Matches", "Requests", "Messages"];

  const handleFieldClick = (fieldName) => {
    setSelectedField(fieldName);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(`${host}/customer/getUserById`, config)
      .then(({ data }) => {
        if (data.status === "success") {
          if (data.data.photo) {
            setUserProfilePhoto(`${host}${data.profileImage}`);
          }
        }
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="header-con"></div>
      <div className="navbar-con">
        <img
          className="navbar-logo-img"
          src="/diaspora.png"
          alt="diaspora-logo"
        />
        <ul className="dashboard-nav-1">
          {headingFields.map((field, i) => (
            <li key={i}>
              <Link
                to={`/${
                  field === "My Diaspora"
                    ? "Dashboard"
                    : field === "Messages"
                    ? "new-chats"
                    : field
                }`}
                className={`li-list ${
                  selectedField === field ? "red-text" : ""
                }`}
                onClick={() => handleFieldClick(field)}
              >
                {field}
              </Link>
            </li>
          ))}
        </ul>
        <div className="dashboard-nav-2">
          <button type="button" className="dashboard-button">
            UPGRADE PLAN
          </button>
          <p style={{cursor:"pointer"}}>Help</p>
          <div className="avatar-menu">
            <Menu>
              <MenuButton></MenuButton>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                bg="white"
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  src={userProfilePhoto}
                  alt=""
                />
              </MenuButton>
              <MenuList h="10px" w="10px">
                <MenuItem onClick={handleLogOut} fontSize="14px">
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
      <div className="dashboard-header-con">
        <ul className="dashboard-header-con-ul">
          {fields.map((field, i) => (
            <li key={i}>
              <Link
                to={`/${
                  field === "Search Preferences" ? "Search-Preferences" : field
                }`}
                className={`li-list ${
                  selectedField === field ? "underline" : ""
                }`}
                onClick={() => handleFieldClick(field)}
              >
                {field}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HeadingDashboard;

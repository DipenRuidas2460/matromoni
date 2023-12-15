import React from "react";
import Footer from "../miscellaneous/Footer";
import CountryAndPrivacy from "../miscellaneous/CountryAndPrivacy";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NotFound from "../partials/404";

function Dashboard({ token }) {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      {token ? (
        <div>
          <div className="header-con"></div>
          <div className="navbar-con">
            <img
              className="navbar-logo-img"
              src="/diaspora.png"
              alt="diaspora-logo"
            />
            <ul className="dashboard-nav-1">
              <li>My Diaspora</li>
              <li>Matches</li>
              <li>Requests</li>
              <li>Messages</li>
            </ul>
            <div className="dashboard-nav-2">
              <button type="button" className="dashboard-button">
                UPGRADE PLAN
              </button>
              <p>Help</p>
              <div className="avatar-menu">
                <Menu>
                  <MenuButton p={1}></MenuButton>
                </Menu>

                <Menu>
                  <MenuButton
                    as={Button}
                    bg="white"
                    rightIcon={<ChevronDownIcon />}
                  >
                    <Avatar size="sm" cursor="pointer" src="/male-avatar.jpg" />
                  </MenuButton>
                  <MenuList h="20px" w="20px">
                    <MenuItem onClick={handleLogOut} fontSize="14px">Log Out</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>
          <div className="dashboard-header-con">
            <ul className="dashboard-header-con-ul">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>Profile</li>
              <li>Search Preferences</li>
              <li>Settings</li>
              <li>More</li>
            </ul>
          </div>
          <div className="black-space-div"></div>
          <div className="white-space-div">
            <div className="dashboard-middle">
              <div className="dashboard-middle-part-1"></div>
              <div className="dashboard-middle-part-2"></div>
            </div>
          </div>
          <CountryAndPrivacy />
          <Footer />
        </div>
      ) : (
        <NotFound/>
      )}
    </div>
  );
}

export default Dashboard;

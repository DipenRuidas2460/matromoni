import React, { useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import NotFound from "../partials/404";
import axios from "axios";

function Dashboard({ token }) {
  const navigate = useNavigate();
  const [userFullName, setUserFullName] = useState(null);
  const host = `http://localhost:3010`;
  const toast = useToast();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleFileChange = (event, elementId) => {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        selectedImage.src = e.target.result;
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(`${host}/customer/getUserById`, config)
      .then(({ data }) => {
        if (data.status === "success") {
          setUserFullName(`${data.data.firstName} ${data.data.lastName}`);
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast({
          title: "Something Went Wrong -- Data not access!",
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
                  <MenuButton></MenuButton>
                </Menu>

                <Menu>
                  <MenuButton
                    as={Button}
                    bg="white"
                    rightIcon={<ChevronDownIcon />}
                  >
                    <Avatar size="sm" cursor="pointer" src="/male-avatar.jpg" />
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
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>Profile</li>
              <li>Search Preferences</li>
              <li>Settings</li>
              <li>More</li>
            </ul>
          </div>
          <div className="black-space-div"></div>
          <div className="white-space-div">
            <div className="dashboard-middle">
              <div className="dashboard-middle-part-1">
                <div className="dashboard-photo">
                  <img
                    id="selectedAvatar"
                    src="https://mdbootstrap.com/img/Photos/Others/placeholder-avatar.jpg"
                    className="dashboard-img"
                    alt=""
                  />
                </div>
                <div className="dashboard-photo-addButton">
                  <label
                    className="photo-addButton-label"
                    htmlFor="customFile2"
                  >
                    + Add Photo
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg, image/jpg, image/png, image/webp, image/svg+xml, image/gif, image/avif, image/tiff"
                    className="dashboard-photo-input"
                    id="customFile2"
                    onChange={(e) => handleFileChange(e, "selectedAvatar")}
                  />
                </div>
                <div className="dashboard-name">{userFullName}</div>
                <div className="login-user-id">USA-5454029221</div>
                <div className="dash-first-line"></div>
                <div className="dash-account-type">
                  <div className="account-type-inn">
                    <p>Account Type</p>
                    <strong>Free Membership</strong>
                  </div>
                  <div className="account-upgrade">Upgrade</div>
                </div>
                <div className="dash-second-line"></div>
                <div className="dash-mobile-verified">
                  <div className="mobile-verified-inn">
                    <p>Mobile no. is verified</p>
                    <div className="verify-id">Verify Your ID</div>
                  </div>
                  <img className="verify-img" src="/shield.png" alt="shield" />
                </div>
              </div>
              <div className="dashboard-middle-part-2">
                <div className="part-2-first">
                  <div className="activity-summ-text">
                    Your Activity Summary
                  </div>
                  <div className="summ-boxes">
                    <div className="similar-box-1">
                      <div className="under-box-text">
                        <div className="number-text">0</div>
                        <div className="description-text">
                          Pending Invitation
                        </div>
                      </div>
                    </div>
                    <div className="similar-box-2">
                      <div className="under-box-text">
                        <div className="number-text">5</div>
                        <div className="description-text">
                          Accepted Invitation
                        </div>
                      </div>
                    </div>
                    <div className="similar-box-3">
                      <div className="under-box-text">
                        <div className="number-text">3</div>
                        <div className="description-text">
                          Recent Visits
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="premium-text">Premium Features</div>
                  <div className="premium-boxes">
                    <div className="similar-box-4">
                      <div className="under-box-text">
                        <div className="number-text">0</div>
                        <div className="description-text">
                          Contacts Viewed
                        </div>
                      </div>
                    </div>
                    <div className="similar-box-5">
                      <div className="under-box-text">
                        <div className="number-text">5</div>
                        <div className="description-text">
                          Chats Initiated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="featurs-third-line"></div>
                  <div className="dashboad-bootom-text">
                    Video Introduction increase visibility
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-md"
                    style={{
                      position: "relative",
                      top: "23%",
                      width: "45%",
                      fontSize: "12px",
                    }}
                  >
                    + Create Video Introduction
                  </button>
                </div>
                <div className="part-2-second">
                  <div className="part-2-container"></div>
                  <div className="last-small-boxes">
                    <div className="same-box"></div>
                    <div className="same-box"></div>
                    <div className="same-box"></div>
                    <div className="same-box"></div>
                    <div className="same-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CountryAndPrivacy />
          <Footer />
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default Dashboard;

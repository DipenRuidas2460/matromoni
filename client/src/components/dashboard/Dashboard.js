import React, { useEffect, useState } from "react";
import Footer from "../miscellaneous/Footer";
import CountryAndPrivacy from "../miscellaneous/CountryAndPrivacy";
import { useNavigate } from "react-router-dom";
import {
  Button,
  useToast,
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import HeadingDashboard from "./HeadingDashboard";
import config from "../../config/config";

function Dashboard({ token }) {
  const navigate = useNavigate();
  const [userFullName, setUserFullName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const host = config.BCKHOST;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileChange = (event, elementId) => {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
      setSelectedFile(fileInput.files[0]);
      const reader = new FileReader();
      reader.onload = function (e) {
        selectedImage.src = e.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("photo", selectedFile);
    axios
      .put(`${host}/customer/update`, formData, config)
      .then((respon) => {
        if (respon.data.status === 200) {
          toast({
            title: "Profile Photo Update Successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("err:-", err.message);
        toast({
          title: err.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });

    onClose();
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
          setUserFullName(`${data.data.firstName} ${data.data.lastName}`);
        }
      })
      .catch((err) => {
        navigate("/404");
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
      {token ? (
        <div>
          <HeadingDashboard token={token} />
          <div className="black-space-div"></div>
          <div className="white-space-div">
            <div className="dashboard-middle">
              <div className="dashboard-middle-part-1">
                <div className="dashboard-photo">
                  <img
                    src={userProfilePhoto}
                    className="dashboard-img"
                    alt=""
                  />
                </div>
                <button
                  type="button"
                  className="dashboard-photo-addButton"
                  onClick={onOpen}
                >
                  + Add photo
                </button>
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
                        <div className="description-text">Recent Visits</div>
                      </div>
                    </div>
                  </div>
                  <div className="premium-text">Premium Features</div>
                  <div className="premium-boxes">
                    <div className="similar-box-4">
                      <div className="under-box-text">
                        <div className="number-text">0</div>
                        <div className="description-text">Contacts Viewed</div>
                      </div>
                    </div>
                    <div className="similar-box-5">
                      <div className="under-box-text">
                        <div className="number-text">5</div>
                        <div className="description-text">Chats Initiated</div>
                      </div>
                    </div>
                  </div>
                  <div className="featurs-third-line"></div>
                  <div className="dashboad-bootom-text">
                    Video Introduction increase visibility
                  </div>
                  <button type="button" className="video-create-button">
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
          <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="400px" width="90vw">
              <ModalHeader
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Heading fontSize="20px" paddingTop={4}>
                  Upload Profile Photo
                </Heading>
              </ModalHeader>

              <ModalCloseButton />

              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <Box
                    height="200px"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box height="150px" width="150px">
                      <Image
                        height="150px"
                        width="150px"
                        objectFit="cover"
                        src="https://mdbootstrap.com/img/Photos/Others/placeholder-avatar.jpg"
                        alt=""
                        id="selectedAvatar"
                      />
                    </Box>
                    <Input
                      type="file"
                      name="photo"
                      accept="image/jpeg, image/jpg, image/png, image/webp"
                      position="relative"
                      width="50%"
                      border="none"
                      top="5%"
                      onChange={(e) => handleFileChange(e, "selectedAvatar")}
                    />
                  </Box>
                </ModalBody>

                <ModalFooter
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    type="submit"
                    bg="#00AFD5"
                    width="40%"
                    borderRadius="20px"
                    color="#fff"
                    _hover={{
                      bg: "#00AFD5",
                      color: "#fff",
                    }}
                    isDisabled={!selectedFile}
                  >
                    Upload
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <CountryAndPrivacy />
          <Footer />
        </div>
      ) : (
        navigate("/404")
      )}
    </div>
  );
}

export default Dashboard;

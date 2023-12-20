import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CountryAndPrivacy from "../miscellaneous/CountryAndPrivacy";
import Footer from "../miscellaneous/Footer";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function UploadPhoto({ token }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const host = `http://localhost:3010`;
  const toast = useToast();

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
        console.log("err:-", err);
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
        if (data.status === "success" && data.data.photo) {
          setUserProfilePhoto(`${host}${data.profileImage}`);
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
              <Link className="link-dashboard" to="/dashboard">
                I'm ok with no response
              </Link>
            </div>
            <div className="black-space-div"></div>
            <div className="white-space-div">
              <div className="upload-parent-box">
                <div className="upload-photo-heading">Upload Photos</div>
                <div className="upload-photo-text">
                  80% of users donot choose a Match without Photos
                </div>
                <div className="upload-preview-box">
                  <img
                    src={userProfilePhoto}
                    className="upload-profile-photo-page"
                    alt=""
                  />
                </div>
                <button
                  type="button"
                  className="add-photo-upload-button"
                  onClick={onOpen}
                >
                  + Add Photos
                </button>
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
                        accept="image/jpeg, image/jpg, image/png, image/webp, image/svg+xml, image/gif, image/avif, image/tiff"
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
    </div>
  );
}

export default UploadPhoto;

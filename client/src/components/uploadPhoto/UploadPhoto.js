import React from "react";
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
} from "@chakra-ui/react";

function UploadPhoto({ token }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
                <div className="upload-preview-box"></div>
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

                <form>
                  <ModalBody>
                    <Box
                      height="200px"
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                        <Box height="150px" width="150px" bg="#D9D9D9" borderRadius="50%"></Box>
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
                      //   isDisabled={isButtonDisabled1}
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

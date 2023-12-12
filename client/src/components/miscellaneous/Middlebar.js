import React, { useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Image,
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const Middlebar = () => {
  const { isOpen, onOpen, onClose, onBack } = useDisclosure();
  const [isSelected, setIsSelected] = useState(null);

  const boxes1 = [
    { id: 1, name: "Myself" },
    { id: 2, name: "My Son" },
    { id: 3, name: "My Daughter" },
    { id: 4, name: "My Brother" },
  ];
  const boxes2 = [
    { id: 5, name: "My Sister" },
    { id: 6, name: "My Friend" },
    { id: 7, name: "My Relative" },
  ];

  const boxes3 = [
    { id: 8, name: "Male", avatar: "/male-avatar-1.jpg" },
    { id: 9, name: "Female", avatar: "/female-avatar.png" },
  ];

  const handleClick = (boxId) => {
    setIsSelected(boxId);
  };

  return (
    <div className="middlebar-main">
      <img className="middlebar-main-img" src="/shaadi.png" alt="shaadiPhoto" />
      <div className="co-ho">
        <form className="form-co-ho">
          <div className="form-main">
            <label htmlFor="inp1" className="form-label-1">
              I'm looking for
            </label>
            <input type="text" className="looking-inp" id="inp1" required />
          </div>
          <div className="form-main">
            <label htmlFor="inp2" className="form-label-2">
              Aged
            </label>
            <div className="form-aged-inp">
              <input type="text" className="aged-inp" id="inp2" required />
              <p>to</p>
              <input type="text" className="aged-inp" id="inp2" required />
            </div>
          </div>
          <div className="form-main">
            <label htmlFor="inp3" className="form-label-3">
              Community
            </label>
            <input type="text" className="looking-inp" id="inp3" required />
          </div>
          <div className="form-main">
            <label htmlFor="inp4" className="form-label-4">
              Living in
            </label>
            <input type="text" className="looking-inp" id="inp4" required />
          </div>
          <button type="button" className="btn btn-info" onClick={onOpen}>
            Let's Begin
          </button>
        </form>
      </div>

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="350px">
          <ModalHeader display="flex" justifyContent="center">
            <Heading fontSize="20px">This Profile is for</Heading>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Box
              height="50%"
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {boxes1.map((b) => (
                <Box
                  key={b.id}
                  height="50%"
                  width="20%"
                  bg={
                    isSelected === b.id
                      ? "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)"
                      : "#EEEEEE"
                  }
                  color={isSelected === b.id ? "#fff" : "#000"}
                  border="1px solid #EEEEEE"
                  borderRadius="14px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  _hover={{
                    bg: "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)",
                    color: "#fff",
                  }}
                  onClick={() => handleClick(b.id)}
                >
                  <Text fontSize="14px" cursor="pointer">
                    {b.name}
                  </Text>
                </Box>
              ))}
            </Box>

            <Box
              height="50%"
              width="100%"
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
            >
              {boxes2.map((box) => (
                <Box
                  key={box.id}
                  height="50%"
                  width="20%"
                  bg={
                    isSelected === box.id
                      ? "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)"
                      : "#EEEEEE"
                  }
                  color={isSelected === box.id ? "#fff" : "#000"}
                  border="1px solid #EEEEEE"
                  borderRadius="14px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  _hover={{
                    bg: "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)",
                    color: "#fff",
                  }}
                  onClick={() => handleClick(box.id)}
                >
                  <Text fontSize="14px" cursor="pointer">
                    {box.name}
                  </Text>
                </Box>
              ))}
            </Box>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button
              bg="#D40000"
              width="40%"
              borderRadius="20px"
              color="#fff"
              _hover={{
                bg: "#D40000",
                color: "#fff",
              }}
              onClick={onOpen}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="350px">
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                onClick={onBack}
              />
              <Heading fontSize="20px" mx="auto">
                {" "}
                Select Gender{" "}
              </Heading>
            </Flex>
          </ModalHeader>

          <ModalBody>
            <Box
              height="95%"
              width="100%"
              display="flex"
              justifyContent="space-evenly"
              alignItems="center"
            >
              {boxes3.map((b) => (
                <Box
                  key={b.id}
                  height="65%"
                  width="30%"
                  bg={
                    isSelected === b.id
                      ? "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)"
                      : "#EEEEEE"
                  }
                  color={isSelected === b.id ? "#fff" : "#000"}
                  border="1px solid #EEEEEE"
                  borderRadius="14px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  cursor="pointer"
                  _hover={{
                    bg: "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)",
                    color: "#fff",
                  }}
                  onClick={() => handleClick(b.id)}
                >
                  <Image
                    borderRadius="full"
                    boxSize="70px"
                    src={b.avatar}
                    alt="avatar"
                  />
                  <Text fontSize="14px" mt={2} cursor="pointer">
                    {b.name}
                  </Text>
                </Box>
              ))}
            </Box>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button
              bg="#D40000"
              width="40%"
              borderRadius="20px"
              color="#fff"
              _hover={{
                bg: "#D40000",
                color: "#fff",
              }}
              onClick={onOpen}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Middlebar;

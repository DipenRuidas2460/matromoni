import React, { useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Image,
  Flex,
  Button,
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
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import usePasswordToggle from "../../hook/usePasswordToggle";

const Middlebar = () => {
  const [isSelected, setIsSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [passwordInputType, ToggleIcon] = usePasswordToggle();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const daysOptions = Array.from({ length: 31 }, (_, index) => index + 1);
  const monthsOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  const yearsOptions = Array.from({ length: 80 }, (_, index) => 2023 - index);
  const countryCodes = [
    { code: "+1", label: "Canada" },
    { code: "+44", label: "United Kingdom" },
    { code: "+91", label: "India" },
    { code: "+61", label: "Australia" },
    { code: "+971", label: "United Arab Emirates" },
    { code: "+966", label: "Saudi Arabia" },
    { code: "+974", label: "Qutar" },
    { code: "+33", label: "France" },
    { code: "+49", label: "Germany" },
  ];

  const handleClick = (boxId) => {
    setIsSelected(boxId);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const afterClickSubmit = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="middlebar-main">
      <img className="middlebar-main-img" src="/shaadi.png" alt="shaadiPhoto" />
      <div className="co-ho">
        <form className="form-co-ho">
          <div className="form-main">
            <label htmlFor="inp10" className="form-label-1">
              I'm looking for
            </label>
            <input type="text" className="looking-inp" id="inp10" required />
          </div>
          <div className="form-main">
            <label htmlFor="inp8" className="form-label-2">
              Aged
            </label>
            <div className="form-aged-inp">
              <input type="text" className="aged-inp" id="inp8" required />
              <p>to</p>
              <input type="text" className="aged-inp" id="inp9" required />
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
          {step === 1 && (
            <button type="button" className="btn btn-info" onClick={onOpen}>
              Let's Begin
            </button>
          )}
        </form>
      </div>

      <form>
        {step === 1 && (
          <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="420px">
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
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {step === 2 && (
          <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="420px">
              <ModalHeader>
                <Flex justify="space-between" align="center">
                  <IconButton
                    aria-label="Back"
                    icon={<ArrowBackIcon />}
                    onClick={handleBack}
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
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {step === 3 && (
          <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="420px">
              <ModalHeader>
                <Flex justify="space-between" align="center">
                  <IconButton
                    aria-label="Back"
                    icon={<ArrowBackIcon />}
                    onClick={handleBack}
                  />
                </Flex>
              </ModalHeader>

              <ModalBody>
                <Box height="100%" width="100%">
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="First Name" backgroundColor="#ebe9e9" />
                    <Input
                      placeholder="Last Name"
                      backgroundColor="#ebe9e9"
                      mt="15px"
                      mb="15px"
                      id="inp-4"
                    />
                    <FormLabel>Date of Birth</FormLabel>
                    <Box display="flex" justifyContent="space-between">
                      <Select placeholder="Day" bg="#ebe9e9" marginRight="15px">
                        {daysOptions.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Select>

                      <Select
                        placeholder="Month"
                        bg="#ebe9e9"
                        marginRight="15px"
                      >
                        {monthsOptions.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </Select>

                      <Select placeholder="Year" bg="#ebe9e9">
                        {yearsOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
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
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {step === 4 && (
          <Modal
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
            isCentered
          >
            <ModalOverlay />
            <ModalContent h="430px">
              <Box
                width="15%"
                height="15%"
                bg="rgba(255, 209, 92, 0.50)"
                borderRadius="50%"
                position="relative"
                left="41%"
                bottom="6%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Image src="/shield.png" alt="shield" boxSize="50px" />
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <Text fontSize="12px">
                  An active email ID & phone no. are required to sequre your
                  profile
                </Text>
              </Box>

              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                width="5%"
                position="relative"
                left="5%"
                bottom="4%"
                onClick={handleBack}
              />

              <ModalBody>
                <Box height="100%" width="100%">
                  <FormControl>
                    <FormLabel>Email ID</FormLabel>
                    <Input
                      type="email"
                      placeholder="Email ID"
                      backgroundColor="#ebe9e9"
                      mb="10px"
                      id="inp-1"
                    />
                    <FormLabel>Password</FormLabel>
                    <Box position="relative" display="flex" width="100%">
                      <Input
                        type={passwordInputType}
                        placeholder="Password"
                        backgroundColor="#ebe9e9"
                        mb="10px"
                        id="inp-2"
                      />
                      <Box
                        display="flex"
                        alignItems="center"
                        height="40px"
                        width="20px"
                        borderRadius="5px"
                        border="1px solid grey"
                        backgroundColor="#ebe9e9"
                      >
                        {ToggleIcon}
                      </Box>
                    </Box>
                    <FormLabel>Mobile No</FormLabel>
                    <Box display="flex" justifyContent="space-between">
                      <Select placeholder="Select" mr="20px" width="40%">
                        {countryCodes.map(({ code, label }) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="tel"
                        placeholder="Mobile No"
                        backgroundColor="#ebe9e9"
                        mb="10px"
                        id="inp-3"
                      />
                    </Box>
                  </FormControl>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="12px"
                  >
                    By creating account, you agree to your{" "}
                    <Box h="1" w="1" bg="transparent" display="inline-block" />
                    <Link to="/privacy-policy"> Privacy Policy </Link>{" "}
                    <Box h="1" w="1" bg="transparent" display="inline-block" />{" "}
                    and{" "}
                    <Box h="1" w="1" bg="transparent" display="inline-block" />
                    <Link to="/terms-con"> T&C </Link>{" "}
                    <Box h="1" w="1" bg="transparent" display="inline-block" />
                  </Box>
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
                  onClick={afterClickSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </form>
    </div>
  );
};

export default Middlebar;

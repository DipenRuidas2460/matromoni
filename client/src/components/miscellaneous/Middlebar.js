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
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import usePasswordToggle from "../../hook/usePasswordToggle";
import { useForm } from "react-hook-form";
import axios from "axios";
import config from "../../config/config";

const Middlebar = () => {
  const [isSelected1, setIsSelected1] = useState(null);
  const [isSelected2, setIsSelected2] = useState(null);
  const [formData1, setFormData1] = useState({
    lookingFor: "",
    aged1: "",
    aged2: "",
    community: "",
    livingIn: "",
  });

  const [formData2, setFormData2] = useState({
    firstName: "",
    lastName: "",
    lookingFor: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    email: "",
    password: "",
    countryPhoneCode: "",
    phoneNumber: "",
  });

  const [err, setErr] = useState({});
  const [step, setStep] = useState(1);
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(true);
  const [isButtonDisabled2, setIsButtonDisabled2] = useState(true);
  const [passwordInputType, ToggleIcon] = usePasswordToggle();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  const host = config.BCKHOST;

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

  const validateForm = () => {
    let newErrors = {};

    if (formData1.lookingFor.trim() === "") {
      newErrors.lookingFor = "Looking For is required";
    }

    if (formData1.aged1.trim() === "") {
      newErrors.aged1 = "aged1 is required";
    }

    if (formData1.aged2.trim() === "") {
      newErrors.aged2 = "aged2 is required";
    }

    if (formData1.community.trim() === "") {
      newErrors.community = "community is required";
    }

    if (formData1.livingIn.trim() === "") {
      newErrors.livingIn = "livingIn is required";
    }

    setErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData1({
      ...formData1,
      [name]: value,
    });
  };

  const handleClick = (e, name, boxId) => {
    if (
      boxId === 1 ||
      boxId === 2 ||
      boxId === 3 ||
      boxId === 4 ||
      boxId === 5 ||
      boxId === 6 ||
      boxId === 7
    ) {
      setFormData2({
        ...formData2,
        lookingFor: name,
      });
      setIsSelected1(boxId);
      setIsButtonDisabled1(false);
    } else if (boxId === 8 || boxId === 9) {
      setFormData2({
        ...formData2,
        gender: name,
      });
      setIsSelected2(boxId);
      setIsButtonDisabled2(false);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFirstModalOpen = () => {
    if (step > 1) {
      setStep(1);
    }
    onOpen();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
  };

  const handleHomeFormSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post(`${host}/create-search`, formData1)
        .then((result) => {
          if (result.data.status === "success") {
            toast({
              title: "Search Data Store Successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          }
        })
        .catch((er) => {
          console.log(er.message);
          toast({
            title: "Something Went wrong!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        });
    } else {
      toast({
        title: "Form validation failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    handleFirstModalOpen();
  };

  const onSubmitModal1 = (e) => {
    handleNext();
  };

  const onSubmitModal2 = (e) => {
    handleNext();
  };

  const onSubmitModal3 = (e) => {
    handleNext();
  };

  const onSubmit = (e) => {
    handleNext();
    if (
      formData2.firstName !== "" ||
      formData2.lastName !== "" ||
      formData2.lookingFor !== "" ||
      formData2.day !== "" ||
      formData2.month !== "" ||
      formData2.year !== "" ||
      formData2.phoneNumber !== "" ||
      formData2.email !== "" ||
      formData2.password !== "" ||
      formData2.countryPhoneCode !== "" ||
      formData2.gender !== ""
    ) {
      axios
        .post(`${host}/customer/register`, formData2)
        .then((result) => {
          if (step === 4 && result.data.status === "success") {
            toast({
              title: "User Data Store Successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          }
        })
        .catch((er) => {
          console.log(er.message);
          toast({
            title: "Something Went wrong!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        });
    }
    if (step === 4) {
      setStep(1);
      onClose();
    }
  };

  return (
    <div className="middlebar-main">
      <img className="middlebar-main-img" src="/shaadi.png" alt="shaadiPhoto" />
      <div className="co-ho">
        <form className="form-co-ho" onSubmit={handleHomeFormSubmit}>
          <div className="form-main">
            <label htmlFor="lookingForId" className="form-label-1">
              I'm looking for
            </label>
            <input
              type="text"
              className="looking-inp"
              id="lookingForId"
              name="lookingFor"
              value={formData1.lookingFor}
              onChange={handleInputChange}
              required
            />
            {err.lookingFor && <span>{err.lookingFor}</span>}
          </div>
          <div className="form-main">
            <label htmlFor="aged1" className="form-label-2">
              Aged
            </label>
            <div className="form-aged-inp">
              <input
                type="text"
                className="aged-inp"
                id="aged1"
                name="aged1"
                value={formData1.aged1}
                onChange={handleInputChange}
                required
              />
              {err.aged1 && <span>{err.aged1}</span>}
              <p>to</p>
              <input
                type="text"
                className="aged-inp"
                id="aged2"
                name="aged2"
                value={formData1.aged2}
                onChange={handleInputChange}
                required
              />
              {err.aged2 && <span>{err.aged2}</span>}
            </div>
          </div>
          <div className="form-main">
            <label htmlFor="inp3" className="form-label-3">
              Community
            </label>
            <input
              type="text"
              className="looking-inp"
              id="inp3"
              name="community"
              value={formData1.community}
              onChange={handleInputChange}
              required
            />
            {err.community && <span>{err.community}</span>}
          </div>
          <div className="form-main">
            <label htmlFor="inp4" className="form-label-4">
              Living in
            </label>
            <input
              type="text"
              className="looking-inp"
              id="inp4"
              name="livingIn"
              value={formData1.livingIn}
              onChange={handleInputChange}
              required
            />
            {err.livingIn && <span>{err.livingIn}</span>}
          </div>

          <button type="submit" className="btn btn-info">
            Let's Begin
          </button>
        </form>
      </div>
      {step === 1 && (
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent h="460px" width="90vw">
            <ModalHeader display="flex" justifyContent="center">
              <Heading fontSize="20px">This Profile is for</Heading>
            </ModalHeader>

            <ModalCloseButton />

            <form onSubmit={handleSubmit(onSubmitModal1)}>
              <ModalBody>
                <Box
                  height="150px"
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {boxes1.map((b) => (
                    <Box
                      key={b.id}
                      height="45%"
                      width="23%"
                      bg={
                        isSelected1 === b.id
                          ? "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)"
                          : "#EEEEEE"
                      }
                      color={isSelected1 === b.id ? "#fff" : "#000"}
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
                      name="lookingFor"
                      onClick={(e) => handleClick(e, b.name, b.id)}
                    >
                      <Text fontSize="11px" cursor="pointer">
                        {b.name}
                      </Text>
                    </Box>
                  ))}
                </Box>

                <Box
                  height="150px"
                  width="100%"
                  display="flex"
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  {boxes2.map((box) => (
                    <Box
                      key={box.id}
                      height="45%"
                      width="23%"
                      bg={
                        isSelected1 === box.id
                          ? "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)"
                          : "#EEEEEE"
                      }
                      color={isSelected1 === box.id ? "#fff" : "#000"}
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
                      name="lookingFor"
                      onClick={(e) => handleClick(e, box.name, box.id)}
                    >
                      <Text fontSize="11px" cursor="pointer">
                        {box.name}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </ModalBody>

              <ModalFooter display="flex" justifyContent="center">
                <Button
                  type="submit"
                  bg="#D40000"
                  width="40%"
                  borderRadius="20px"
                  color="#fff"
                  _hover={{
                    bg: "#D40000",
                    color: "#fff",
                  }}
                  isDisabled={isButtonDisabled1}
                >
                  Continue
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {step === 2 && (
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent h="460px" width="90vw">
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

            <form onSubmit={handleSubmit(onSubmitModal2)}>
              <ModalBody>
                <Box
                  height="280px"
                  width="100%"
                  display="flex"
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  {boxes3.map((b) => (
                    <Box
                      key={b.id}
                      height="55%"
                      width="35%"
                      bg={
                        isSelected2 === b.id
                          ? "linear-gradient(180deg, #2A2A2A 0%, #13838A 100%)"
                          : "#EEEEEE"
                      }
                      color={isSelected2 === b.id ? "#fff" : "#000"}
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
                      name="gender"
                      onClick={(e) => handleClick(e, b.name, b.id)}
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
                  type="submit"
                  bg="#D40000"
                  width="40%"
                  borderRadius="20px"
                  color="#fff"
                  _hover={{
                    bg: "#D40000",
                    color: "#fff",
                  }}
                  isDisabled={isButtonDisabled2}
                >
                  Continue
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {step === 3 && (
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent h="460px" width="90vw">
            <ModalHeader>
              <Flex justify="space-between" align="center">
                <IconButton
                  aria-label="Back"
                  icon={<ArrowBackIcon />}
                  onClick={handleBack}
                />
              </Flex>
            </ModalHeader>

            <form onSubmit={handleSubmit(onSubmitModal3)}>
              <ModalBody>
                <Box height="280px" width="100%">
                  <FormControl isInvalid={errors.firstName}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="First Name"
                      backgroundColor="#ebe9e9"
                      {...register("firstName", {
                        required: "This field is required",
                      })}
                      id="firstName"
                      name="firstName"
                      value={formData2.firstName}
                      onChange={handleInput}
                    />
                    <FormErrorMessage>
                      {errors.firstName && errors.firstName.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.lastName}>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      backgroundColor="#ebe9e9"
                      mt="25px"
                      mb="25px"
                      {...register("lastName", {
                        required: "This field is required",
                      })}
                      id="lastName"
                      name="lastName"
                      value={formData2.lastName}
                      onChange={handleInput}
                    />
                    <FormErrorMessage>
                      {errors.lastName && errors.lastName.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.day && errors.month && errors.year}
                  >
                    <FormLabel>Date of Birth</FormLabel>
                    <Box display="flex" justifyContent="space-between">
                      <Select
                        placeholder="Day"
                        bg="#ebe9e9"
                        marginRight="15px"
                        {...register("day", {
                          required: "This field is required",
                        })}
                        name="day"
                        value={formData2.day}
                        onChange={handleInput}
                      >
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
                        {...register("month", {
                          required: "This field is required",
                        })}
                        name="month"
                        value={formData2.month}
                        onChange={handleInput}
                      >
                        {monthsOptions.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </Select>

                      <Select
                        placeholder="Year"
                        bg="#ebe9e9"
                        {...register("year", {
                          required: "This field is required",
                        })}
                        name="year"
                        value={formData2.year}
                        onChange={handleInput}
                      >
                        {yearsOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                    </Box>
                    <FormErrorMessage>
                      {errors.day &&
                        errors.month &&
                        errors.year &&
                        errors.day.message &&
                        errors.month.message &&
                        errors.year.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </ModalBody>

              <ModalFooter display="flex" justifyContent="center">
                <Button
                  type="submit"
                  bg="#D40000"
                  width="40%"
                  borderRadius="20px"
                  color="#fff"
                  _hover={{
                    bg: "#D40000",
                    color: "#fff",
                  }}
                >
                  Continue
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {step === 4 && (
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent h="460px" width="90vw">
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
              <Text
                fontSize="10px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                An active email ID & phone no.
                <br />
                are required to sequre your profile
              </Text>
            </Box>

            <IconButton
              aria-label="Back"
              icon={<ArrowBackIcon />}
              width="5%"
              position="relative"
              left="5%"
              bottom="15%"
              onClick={handleBack}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Box height="100%" width="100%">
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>Email ID</FormLabel>
                    <Input
                      type="email"
                      placeholder="Email ID"
                      backgroundColor="#ebe9e9"
                      mb="10px"
                      {...register("email", {
                        required: "This field is required",
                      })}
                      id="inp-1"
                      name="email"
                      value={formData2.email}
                      onChange={(e) => handleInput(e)}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Box position="relative" display="flex" width="100%">
                      <Input
                        type={passwordInputType}
                        placeholder="Password"
                        backgroundColor="#ebe9e9"
                        mb="10px"
                        {...register("password", {
                          required: "This field is required",
                        })}
                        id="inp-2"
                        name="password"
                        value={formData2.password}
                        onChange={(e) => handleInput(e)}
                      />
                      <Box
                        display="flex"
                        alignItems="center"
                        height="40px"
                        width="20px"
                        borderRadius="5px"
                        backgroundColor="#ebe9e9"
                      >
                        {ToggleIcon}
                      </Box>
                    </Box>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors.countryPhoneCode && errors.phoneNumber}
                  >
                    <FormLabel>Phone No</FormLabel>
                    <Box display="flex" justifyContent="space-between">
                      <Select
                        placeholder="Select"
                        mr="20px"
                        width="40%"
                        {...register("countryPhoneCode", {
                          required: "Please select a value",
                        })}
                        name="countryPhoneCode"
                        value={formData2.countryPhoneCode}
                        onChange={handleInput}
                      >
                        {countryCodes.map(({ code, label }) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="tel"
                        placeholder="Phone No"
                        backgroundColor="#ebe9e9"
                        mb="10px"
                        {...register("phoneNumber", {
                          required: "This field is required",
                        })}
                        id="inp-3"
                        name="phoneNumber"
                        value={formData2.phoneNumber}
                        onChange={(e) => handleInput(e)}
                      />
                    </Box>
                    <FormErrorMessage>
                      {errors.countryPhoneCode &&
                        errors.phoneNumber &&
                        errors.countryPhoneCode.message &&
                        errors.phoneNumber.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="10px"
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
                  type="submit"
                  bg="#D40000"
                  width="40%"
                  borderRadius="20px"
                  color="#fff"
                  _hover={{
                    bg: "#D40000",
                    color: "#fff",
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Middlebar;

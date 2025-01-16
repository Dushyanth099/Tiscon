import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";

import wave from "./img/wavev.png";
import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Spinner,
  useToast,
} from "@chakra-ui/react";

const ProfileScreen = ({ history }) => {
  const [activeSection, setActiveSection] = useState("personal"); // 'personal', 'address', 'orders'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMylist = useSelector((state) => state.orderMylist);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMylist;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address || {});
      }
    }
  }, [dispatch, history, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (currentPassword !== confirmPassword) {
      setMessage("null");
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          currentPassword,
          address,
        })
      );
      setMessage(null);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const renderPersonalDetails = () => (
    <VStack as="form" onSubmit={submitHandler} spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Current Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel>Confirm New Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="teal" type="submit">
        Update
      </Button>
    </VStack>
  );
  const fieldOrder = [
    "doorNo",
    "street",
    "nearestLandmark",
    "city",
    "state",
    "pin",
    "phoneNumber",
  ];

  const renderAddressDetails = () => (
    <VStack spacing={4} align="stretch">
      {fieldOrder.map((field) => (
        <FormControl key={field}>
          <FormLabel>
            {field.replace(/([A-Z])/g, " $1").toUpperCase()}
          </FormLabel>
          <Input
            value={address[field]}
            placeholder={`Enter ${field}`}
            onChange={(e) =>
              setAddress({ ...address, [field]: e.target.value })
            }
          />
        </FormControl>
      ))}
      <Button colorScheme="teal" onClick={submitHandler}>
        Update Address
      </Button>
    </VStack>
  );

  const renderOrders = () => (
    <Box overflowX="auto">
      {loadingOrders ? (
        <Spinner />
      ) : errorOrders ? (
        <Alert status="error">
          <AlertIcon />
          {errorOrders}
        </Alert>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>DATE</Th>
              <Th>TOTAL</Th>
              <Th>PAID</Th>
              <Th>DELIVERED</Th>
              <Th>DETAILS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.createdAt.substring(0, 10)}</Td>
                <Td>${order.totalPrice}</Td>
                <Td>{order.isPaid ? "Yes" : "No"}</Td>
                <Td>{order.isDelivered ? "Yes" : "No"}</Td>
                <Td>
                  <Link to={`/order/${order._id}`}>
                    <Button size="sm" colorScheme="blue">
                      Details
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  return (
    <Box
      mt={20}
      position="relative"
      bgImage={`url(${wave})`}
      bgRepeat="no-repeat"
      bgSize="cover"
      bgPos="top"
      minH="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Box maxW="600px" mx="auto" p={6} bg="gray.50" rounded="lg" shadow="md">
        <HStack spacing={4} mb={6}>
          <Button
            colorScheme={activeSection === "personal" ? "teal" : "gray"}
            onClick={() => setActiveSection("personal")}
          >
            Personal Details
          </Button>
          <Button
            colorScheme={activeSection === "address" ? "teal" : "gray"}
            onClick={() => setActiveSection("address")}
          >
            Address
          </Button>
          <Button
            colorScheme={activeSection === "orders" ? "teal" : "gray"}
            onClick={() => setActiveSection("orders")}
          >
            Orders
          </Button>
        </HStack>

        {activeSection === "personal" && renderPersonalDetails()}
        {activeSection === "address" && renderAddressDetails()}
        {activeSection === "orders" && renderOrders()}
      </Box>
    </Box>
  );
};

export default ProfileScreen;

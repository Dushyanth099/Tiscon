import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import {
  Box,
  Flex,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  List,
  ListItem,
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
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaBars } from "react-icons/fa";
const ProfileScreen = ({ history }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [address, setAddress] = useState({});
  const [profilePicture, setProfilePicture] = useState(null); // ✅ Updated to handle image
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address || {});
        setProfilePicture(user.profilePicture || null);
      }
    }
  }, [dispatch, navigate, userInfo, user]);

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // ✅ Convert form fields to `FormData`
  const submitHandler = (e) => {
    e.preventDefault();

    if (currentPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("currentPassword", currentPassword);
    formData.append("confirmPassword", confirmPassword);
    formData.append("address", JSON.stringify(address)); // ✅ Convert object to string
    if (profilePicture) {
      formData.append("profilePicture", profilePicture); // ✅ Append file
    }

    dispatch(updateUserProfile(formData));

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };
  // 🟢 Sidebar Menu Options
  const menuOptions = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "addresses", label: "Addresses", icon: FaMapMarkerAlt },
    { id: "orders", label: "My Orders", icon: FaShoppingBag },
  ];

  const renderProfile = () => (
    <Box
      maxWidth="600px"
      width="100%"
      mx="auto"
      p={6}
      border="1px solid gray"
      borderRadius="10px"
      bg="white"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <VStack as="form" onSubmit={submitHandler} spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Profile Photo</FormLabel>

          {/* ✅ Display saved profile picture or preview new upload */}
          {profilePicture ? (
            <Box boxSize="150px" overflow="hidden" borderRadius="full">
              <img
                src={
                  typeof profilePicture === "string"
                    ? profilePicture // ✅ Show saved profile picture from backend
                    : URL.createObjectURL(profilePicture) // ✅ Show preview of selected image
                }
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ) : (
            <Box
              boxSize="150px"
              borderRadius="full"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.500">No Image</Text>
            </Box>
          )}

          <Input type="file" accept="image/*" onChange={handleImageChange} />
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
    </Box>
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

  const renderAddresses = () => (
    <Box
      maxWidth="600px"
      width="100%"
      mx="auto"
      p={6}
      border="1px solid gray"
      borderRadius="10px"
      bg="white"
      boxShadow="sm"
    >
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
    </Box>
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
  // 🟢 Content Switcher
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "addresses":
        return renderAddresses();
      case "orders":
        return renderOrders();
      default:
        return null;
    }
  };
  return (
    <Box mt={20} width="100vw" bg="gray.100">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      {/* 🟢 Sidebar & Content Layout */}
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        {/* LEFT SIDE - MENU */}
        <Box
          width={{ base: "100%", md: "250px" }}
          bg="white"
          p={4}
          rounded="lg"
          shadow="sm"
        >
          {/* Mobile Dropdown */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaBars />}
              display={{ base: "block", md: "none" }}
              width="100%"
              mb={4}
            >
              Menu
            </MenuButton>
            <MenuList>
              {menuOptions.map((menu) => (
                <MenuItem
                  key={menu.id}
                  onClick={() => setActiveSection(menu.id)}
                >
                  <Icon as={menu.icon} mr={2} />
                  {menu.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Desktop Sidebar */}
          <List spacing={3} display={{ base: "none", md: "block" }}>
            {menuOptions.map((menu) => (
              <ListItem key={menu.id}>
                <Button
                  width="100%"
                  leftIcon={<Icon as={menu.icon} />}
                  colorScheme={activeSection === menu.id ? "teal" : "gray"}
                  onClick={() => setActiveSection(menu.id)}
                >
                  {menu.label}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* RIGHT SIDE - CONTENT */}
        <Box flex="1" p={4} bg="white" rounded="lg" shadow="sm" height="100vh">
          {renderContent()}
        </Box>
      </Flex>
    </Box>
  );
};

export default ProfileScreen;

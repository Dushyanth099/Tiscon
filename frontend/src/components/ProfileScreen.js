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
import { FaSignOutAlt } from "react-icons/fa";
import {
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaBars,
  FaCamera,
} from "react-icons/fa";

import Trust from "../components/Trustdetails/Trust";

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
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
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
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
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
    {
      id: "about",
      label: "About",
      path: "/About",
    },
    {
      id: "contactus",
      label: "Contactus",
      path: "/Contactus",
    },

    {
      id: "Terms and conditions",
      label: "Terms and Conditions",
      path: "/_blank ",
    },
    {
      id: "Privacy policy",
      label: "Privacy policy",
      path: "/_blank",
    },
    {
      id: "Return policy",
      label: "Return policy",
      path: "/_blank",
    },
    {
      id: "logout",
      label: "Logout",
      icon: FaSignOutAlt,
      onClick: handleLogout,
    },
  ];

  const renderProfile = () => (
    <Box mx="auto" p={10} justifyContent="center" alignItems="center">
      <VStack as="form" onSubmit={submitHandler} spacing={4}>
        <FormControl>
          <Box
            position="relative"
            boxSize="130px"
            borderRadius="full"
            overflow="hidden"
            mx="auto"
          >
            <img
              src={
                typeof profilePicture === "string"
                  ? profilePicture
                  : profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : "https://via.placeholder.com/150" // Default placeholder
              }
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* ✅ Upload Icon Overlay */}
            <Box
              position="absolute"
              bottom={2}
              right={2}
              bg="blackAlpha.700"
              p={2}
              borderRadius="full"
              cursor="pointer"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <Icon as={FaCamera} color="white" boxSize={5} />
            </Box>

            {/* ✅ Hidden File Input */}
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>
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
        <Button bg="black" color="white" type="submit" w="full">
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
    <Box mx="auto" p={6}>
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
        <Button bg="black" color="white" onClick={submitHandler}>
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
              <Th>Product</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) =>
              order.orderItems.map((item) => (
                <Tr key={item._id}>
                  {/* Product Image */}
                  <Td>
                    <img
                      src={item.product.images[0]}
                      alt={item.name}
                      width="50"
                      height="50"
                      style={{ borderRadius: "5px" }}
                    />
                  </Td>
                  {/* Product Name */}
                  <Td>{item.name}</Td>
                  {/* Product Price */}
                  <Td>${item.price.toFixed(2)}</Td>
                  {/* Details Button */}
                  <Td>
                    <Link to={`/order/${order._id}`}>
                      <Button size="sm" color="white" bg="black">
                        Details
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              ))
            )}
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
    <Box mt={20} bg="white">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      {/* 🟢 Sidebar & Content Layout */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        justify="center" // ✅ Centers content horizontally
        align="start" // ✅ Aligns sidebar and content to the top
        mx="auto"
        maxW="1000px" // ✅ Adjusts max width for proper alignment
        w="full"
        p={5}
      >
        {/* LEFT SIDE - MENU */}
        <Box
          bg="white"
          p={4}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          minW="250px"
          h="fit-content"
        >
          {/* Desktop Sidebar */}
          <List spacing={3}>
            {menuOptions.map((menu) => (
              <ListItem key={menu.id}>
                <Link to={menu.path} style={{ textDecoration: "none" }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "gray.200" }}
                    cursor="pointer"
                    color={activeSection === menu.id ? "teal.500" : "gray.700"}
                    onClick={() => setActiveSection(menu.id)}
                  >
                    {menu.icon && <Icon as={menu.icon} boxSize={5} />}
                    <Text fontSize="lg" fontWeight="600">
                      {menu.label}
                    </Text>
                  </HStack>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* RIGHT SIDE - CONTENT */}
        <Box
          p={6}
          bg="white"
          rounded="lg"
          shadow="sm"
          border="1px solid"
          borderColor="gray.300"
          flex="1" // ✅ Allows content to take remaining space
          maxW="600px"
          h="585px" // ✅ Fixed height for right-side box
          overflow="hidden"
        >
          <Box
            h="100%"
            overflowY="auto" // ✅ Only inner content will scroll
            pr={2} // ✅ Adds a little space for scrollbar
          >
            {renderContent()}
          </Box>
        </Box>
      </Flex>
      <Trust />
    </Box>
  );
};

export default ProfileScreen;

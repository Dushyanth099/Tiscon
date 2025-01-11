import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Button, HStack, Link } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";

const DeliveryNavbar = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logout());
    }
  };

  return (
    <Box as="nav" bg="teal.500" px={4} py={3} color="white">
      <Flex align="center" justifyContent="space-between">
        {/* Navbar Logo */}
        <Box fontWeight="bold" fontSize="lg">
          <Link
            as={RouterLink}
            to="/deliveryhomepage"
            _hover={{ textDecoration: "none" }}
            color="white"
          >
            DeliveryApp
          </Link>
        </Box>

        {/* Navbar Links */}
        <HStack spacing={6}  ms={9}>
          <Link
            as={RouterLink}
            to="/deliveryhomepage"
            _hover={{ textDecoration: "none" }}
            color="white"
          >
            Home
          </Link>
          <Link
            as={RouterLink}
            to="/delivery-dashboard"
            _hover={{ textDecoration: "none" }}
            color="white"
          >
            Orders
          </Link>
          <Link
            as={RouterLink}
            to="/profile"
            _hover={{ textDecoration: "none" }}
            color="white"
          >
            Profile
          </Link>
          <Button
            onClick={logoutHandler}
            variant="outline"
            colorScheme="whiteAlpha"
            size="sm"
          >
            Logout
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default DeliveryNavbar;

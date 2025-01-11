import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Button, HStack, Link } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";

const AdminNavbar = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      dispatch(logout());
    }
  };

  return (
    <Box
      as="nav"
      bg="teal.500"
      px={4}
      py={3}
      color="white"
      position="fixed"
      top={0}
      width="100%"
      zIndex={1000}
    >
      <Flex align="center" justifyContent="space-between">
        {/* Navbar Logo */}
        <Box fontWeight="bold" fontSize="lg">
          <Link
            as={RouterLink}
            to="/admin/dashboard"
            _hover={{ textDecoration: "none" }}
            color="white"
          >
            Admin Dashboard
          </Link>
        </Box>

        {/* Navbar Links */}
        <HStack spacing={6} ms={9}>
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

export default AdminNavbar;

import React, { useState } from "react";
import { Box, Grid, GridItem, Button, VStack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <>
      {/* Admin Navbar */}
      <AdminNavbar />
      <Box  display="flex">
        {/* Sidebar */}
        <Box
          bg="gray.200"
          p={4}
          minW="250px"
          height="100vh"
          position="fixed"
          top="60px"
        >
          <VStack spacing={4} align="stretch">
            <Button
              onClick={() => setActiveTab("users")}
              as={RouterLink}
              to="/admin/userlist"
              colorScheme={activeTab === "users" ? "teal" : "gray"}
              variant="ghost"
            >
              Users
            </Button>
            <Button
              onClick={() => setActiveTab("orders")}
              as={RouterLink}
              to="/admin/orderlist"
              colorScheme={activeTab === "orders" ? "teal" : "gray"}
              variant="ghost"
            >
              Orders List
            </Button>
            <Button
              onClick={() => setActiveTab("products")}
              as={RouterLink}
              to="/admin/productlist"
              colorScheme={activeTab === "products" ? "teal" : "gray"}
              variant="ghost"
            >
              Product List
            </Button>
            <Button
              onClick={() => setActiveTab("sales")}
              as={RouterLink}
              to="/admin/dashboard"
              colorScheme={activeTab === "sales" ? "teal" : "gray"}
              variant="ghost"
            >
              Sales Report
            </Button>
            <Button
              onClick={() => setActiveTab("shop")}
              as={RouterLink}
              to="/shop"
              colorScheme={activeTab === "shop" ? "teal" : "gray"}
              variant="ghost"
            >
              Shop Page
            </Button>
            <Button
              onClick={() => setActiveTab("banner")}
              as={RouterLink}
              to="/adminbanner"
              colorScheme={activeTab === "banner" ? "teal" : "gray"}
              variant="ghost"
            >
              BannerPage
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box ml="250px" p={6} width="full">
          <Grid templateColumns="repeat(1, 1fr)" gap={6}>
            <GridItem>{children}</GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout;

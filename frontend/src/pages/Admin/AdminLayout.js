import React, { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  VStack,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isBannersOpen, setIsBannersOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  return (
    <>
      {/* Admin Navbar */}
      <AdminNavbar />
      <Box display="flex">
        {/* Sidebar */}
        <Box
          bg="#073b74"
          p={4}
          color="white"
          width={isSidebarOpen ? "280px" : "60px"}
          height="100vh"
          position="fixed"
          top="56px"
          transition="width 0.3s ease-in-out"
          overflow="hidden"
        >
          <VStack spacing={4} align="stretch" fontSize="md">
            {/* Toggle Sidebar Button */}
            <IconButton
              icon={
                isSidebarOpen ? (
                  <ArrowLeftIcon boxSize={6} color="white" />
                ) : (
                  <ArrowRightIcon boxSize={6} color="white" />
                )
              }
              bg="transparent"
              _hover={{ bg: "gray.700" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            />

            {isSidebarOpen && (
              <>
                <Button
                  onClick={() => setActiveTab("home")}
                  as={RouterLink}
                  to="/adminDashboard"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🏠 Home
                </Button>
                <Button
                  onClick={() => setActiveTab("users")}
                  as={RouterLink}
                  to="/admin/userlist"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  colorScheme={activeTab === "users" ? "teal" : "gray"}
                  variant="ghost"
                  fontSize="md"
                >
                  🧑‍💼 Users
                </Button>
                {/* Orders Dropdown */}

                <Button
                  onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isOrdersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                  fontSize="md"
                >
                  📦Orders
                </Button>
                <Collapse in={isOrdersOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      as={RouterLink}
                      to="/admin/orderlist"
                      bg="transparent"
                      color="white"
                      justifyContent="flex-start"
                      variant="ghost"
                      leftIcon="•"
                      fontSize="md"
                    >
                      Orders Page
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/admin/assignorders"
                      bg="transparent"
                      color="white"
                      justifyContent="flex-start"
                      variant="ghost"
                      leftIcon="•"
                      fontSize="md"
                    >
                      Assign Orders
                    </Button>
                  </VStack>
                </Collapse>
                {/* Products Dropdown */}
                <Button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isProductsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                >
                  🏷️ Products
                </Button>
                <Collapse in={isProductsOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      as={RouterLink}
                      to="/admin/productlist"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "gray.700" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Product List
                    </Button>

                    <Button
                      as={RouterLink}
                      to="/admin/product/create"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "gray.700" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Create Product
                    </Button>

                    <Button
                      as={RouterLink}
                      to="/admin/bulkupload"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "gray.700" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/productsoverview"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "gray.700" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Product Overview
                    </Button>
                  </VStack>
                </Collapse>

                <Button
                  onClick={() => setActiveTab("incomestats")}
                  as={RouterLink}
                  to="/admin/incomebycity"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  variant="ghost"
                  fontSize="md"
                >
                  📈 Statistics
                </Button>
                <Button
                  onClick={() => setActiveTab("home")}
                  as={RouterLink}
                  to="/"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🛒 Shop Page
                </Button>
                {/* Banners Dropdown */}
                <Button
                  onClick={() => setIsBannersOpen(!isBannersOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isBannersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                >
                  📊 Banners
                </Button>
                <Collapse in={isBannersOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      as={RouterLink}
                      to="/adminbanner"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "gray.700" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Image Banner
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/adminvideobanner"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "gray.700" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Video Banner
                    </Button>
                  </VStack>
                </Collapse>

                <Button
                  onClick={() => setActiveTab("review")}
                  as={RouterLink}
                  to="/adminreview"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🌟 Reviews
                </Button>
                <Button
                  onClick={() => setActiveTab("transactions")}
                  as={RouterLink}
                  to="/transactions"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  💸 Transactions
                </Button>
                <Button
                  onClick={() => setActiveTab("settings")}
                  as={RouterLink}
                  to="/profile"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  variant="ghost"
                  fontSize="md"
                >
                  🔧 Settings
                </Button>
              </>
            )}
          </VStack>
        </Box>

        {/* Right Side Content */}
        <Box
          ml={isSidebarOpen ? "250px" : "60px"}
          p={6}
          height="100vh"
          width="full"
          bg={"white"}
          overflowY="auto"
          transition="margin-left 0.3s ease-in-out"
        >
          <Grid templateColumns="repeat(1, 1fr)" gap={6}>
            <GridItem>{children}</GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout;

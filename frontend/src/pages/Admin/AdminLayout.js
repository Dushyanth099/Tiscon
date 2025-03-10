import React, { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  VStack,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      {/* Admin Navbar */}
      <AdminNavbar />
      <Box display="flex">
        {/* Sidebar */}
        <Box
          bg="gray.900"
          p={4}
          color="white"
          width={isSidebarOpen ? "280px" : "60px"}
          height="100vh"
          position="fixed"
          top="56px"
          transition="width 0.3s ease-in-out"
          overflow="hidden"
        >
          <VStack spacing={4} align="stretch">
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
                  onClick={() => setActiveTab("users")}
                  as={RouterLink}
                  to="/admin/userlist"
                  bg="white"
                  color="black"
                  colorScheme={activeTab === "users" ? "teal" : "gray"}
                  variant="ghost"
                >
                  🧑‍💼 Users
                </Button>
                {/* Orders Dropdown */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg="white"
                    color="black"
                    variant="ghost"
                  >
                    📦Orders
                  </MenuButton>
                  <MenuList bg="white" borderColor="gray.300" color="black">
                    <MenuItem as={RouterLink} to="/admin/orderlist">
                      Orders Page
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/admin/assignorders">
                      Assign Orders
                    </MenuItem>
                  </MenuList>
                </Menu>
                {/* Products Dropdown */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg="white"
                    color="black"
                    variant="ghost"
                  >
                    🏷️ Products
                  </MenuButton>
                  <MenuList bg="white" borderColor="gray.300" color="black">
                    <MenuItem as={RouterLink} to="/admin/productlist">
                      Product List
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/admin/product/create">
                      Add Product
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/admin/bulkupload">
                      Bulk Upload
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/productsoverview">
                      Product Overview
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Button
                  onClick={() => setActiveTab("incomestats")}
                  as={RouterLink}
                  to="/admin/incomebycity"
                  bg="white"
                  color="black"
                  variant="ghost"
                >
                  📈 Statistics
                </Button>
                <Button
                  onClick={() => setActiveTab("home")}
                  as={RouterLink}
                  to="/"
                  bg="white"
                  color="black"
                  variant="ghost"
                >
                  🛒 Shop Page
                </Button>
                {/* Banners Dropdown */}
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="white"
                    color="black"
                    rightIcon={<ChevronDownIcon />}
                    variant="ghost"
                  >
                    📊 Banners
                  </MenuButton>
                  <MenuList bg="white" borderColor="gray.300" color="black">
                    <MenuItem as={RouterLink} to="/adminbanner">
                      Image Banner
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/adminvideobanner">
                      Video Banner
                    </MenuItem>
                  </MenuList>
                </Menu>{" "}
                <Button
                  onClick={() => setActiveTab("review")}
                  as={RouterLink}
                  to="/adminreview"
                  bg="white"
                  color="black"
                  variant="ghost"
                >
                  🌟 Reviews
                </Button>
                <Button
                  onClick={() => setActiveTab("transactions")}
                  as={RouterLink}
                  to="/transactions"
                  bg="white"
                  color="black"
                  variant="ghost"
                >
                  💸 Transactions
                </Button>
                <Button
                  onClick={() => setActiveTab("settings")}
                  as={RouterLink}
                  to="/profile"
                  bg="white"
                  color="black"
                  variant="ghost"
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

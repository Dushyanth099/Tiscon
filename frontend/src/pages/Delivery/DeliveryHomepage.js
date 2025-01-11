import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Image, Heading, Button, Link, Flex } from "@chakra-ui/react";
import deliveryimg from "../../pages/Delivery/deliveryimg.svg";

const DeliveryHomepage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      mt="50px"
      direction={{ base: "column", md: "row" }} // Stack on small screens, side-by-side on larger screens
      gap="20px"
    >
      {/* Image Section */}
      <Box flex="1" textAlign="center">
        <Link as={RouterLink} to="/delivery-dashboard">
          <Image
            src={deliveryimg}
            alt="Pick your orders"
            cursor="pointer"
            maxWidth="100%"
            height="auto"
          />
        </Link>
      </Box>

      {/* Text Section */}
      <Box flex="1" textAlign={{ base: "center", md: "left" }}>
        <Heading as="h2" size="lg" mb="20px">
          Pick Your Orders
        </Heading>
        <Link as={RouterLink} to="/delivery-dashboard">
          <Button colorScheme="teal" size="md" fontSize="16px" px="20px">
            Click Here
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default DeliveryHomepage;

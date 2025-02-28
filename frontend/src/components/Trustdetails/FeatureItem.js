import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FaShieldAlt, FaStar, FaShoppingBag, FaUndo } from "react-icons/fa";

const FeaturesSection = () => {
  const features = [
    { icon: <FaShieldAlt size={28} />, text: "Secure Payments" },
    { icon: <FaStar size={28} />, text: "Genuine Product" },
    { icon: <FaShoppingBag size={28} />, text: "Try & Buy" },
    { icon: <FaUndo size={28} />, text: "7 Day Return" },
  ];

  return (
    <Flex
      justify="center"
      align="center"
      direction={{ base: "column", sm: "row", md: "row", lg: "row" }}
      gap={{ base: 6, md: 12 }}
      my={6}
    >
      {features.map((feature, index) => (
        <Flex
          key={index}
          direction="column"
          align="center"
          textAlign="center"
          w="120px" // Set a fixed width for proper alignment
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="60px"
            h="60px"
            bg="gray.100"
            borderRadius="15px"
            mb={2}
          >
            {feature.icon}
          </Box>
          <Text fontSize="14px" fontWeight="bold" whiteSpace="nowrap">
            {feature.text}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default FeaturesSection;

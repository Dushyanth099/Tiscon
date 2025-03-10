import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FaShieldAlt, FaStar, FaShoppingBag, FaUndo } from "react-icons/fa";

const FeaturesSection = () => {
  const features = [
    { icon: <FaShieldAlt size={20} />, text: "Secure" }, // Reduced icon size
    { icon: <FaStar size={20} />, text: "Genuine " },
    { icon: <FaShoppingBag size={20} />, text: "Try & Buy" },
    { icon: <FaUndo size={20} />, text: "7 Day Return" },
  ];

  return (
    <Flex my={4} gap={{ base: 4, md: 8 }}>
      {features.map((feature, index) => (
        <Flex key={index} direction="column" align="center" textAlign="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="40px" // Reduced box size
            h="40px"
            bg="gray.100"
            borderRadius="12px"
            mb={1}
          >
            {feature.icon}
          </Box>
          <Text fontSize="10px" fontWeight="semibold" whiteSpace="nowrap">
            {feature.text}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default FeaturesSection;

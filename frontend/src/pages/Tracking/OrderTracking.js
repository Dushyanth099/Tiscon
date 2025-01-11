import React from "react";
import { Box, Text, Stack, Icon, Divider } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

const OrderTracking = ({ order }) => {
  const getStatusIcon = (status) => (
    <Icon as={FaCheckCircle} color={status ? "green.500" : "gray.500"} />
  );

  return (
    <Box borderWidth={1} borderRadius="md" p={5} boxShadow="lg" mt={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={3}>
        Tracking Details
      </Text>
      <Stack spacing={3}>
        <Text>{getStatusIcon(true)} Ordered</Text>
        <Divider />
        <Text>{getStatusIcon(order.isPacked)} Packed</Text>
        <Divider />
        <Text>{getStatusIcon(order.isAcceptedByDelivery)} Shipped</Text>
        <Divider />
        <Text>{getStatusIcon(order.isDelivered)} Delivered</Text>
      </Stack>
    </Box>
  );
};

export default OrderTracking;

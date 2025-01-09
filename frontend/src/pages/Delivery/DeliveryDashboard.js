import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listOrdersForDelivery,
  acceptOrder,
  rejectOrder,
  completeOrder,
  returnOrder,
} from "../../actions/orderActions";

import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  useToast,
} from "@chakra-ui/react";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();
  const deliveryOrders = useSelector((state) => state.deliveryOrders);
  const { loading, error, orders } = deliveryOrders;
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (!userInfo || !userInfo.isDelivery) {
      history.push("/login"); // Redirect non-delivery users to login
    } else {
      dispatch(listOrdersForDelivery());
    }
  }, [dispatch, userInfo, history]);
  const handleAccept = (id) => {
    dispatch(acceptOrder(id));  toast({
      title: "Order Accepted",
      description: `Order ${id} has been successfully accepted.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReject = (id) => {
    dispatch(rejectOrder(id)); toast({
      title: "Order Rejected",
      description: `Order ${id} has been rejected.`,
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleComplete = (id) => {
    dispatch(completeOrder(id));toast({
      title: "Order Completed",
      description: `Order ${id} has been marked as completed.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReturn = (id) => {
    const reason = prompt("Enter the reason for return:");
    if (reason) {
      dispatch(returnOrder(id, reason));
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={6}>
        Delivery Dashboard
      </Heading>

      {/* Show loading spinner */}
      {loading && (
        <Box textAlign="center" mb={4}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}

      {/* Show error message */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Show orders table if no loading or error */}
      {!loading && !error && (
        <Table variant="simple" size="lg">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer</Th>
              <Th>Total</Th>
              <Th>Delivery Address</Th>
              <Th>Payment Method</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.user.name}</Td>
                <Td>${order.totalPrice}</Td>
                <Td>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </Td>
                <Td>{order.paymentMethod}</Td>
                <Td>{order.isAcceptedByDelivery ? "Accepted" : "Pending"}</Td>
                <Td>
                  {!order.isAcceptedByDelivery && (
                    <>
                      <Button
                        colorScheme="green"
                        size="sm"
                        mr={2}
                        onClick={() => handleAccept(order._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleReject(order._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {order.isAcceptedByDelivery && !order.isDelivered && (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleComplete(order._id)}
                    >
                      Complete
                    </Button>
                  )}
                  {order.isDelivered && (
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => handleReturn(order._id)}
                    >
                      Return
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default DeliveryDashboard;

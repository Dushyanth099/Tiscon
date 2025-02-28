import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Spinner,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { listOrders,  } from "../../actions/orderActions";

const AssignOrderScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Fetch orders
  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;

  
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <Box p={8} maxW="1200px" mx="auto" mt="8">
      <h1 className="titlepanel">Assign orders</h1>

      {loadingOrders ? (
        <Box textAlign="center" mb={8}>
          <Spinner size="xl" color="teal.500" />
        </Box>
      ) : errorOrders ? (
        <Alert status="error" mb={8} borderRadius="md">
          <AlertIcon />
          <AlertTitle>Error loading orders.</AlertTitle>
          <AlertDescription>{errorOrders}</AlertDescription>
        </Alert>
      ) : (
        <Table variant="striped" colorScheme="teal" size="md">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Total Price</Th>
              <Th>Payment Status</Th>
              <Th>Shipping Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>Rs.{order.totalPrice}</Td>
                <Td>{order.isPaid ? "Paid" : "Not Paid"}</Td>
                <Td>{order.isDelivered ? "Delivered" : "Pending"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AssignOrderScreen;
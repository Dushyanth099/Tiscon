import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  Heading,
} from "@chakra-ui/react";
import { ListUsers } from "../../actions/userActions";
import { assignOrder, listOrders } from "../../actions/orderActions";


const AssignOrderScreen = () => {
  const dispatch = useDispatch();

  // Fetch orders
  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;

  // Fetch delivery persons
  const userList = useSelector((state) => state.userList);
  const { loading: loadingUsers, error: errorUsers, users } = userList;

  // Assign order
  const orderAssign = useSelector((state) => state.orderAssign);
  const {
    loading: loadingAssign,
    success: successAssign,
    error: errorAssign,
  } = orderAssign;

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedDeliveryPersonId, setSelectedDeliveryPersonId] = useState("");

  useEffect(() => {
    dispatch(listOrders());
    dispatch(ListUsers());
  }, [dispatch, successAssign]);

  const handleAssignOrder = () => {
    if (selectedOrderId && selectedDeliveryPersonId) {
      dispatch(assignOrder(selectedOrderId, selectedDeliveryPersonId));
    }
  };

  return (
      <Box p={4}>
        <Heading as="h1" size="lg" mb={6}>
          Assign Orders
        </Heading>

        {(loadingOrders || loadingUsers) && (
          <Box textAlign="center" mb={4}>
            <Spinner size="xl" />
          </Box>
        )}

        {(errorOrders || errorUsers) && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorOrders || errorUsers}
          </Alert>
        )}

        {!loadingOrders && !loadingUsers && (
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Orders
            </Heading>
            <Select
              placeholder="Select an Order"
              onChange={(e) => setSelectedOrderId(e.target.value)}
              value={selectedOrderId}
              mb={4}
            >
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order._id} - ${order.totalPrice}
                </option>
              ))}
            </Select>

            <Heading as="h2" size="md" mb={2}>
              Delivery Persons
            </Heading>
            <Select
              placeholder="Select a Delivery Person"
              onChange={(e) => setSelectedDeliveryPersonId(e.target.value)}
              value={selectedDeliveryPersonId}
              mb={4}
            >
              {users
                .filter((user) => user.isDelivery)
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </Select>

            <Button
              colorScheme="blue"
              onClick={handleAssignOrder}
              isLoading={loadingAssign}
              mb={4}
            >
              Assign Order
            </Button>

            {successAssign && (
              <Alert status="success" mb={4}>
                <AlertIcon />
                Order assigned successfully!
              </Alert>
            )}
            {errorAssign && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {errorAssign}
              </Alert>
            )}
          </Box>
        )}
      </Box>
  );
};

export default AssignOrderScreen;

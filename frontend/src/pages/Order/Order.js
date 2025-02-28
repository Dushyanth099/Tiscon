import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { IoMdDoneAll } from "react-icons/io";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../../actions/orderActions";
import "./Order.css";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../../constants/orderConstants";
import { Button } from "@chakra-ui/button";
import OrderTracking from "../Tracking/OrderTracking";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Stack,
  Badge,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  if (!loading) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (!order || successDeliver || order._id !== orderId) {
      dispatch({
        type: ORDER_DELIVER_RESET,
      });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, navigate, order, successDeliver, userInfo]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} minH="100vh" py={10}>
      <Helmet>
        <title>Order Details</title>
      </Helmet>

      {loading || loadingDeliver ? (
        <VStack justify="center" minH="80vh">
          <Spinner size="xl" />
        </VStack>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box maxW="1200px" mx="auto" p={6}>
          <Stack direction={{ base: "column", md: "row" }} spacing={6}>
            {/* Left Side - Order Info */}
            <VStack
              flex="2"
              bg="white"
              p={6}
              borderRadius="md"
              boxShadow="lg"
              align="stretch"
            >
              <Text fontSize="2xl" fontWeight="bold">
                Shipping Information
              </Text>
              <Divider />
              <Text>
                <strong>Name:</strong> {order.user.name}
              </Text>
              <Text>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </Text>
              <Text>
                <strong>Address:</strong> {order.shippingAddress.doorNo},{" "}
                {order.shippingAddress.street},
                {order.shippingAddress.nearestLandmark},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pin}, {order.shippingAddress.country}
                {order.shippingAddress.phoneNumber}
              </Text>
              <Text>
                {order.isDelivered ? (
                  <Badge colorScheme="green">
                    Delivered at {order.deliveredAt}
                  </Badge>
                ) : (
                  <Badge colorScheme="red">Not Delivered</Badge>
                )}
              </Text>

              <Text fontSize="2xl" fontWeight="bold" mt={4}>
                Payment Method
              </Text>
              <Divider />
              <Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Text>
              <Text>
                {order.isPaid ? (
                  <Badge colorScheme="green">Paid at {order.paidAt}</Badge>
                ) : (
                  <Badge colorScheme="red">Not Paid</Badge>
                )}
              </Text>

              <Text fontSize="2xl" fontWeight="bold" mt={4}>
                Order Items
              </Text>
              <Divider />
              {order.orderItems.map((item) => (
                <HStack key={item.product} justify="space-between">
                  <Text>
                    <Link
                      to={`/product/${item.product}`}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {item.name}
                    </Link>
                  </Text>
                  <Text>
                    {item.qty} x Rs. {item.price} = Rs. {item.qty * item.price}
                  </Text>
                </HStack>
              ))}

              <OrderTracking order={order} />
            </VStack>

            {/* Right Side - Order Summary */}
            <VStack flex="1" bg="white" p={6} borderRadius="md" boxShadow="lg">
              <Text fontSize="xl" fontWeight="bold" color="gray.600">
                Order ID:{" "}
                <Text as="span" color="blue.500">
                  {order._id}
                </Text>
              </Text>
              <Divider />

              <Text fontSize="2xl" fontWeight="bold">
                Order Summary
              </Text>
              <Divider />

              <HStack justify="space-between" w="full">
                <Text>Items:</Text>
                <Text fontWeight="bold">Rs. {order.itemsPrice}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Shipping:</Text>
                <Text fontWeight="bold">Rs. {order.shippingPrice}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Tax:</Text>
                <Text fontWeight="bold">Rs. {order.taxPrice}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  Rs. {order.totalPrice}
                </Text>
              </HStack>

              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <Button
                  colorScheme="blue"
                  onClick={deliverHandler}
                  leftIcon={<IoMdDoneAll size="16" />}
                >
                  Mark as Delivered
                </Button>
              )}
            </VStack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Order;

import React, { useEffect, useState } from "react";
import { listOrders } from "../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import { Helmet } from "react-helmet";
import "./orders.css";
import {
  Heading,
  Button,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Box,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

const Orders = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo?.isAdmin]);
  const handleInvoiceClick = (orderId) => {
    navigate(`/admin/order/${orderId}/invoice`);
  };

  const getOrderStatus = (order) => {
    if (order.isReturned) {
      return { label: "Returned", color: "red" };
    } else if (order.isDelivered) {
      return { label: "Delivered", color: "green" };
    } else if (order.isAcceptedByDelivery) {
      return { label: "Shipped", color: "blue" };
    } else if (order.isPacked) {
      return { label: "Packed", color: "orange" };
    } else {
      return { label: "Ordered", color: "gray" };
    }
  };
  // Handle Date Change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter orders based on selected date
  const filteredOrders = selectedDate
    ? orders.filter(
        (order) => order.createdAt.substring(0, 10) === selectedDate
      )
    : orders;
  return (
    <div className="Users">
      <h1 className="titlepanel"> Orders</h1>
      {loading ? (
        <div className="loading">
          <HashLoader color={"#1e1e2c"} loading={loading} size={40} />
        </div>
      ) : error ? (
        <h1>error</h1>
      ) : (
        <>
          <Dashboard />
          <div className="title-container">
            <Heading as="h3" size="md" mb={3} textAlign={"center"}>
              All Orders
            </Heading>
          </div>
          <Box mb={4} display="flex" alignItems="center" gap={4}>
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              width="200px"
              placeholder="Select Date"
              bg="white"
            />
          </Box>
          <Box overflowX="auto">
            <Table className="tableusers" variant="striped" mb={18}>
              <Thead>
                <Tr>
                  <Th textAlign="center">ID</Th>
                  <Th textAlign="center">User</Th>
                  <Th textAlign="center">Date</Th>
                  <Th textAlign="center">TOTAL</Th>
                  <Th textAlign="center">PAID</Th>
                  <Th textAlign="center">Status</Th>
                  {/* <Th textAlign="center">Deliverd</Th> */}
                  <Th textAlign="center">ProductImage</Th>
                  <Th textAlign="center">Order Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const status = getOrderStatus(order);
                    return (
                      <Tr key={order._id}>
                        <Td>{order._id}</Td>
                        <Td>{order.user && order.user.name}</Td>
                        <Td>{order.createdAt.substring(0, 10)}</Td>
                        <Td>{order.totalPrice}</Td>

                        <Td>
                          {order.isPaid ? (
                            <div className="paid">
                              {order.paidAt?.substring(0, 10)}
                            </div>
                          ) : (
                            <div className="notpaid">NO</div>
                          )}
                        </Td>
                        {/* <Td>
                        {order.isDelivered ? (
                          <div className="paid">
                            {order.deliveredAt.substring(0, 10)}
                          </div>
                        ) : (
                          <div className="notpaid">NO</div>
                        )}
                      </Td> */}
                        {/* Order Status Button */}
                        <Td textAlign="center">
                          <Button
                            size="sm"
                            colorScheme={status.color}
                            borderRadius="20px"
                            fontWeight="bold"
                            textTransform="uppercase"
                            px={4}
                            py={1}
                          >
                            {status.label}
                          </Button>
                        </Td>
                        {/* Display Product Images */}
                        <Td>
                          {order.orderItems.map((item) => (
                            <Stack key={item._id} spacing={2} align="center">
                              {/* Display the first image from the images array */}
                              {item.product &&
                                item.product.images &&
                                item.product.images.length > 0 && (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.brandname}
                                    boxSize="80px"
                                    objectFit="cover"
                                    borderRadius="5px"
                                  />
                                )}
                              {/* Product Link */}
                              <Link to={`/product/${item.product._id}`}>
                                <Button colorScheme="blue" size="xs">
                                  View Product
                                </Button>
                              </Link>
                            </Stack>
                          ))}
                        </Td>
                        <Td>
                          <Stack>
                            <Link to={`/order/${order._id}`}>
                              <Button
                                leftIcon={<AiOutlineEdit size="16" />}
                                colorScheme="blue"
                                size="xs"
                              >
                                Details
                              </Button>
                            </Link>
                            <Button
                              colorScheme="teal"
                              size="xs"
                              onClick={() => handleInvoiceClick(order._id)}
                            >
                              Invoice
                            </Button>
                          </Stack>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan="8" textAlign="center">
                      No orders found for the selected date.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </div>
  );
};

export default Orders;

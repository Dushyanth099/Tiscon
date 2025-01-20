import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Text,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Alert,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import {
  getSalesData,
  getRevenueData,
  getDashboardOrders,
  getTotalOrders,
} from "../../actions/dashboardActions";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux states
  const salesDataState = useSelector((state) => state.sales);
  const { loading: loadingSales, sales, error: errorSales } = salesDataState;

  const revenueDataState = useSelector((state) => state.revenue);
  const {
    loading: loadingRevenue,
    revenue,
    error: errorRevenue,
  } = revenueDataState;
  const totalOrdersState = useSelector((state) => state.totalOrders);
  const {
    loading: loadingTotalOrders,
    totalOrders,
    error: errortotalOrders,
  } = totalOrdersState;
  const ordersDataState = useSelector((state) => state.orders);
  const {
    loading: loadingOrders,
    orders,
    error: errorOrders,
  } = ordersDataState;

  const [filter, setFilter] = React.useState("Day"); // Default filter

  // Calculate totals
  const totalOrdersCount = totalOrders || 0;
  const totalSales = sales?.reduce((acc, item) => acc + item.value, 0) || 0;
  const totalRevenue = revenue?.reduce((acc, item) => acc + item.value, 0) || 0;

  // Fetch dashboard data
  useEffect(() => {
    dispatch(getSalesData(filter));
    dispatch(getRevenueData(filter));
    dispatch(getTotalOrders(filter));
    dispatch(getDashboardOrders());
  }, [dispatch, filter]);

  // Format chart data
  const formatChartData = (data) =>
    data?.map((item) => ({
      name: item.label,
      value: item.value,
    }));

  return (
    <Box p={5}>
      <Heading mb={5}>Dashboard</Heading>

      {/* Key Metrics */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={10}>
        <GridItem>
          <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
            <StatLabel>Total Orders</StatLabel>
            <StatNumber>{totalOrdersCount}</StatNumber>
            <StatHelpText>Across all time</StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat p={5} bg="green.50" borderRadius="md" shadow="sm">
            <StatLabel>Total Sales</StatLabel>
            <StatNumber>{totalSales} Nos</StatNumber>
            <StatHelpText>Across all time</StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat p={5} bg="purple.50" borderRadius="md" shadow="sm">
            <StatLabel>Total Revenue</StatLabel>
            <StatNumber>Rs. {totalRevenue.toFixed(2)}</StatNumber>
            <StatHelpText>Across all time</StatHelpText>
          </Stat>
        </GridItem>
      </Grid>

      {/* Filter Dropdown */}
      <Box mb={8}>
        <Select
          placeholder="UptoDate"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          mb={5}
          maxW="300px"
        >
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </Select>
      </Box>

      {/* Charts and Tables */}
      {loadingSales || loadingRevenue || loadingOrders || loadingTotalOrders ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
        </Box>
      ) : errorSales || errorRevenue || errorOrders || errortotalOrders ? (
        <Alert status="error" mt={4}>
          {errorSales || errorRevenue || errorOrders || errortotalOrders}
        </Alert>
      ) : (
        <Box>
          {/* Charts Section */}
          <Grid templateColumns="repeat(2, 1fr)" gap={10} mb={10}>
            <GridItem>
              <Heading as="h3" size="md" mb={3}>
                Sales Data
              </Heading>
              <LineChart
                width={500}
                height={300}
                data={formatChartData(sales)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </GridItem>
            <GridItem>
              <Heading as="h3" size="md" mb={3}>
                Revenue Data
              </Heading>
              <LineChart
                width={500}
                height={300}
                data={formatChartData(revenue)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </GridItem>
          </Grid>

          {/* Latest Orders Table */}
          <Box>
            <Heading as="h3" size="md" mb={3}>
              Latest Orders
            </Heading>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Customer</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Order Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders?.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order._id}</Td>
                    <Td>{order.customerName}</Td>
                    <Td>${order.total}</Td>
                    <Td>{order.status}</Td>
                    <Td>
                      <Link to={`/order/${order._id}`}>
                        <Button colorScheme="teal" size="sm">
                          Details
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

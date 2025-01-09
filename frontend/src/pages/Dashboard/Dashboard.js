import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Alert,
} from "@chakra-ui/react";
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

  const ordersDataState = useSelector((state) => state.orders);
  const {
    loading: loadingOrders,
    orders,
    error: errorOrders,
  } = ordersDataState;

  const [filter, setFilter] = React.useState("Day"); // Default filter

  // Fetch dashboard data
  useEffect(() => {
    dispatch(getSalesData(filter));
    dispatch(getRevenueData(filter));
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

      {/* Filter Dropdown */}
      <Select
        placeholder="Filter by"
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

      {/* Loading or Error State */}
      {loadingSales || loadingRevenue || loadingOrders ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
        </Box>
      ) : errorSales || errorRevenue || errorOrders ? (
        <Alert status="error" mt={4}>
          {errorSales || errorRevenue || errorOrders}
        </Alert>
      ) : (
        <Box>
          {/* Sales Data Chart */}
          <Heading as="h3" size="md" mb={3}>
            Sales Data
          </Heading>
          <LineChart
            width={600}
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

          {/* Revenue Data Chart */}
          <Heading as="h3" size="md" mt={10} mb={3}>
            Revenue Data
          </Heading>
          <LineChart
            width={600}
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

          {/* Latest Orders Table */}
          <Heading as="h3" size="md" mt={10} mb={3}>
            Latest Orders
          </Heading>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Customer</Th>
                <Th>Total</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>{order.customerName}</Td>
                  <Td>${order.total}</Td>
                  <Td>{order.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

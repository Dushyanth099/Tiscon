import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { Box, Text, Flex } from "@chakra-ui/react";

const UsersPieChart = () => {
  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  if (!users || users.length === 0) {
    return <Text>No user data available.</Text>;
  }

  const totalUsers = users.length;
  const usersWithOrders = users.filter(
    (user) => user.orderHistory?.length > 0
  ).length;
  const usersWithoutOrders = totalUsers - usersWithOrders;
  const adminUsers = users.filter((user) => user.isAdmin).length;
  const deliveryAgents = users.filter((user) => user.isDelivery).length;

  const data = [
    { name: "Users with Orders", value: usersWithOrders },
    { name: "Users without Orders", value: usersWithoutOrders },
    { name: "Admin Users", value: adminUsers },
    { name: "Delivery Agents", value: deliveryAgents },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Box width="100%" p={6}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Users Overview
      </Text>
      <Flex justify="space-between" align="center">
        {/* Pie Chart Container */}
        <Box flex="2">
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={180}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend align="right" verticalAlign="middle" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* User Data on Right Side */}
        <Box flex="1" textAlign="left" ml={10}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600">
            📊 <strong>Total Users:</strong> {totalUsers}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600">
            ✅ <strong>Users with Orders:</strong> {usersWithOrders}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600">
            ❌ <strong>Users without Orders:</strong> {usersWithoutOrders}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600">
            👑 <strong>Admin Users:</strong> {adminUsers}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600">
            🚚 <strong>Delivery Agents:</strong> {deliveryAgents}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default UsersPieChart;

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

// @desc Create new order
// @route POST /api/orders
// @access Private
const addorderitems = asyncHandler(async (req, res) => {
  console.log(req.user);

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    shippingRates,
    shipmentDetails,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingRates,
      shipmentDetails,
    });
    const createdOrder = await order.save();
    // Update user orderHistory
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orderHistory: createdOrder._id },
    });

    res.status(201).json(createdOrder);
  }
});
// @desc get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order Not found");
  }
});
// @desc update order to paid
// @route update /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not found");
  }
});

// @desc update order to delivered
// @route update /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not found");
  }
});
// @desc get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const GetMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc get orders
// @route GET /api/admin/orders
// @access Private/admin
const GetOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name").populate({
    path: "orderItems.product",
    select: "brandname images",
  });
  res.json(orders);
});

// @desc    Generate Invoice
// @route   GET /api/orders/:id/invoice
// @access  Private/Admin
const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // ✅ Extract only the shipping label URL
  const shippingLabelUrl =
    order.shipmentDetails?.[0]?.shippingLabelUrl || "N/A";
  res.json({ shippingLabelUrl });
});

// @desc  getlocations
// @route   GET /api/incomebycity
// @access  Private/Admin
const incomebycity = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isPaid: true });

  // Calculate total income
  const totalIncome = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  // Format total income
  const formattedTotalIncome = `Rs.${totalIncome}`;

  // Calculate income by city
  const incomeByCity = orders.reduce((acc, order) => {
    const city = order.shippingAddress.city || "Unknown"; // Handle missing city
    acc[city] = (acc[city] || 0) + order.totalPrice;
    return acc;
  }, {});
  res.setHeader("Cache-Control", "no-store");
  res.json({
    totalIncome: formattedTotalIncome,
    incomeByCity: Object.entries(incomeByCity).map(([city, income]) => ({
      city,
      income: `Rs. ${income}`, // Format as $k
    })),
  });
});
// @desc    Fetch transaction details with filters
// @route   GET /api/orders/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
  let { startDate, endDate, paymentType, status } = req.query;

  let query = {};

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (paymentType) {
    query.paymentMethod = paymentType;
  }

  if (status) {
    if (status === "Paid") {
      query.isPaid = true;
    } else if (status === "Unpaid") {
      query.isPaid = false;
    } else if (status === "Delivered") {
      query.isDelivered = true;
    }
  }

  const transactions = await Order.find(query).select(
    "createdAt paymentMethod isPaid isDelivered totalPrice taxPrice shippingPrice orderItems"
  );

  res.json(transactions);
});

export {
  addorderitems,
  getOrderById,
  updateOrderToPaid,
  GetMyOrders,
  GetOrders,
  updateOrderToDelivered,
  generateInvoice,
  incomebycity,
  getTransactions,
};

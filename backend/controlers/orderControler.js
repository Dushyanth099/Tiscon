import asyncHandler from "express-async-handler";

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
    });
    const createdOrder = await order.save();

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
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

//@desc Get orders for delivery person
//@route GET/Api/orders/delivery
// access Private Delivery
const getOrdersForDeliveryPerson = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryPerson: req.user._id,
    isPacked: true,
  }).populate("user", "name email");
  res.json(orders);
});

//@desc Accept order
// @route PUT/api/orders/delivery/accept/:id
// access Private Delivery
const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.isPacked && !order.isAcceptedByDelivery) {
    order.isAcceptedByDelivery = true;
    await order.save();
    res.json({ message: "Order accepted" });
  } else {
    res.status(400);
    throw new Error("Order cannot be accepted");
  }
});

// @desc Reject order
//@route PUT/api/orders/delivery/reject/:id
// access Private Delivery
const rejectOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.isPacked && !order.isAcceptedByDelivery) {
    order.deliveryPerson = null; // Remove delivery person assignment
    await order.save();
    res.json({ message: "Order rejected" });
  } else {
    res.status(400);
    throw new Error("Order cannot be rejected");
  }
});

// @desc Mark order as completed
// @route PUT/api/orders/delivery/complete/:id
// access Private Delivery
const markOrderAsCompleted = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.isAcceptedByDelivery && !order.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    if (order.paymentMethod === "COD") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();
    res.json({ message: "Order marked as completed" });
  } else {
    res.status(400);
    throw new Error("Order cannot be marked as completed");
  }
});

// @desc Mark order as returned
// @route PUT/api/orders/delivery/return/:id
// access Private Delivery
const markOrderAsReturned = asyncHandler(async (req, res) => {
  const { returnReason } = req.body;
  const order = await Order.findById(req.params.id);
  if (order && order.isDelivered) {
    order.isReturned = true;
    order.returnReason = returnReason;
    await order.save();
    res.json({ message: "Order marked as returned" });
  } else {
    res.status(400);
    throw new Error("Order cannot be marked as returned");
  }
});

// @desc Assign order to delivery person
// @route PUT/api/orders/:id/assign
// access Private Admin
const assignOrderToDeliveryPerson = asyncHandler(async (req, res) => {
  const { deliveryPersonId } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.deliveryPerson = deliveryPersonId;
    order.isPacked = true;
    await order.save();
    res.json({ message: "Order assigned to delivery person" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
// @desc    Generate Invoice
// @route   GET /api/orders/:id/invoice
// @access  Private/Admin
const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    const invoice = {
      orderId: order._id,
      user: {
        name: order.user?.name || "N/A",
        email: order.user?.email || "N/A",
      },
      orderItems: order.orderItems,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
    };
    order.invoiceDetails = invoice;
    await order.save();
    res.json(invoice);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
export {
  addorderitems,
  getOrderById,
  updateOrderToPaid,
  GetMyOrders,
  GetOrders,
  updateOrderToDelivered,
  getOrdersForDeliveryPerson,
  acceptOrder,
  rejectOrder,
  markOrderAsCompleted,
  markOrderAsReturned,
  assignOrderToDeliveryPerson,
  generateInvoice,
};

import express from "express";
const router = express.Router();
import {
  addorderitems,
  GetMyOrders,
  getOrderById,
  GetOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  generateInvoice,
  incomebycity,
  getTransactions,
  StripePayment,
} from "../controlers/orderControler.js";
import { createShipment } from "../controlers/deliveryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// admin routes
router.route("/admin/order/:id/invoice").get(protect, generateInvoice);
router.route("/admin/incomebycity").get(protect, admin, incomebycity);
router.route("/transactions").get(protect, admin, getTransactions);
router.route("/:id/shippo").post(protect, admin, createShipment);

// user routes
router.route("/").post(protect, addorderitems).get(protect, admin, GetOrders);
router.route("/myorders").get(protect, GetMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/stripePayment").post(protect, StripePayment);

export default router;

import express from "express";
const router = express.Router();
import {
  addorderitems,
  GetMyOrders,
  getOrderById,
  GetOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrdersForDeliveryPerson,
  acceptOrder,
  rejectOrder,
  markOrderAsCompleted,
  markOrderAsReturned,
  assignOrderToDeliveryPerson,
} from "../controlers/orderControler.js";
import { protect, admin, isDelivery } from "../middleware/authMiddleware.js";

// Delivery person routes
router.route("/delivery").get(protect, isDelivery, getOrdersForDeliveryPerson);
router.route("/delivery/accept/:id").put(protect, isDelivery, acceptOrder);
router.route("/delivery/reject/:id").put(protect, isDelivery, rejectOrder);
router
  .route("/delivery/complete/:id")
  .put(protect, isDelivery, markOrderAsCompleted);
router
  .route("/delivery/return/:id")
  .put(protect, isDelivery, markOrderAsReturned);

// admin routes 
router
  .route("/admin/orders/assign/:id")
  .put(protect, admin, assignOrderToDeliveryPerson);

// user routes
router.route("/").post(protect, addorderitems).get(protect, admin, GetOrders);
router.route("/myorders").get(protect, GetMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;

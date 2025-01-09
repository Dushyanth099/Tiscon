import express from "express";
import {
  getSalesData,
  getRevenueData,
  getLatestOrders,
} from "../controlers/dashboardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sales", protect, admin, getSalesData);
router.get("/revenue", protect, admin, getRevenueData);
router.get("/orders", protect, admin, getLatestOrders);

export default router;

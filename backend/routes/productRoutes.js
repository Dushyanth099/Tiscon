import express from "express";
const router = express.Router();
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createproductreview,
  uploadProducts,
  addToCart,
  getCart,
  deleteCartItem,
  getProductById,
} from "../controlers/productControler.js";
import { uploadMultipleImages } from "../multer/multer.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts);
router
  .route("/create")
  .post(protect, admin, uploadMultipleImages, createProduct);
router.post("/upload", protect, admin, uploadProducts);
router.route("/:id/reviews").post(protect, createproductreview);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, uploadMultipleImages, updateProduct);
router.route("/:id/addtocart").post(protect, addToCart);
router.route("/:id/getcart").get(protect, getCart);
router.route("/:cartItemId/deletecart").delete(protect, deleteCartItem);

export default router;

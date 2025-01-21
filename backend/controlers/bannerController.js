import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import multer from "multer";

// multer Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."),
      false
    );
  }
};
const upload = multer({ storage, fileFilter });

// @desc Create add banners
// @route POST /api/banners
// @access Private / Admin
const addBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, productId } = req.body;
  if (!req.file || !title || !subtitle || !productId) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  if (product.banners.length >= 3) {
    return res
      .status(400)
      .json({ message: "Maximum of 3 banners allowed per product." });
  }
  const banner = {
    image: `/uploads/${req.file.filename}`,
    title,
    subtitle,
    productId,
  };
  product.banners.push(banner);
  await product.save();
  res.status(201).json({ message: "Banner added successfully.", banner });
});

// @desc deleteBanner
// @route delete /api/banners/:id
// @access Private/admin
const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ "banners._id": id });

  if (!product) {
    return res.status(404).json({ message: "Banner not found." });
  }

  product.banners = product.banners.filter(
    (banner) => banner._id.toString() !== id
  );
  await product.save();

  res.status(200).json({ message: "Banner deleted successfully." });
});

// @desc getBanners
// @route get /api/banners
// @access Private
const getBanners = asyncHandler(async (req, res) => {
  try {
    const productsWithBanners = await Product.find({
      "banners.0": { $exists: true },
    }).select("banners");

    const banners = productsWithBanners.flatMap((product) => product.banners);

    res.status(200).json(banners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch banners.", error: error.message });
  }
});
export { addBanner, deleteBanner, getBanners, upload };

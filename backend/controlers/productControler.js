import asyncHandler from "express-async-handler";
import multer from "multer";
import XLSX from "xlsx";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const Cg = req.query.Cg;
  const filter = req.query.filter;
  const from = req.query.from;
  const to = req.query.to;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  console.log(req.query.keyword);

  if (Cg) {
    const products = await Product.find({ category: Cg });
    res.json(products);
  } else if (filter) {
    switch (filter) {
      case "Rating":
        const productsbyrating = await Product.find({}).sort("-rating").exec();
        res.json(productsbyrating);

        break;
      case "date":
        const productsbydate = await Product.find({}).sort("createdAt").exec();
        res.json(productsbydate);
        break;
      case "highprice":
        const productsbyhighprice = await Product.find({}).sort("price");
        res.json(productsbyhighprice);

        break;
      case "lowprice":
        const productsbylowprice = await Product.find({}).sort("-price").exec();
        res.json(productsbylowprice);
        break;

      default:
        break;
    }
  } else if (from && to) {
    const productbyprice = await Product.find({
      price: { $lte: to },
      price: { $gte: from },
    });
    res.json(productbyprice);
  } else {
    const products = await Product.find({ ...keyword });
    res.json(products);
  }
});

// @desc Fetch single  product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    // status it's 500 by default cuz of errHandler
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Delete a product
// @route GET /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Removed" });
  } else {
    // status it's 500 by default cuz of errHandler
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a product
// @route Post /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    description: "sample description",
    user: req.user._id,
    sizes: [],
    images: [
      "https://i.imgur.com/QN2BSdJ.jpg",
      "https://i.imgur.com/QN2BSdJ.jpg",
      "https://i.imgur.com/QN2BSdJ.jpg",
    ],
    category: [],
    countInStock: 0,
    numReviews: 0,
  });
  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    oldPrice,
    discount,
    description,
    category,
    sizes,
    Images,
    countInStock,
  } = req.body;
  console.log(name, price, Images);
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.sizes = sizes;
    product.images = Images;
    product.countInStock = countInStock;
    product.oldPrice = oldPrice;
    product.discount = discount;
    // Calculate the new price based on the discount
    if (oldPrice && discount) {
      product.price = oldPrice - (oldPrice * discount) / 100;
    }
    const updatedProduct = await product.save();
    console.log(updatedProduct);
    res.json(updateProduct);
  } else {
    res.status(404);
    throw new Error("Product Not found");
  }
});

// @desc Create a bulk product
// @route Post /api/products
// @access Private/Admin

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
const uploadProducts = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed" });
    }

    const file = req.file;

    // Validate file name
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return res.status(400).json({ message: "Only Excel files are allowed" });
    }

    // Parse Excel file
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate and process data
    const products = [];
    for (const row of sheetData) {
      if (!row.name || !row.price || !row.countInStock) {
        return res.status(400).json({ message: "Invalid data in Excel file" });
      }

        products.push({
          user: req.user._id,
          name: row.name,
          price: row.price,
          oldPrice: row.oldPrice || 0,
          discount: row.discount || 0,
          category: row.category ? row.category.split(",") : [],
          sizes: row.sizes ? row.sizes.split(",") : [],
          description: row.description || "No description",
          countInStock: row.countInStock,
          images: row.images ? row.images.split(",") : [],
        });
    }

    // Insert products into the database
    await Product.insertMany(products);

    res.status(201).json({ message: "Products uploaded successfully!" });
  });
});

// @desc Create new Review
// @route PUT /api/products/:id/reviews
// @access Private
const createproductreview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(404);
      throw new Error("Product Already Review");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product Not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createproductreview,
  uploadProducts,
};

import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { fetchFedExRates } from "../services/FedexShippingcharge.js";
import { createfedexshipment } from "../services/FedexShipment.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

// get shipment rates
// @route   get/api/felivery/fedex-rates
// @access  Public
const shipmentrates = asyncHandler(async (req, res) => {
  const { userAddress, productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const senderAddress = {
    postalCode: product.shippingDetails.originAddress.zip,
    countryCode: product.shippingDetails.originAddress.country,
  };
  const recipientAddress = {
    postalCode: userAddress.zip,
    countryCode: userAddress.country,
  };
  const packageDetails = {
    weight: {
      units: "KG",
      value: product.shippingDetails.weight,
    },
  };
  const rates = await fetchFedExRates(
    senderAddress,
    recipientAddress,
    packageDetails
  );
  console.log("✅ FedEx API Response (Rates):", JSON.stringify(rates, null, 2)); // DEBUG LOG

  res.json(rates);
});

// create  Assign to delivery
// @route   POST/api/delivery/createShipment
// @access  Public
const createShipment = asyncHandler(async (req, res) => {
  const { order, productId } = req.body;
  console.log("Incoming Request Body:", req.body);
  if (!order) {
    res.status(400);
    throw new Error("Order data is missing in request body");
  }
  // Fetch user details
  const user = await User.findById(order.user);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  console.log("✅ User Data Retrieved:", JSON.stringify(user, null, 2)); // Debugging

  // Fetch product details
  const product = await Product.findById(productId).populate(
    "user",
    "name address.phoneNumber"
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  console.log("✅ Retrieved Product with User Details:", product);

  const senderDetails = {
    contact: {
      personName: product.user.name,
      phoneNumber: product.user.address?.phoneNumber,
    },
    address: {
      streetLines: [
        product.shippingDetails.originAddress.street1,
        product.shippingDetails.originAddress.street2 || "",
      ],
      city: product.shippingDetails.originAddress.city,
      stateOrProvinceCode: product.shippingDetails.originAddress.state,
      postalCode: product.shippingDetails.originAddress.zip,
      countryCode: product.shippingDetails.originAddress.country,
    },
  };
  console.log("✅ Sender Details:", senderDetails);

  const recipientDetails = {
    contact: {
      personName: user.name,
      phoneNumber: user.address.phoneNumber,
    },
    address: {
      streetLines: [user.address.street],
      city: user.address.city,
      stateOrProvinceCode: user.address.state,
      postalCode: user.address.pin,
      countryCode: "IN",
    },
  };
  console.log("✅ Recipient Details:", recipientDetails);

  // Package details
  const packageDetails = {
    weight: {
      units: "KG",
      value: product.shippingDetails.weight,
    },
  };
  console.log("✅ Package Details:", packageDetails);

  // Call FedEx Shipment service with prepared data
  try {
    const shipmentData = await createfedexshipment(
      senderDetails,
      recipientDetails,
      packageDetails,
      order.totalPrice
    );
    console.log(
      "✅ FedEx Shipment Created Successfully:",
      JSON.stringify(shipmentData, null, 2)
    );

    res.status(200).json({
      success: true,
      data: shipmentData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create FedEx shipment",
      error: error.message,
    });
  }
});
export { shipmentrates, createShipment };

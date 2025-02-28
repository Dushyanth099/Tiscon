import mongoose from "mongoose";
const shippingRateSchema = mongoose.Schema(
  {
    serviceType: { type: String, required: true },
    totalNetCharge: { type: Number, required: true },
    estimatedDeliveryDate: { type: String, default: "N/A" },
    currency: { type: String, default: "USD" },
  },
  { timestamps: true }
);
const shipmentSchema = mongoose.Schema(
  {
    trackingNumber: { type: String, required: true }, // FedEx tracking number
    shippingLabelUrl: { type: String }, // FedEx shipping label URL
    shipmentStatus: { type: String, default: "Pending" }, // Shipment status (Pending, Shipped, Delivered, etc.)
    senderDetails: {
      contact: {
        
        personName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
      },
      address: {
        streetLines: [{ type: String }],
        city: { type: String, required: true },
        stateOrProvinceCode: { type: String, required: true },
        postalCode: { type: Number, required: true },
        countryCode: { type: String, required: true },
      },
    },
    recipientDetails: {
      contact: {
        personName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
      },
      address: {
        streetLines: [{ type: String }],
        city: { type: String, required: true },
        stateOrProvinceCode: { type: String, required: true },
        postalCode: { type: Number, required: true },
        countryCode: { type: String, required: true },
      },
    },
    packageDetails: {
      weight: {
        value: { type: Number, required: true },
        units: { type: String, default: "KG" },
      },
    },
  },
  { timestamps: true }
);
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      doorNo: { type: Number, default: null },
      street: { type: String, default: "" },
      nearestLandmark: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pin: { type: Number, default: "" },
      country: { type: String, default: "" },
      phoneNumber: { type: Number, required: true }, // New field
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_adress: { type: String },
    },

    taxPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    invoiceDetails: {
      type: Object,
      default: null,
    },
    trackingNumber: { type: String }, // Store FedEx tracking number
    shippingRates: { type: [shippingRateSchema], default: [] },
    shipmentDetails: [shipmentSchema],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

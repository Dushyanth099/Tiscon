import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //relation betwen the order and the user
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Relation to delivery person
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
      pin: { type: String, default: "" },
      country: { type: String, default: "" },
      phoneNumber: { type: String, required: true }, // New field
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
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
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
    isPacked: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAcceptedByDelivery: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    returnReason: {
      type: String,
    },
    invoiceDetails: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreateOrder } from "../../actions/orderActions";
import { Helmet } from "react-helmet";
import { fetchCart } from "../../actions/cartActions";
import "./Placeorder.css";
import { fetchShippingRates } from "../../actions/deliveryActions";
import { saveShippingRates } from "../../actions/cartActions";
import { createShipment } from "../../actions/deliveryActions";

const Placeorder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);

  const { order, success, error } = orderCreate;
  const taxPercentage = 5;
  const {
    doorNo,
    street,
    city,
    state,
    pin,
    country,
    phoneNumber,
    nearestLandmark,
  } = cart.shippingAddress;
  const shippingCost = cart.shippingCost;
  const shippingRates = cart.shippingRates;
  console.log("Shipping Rates", shippingRates);
  const itemsPrice = cart.cartItems.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + item.qty * item.product.price;
    }
    return acc;
  }, 0);
  const taxPrice = (itemsPrice * taxPercentage) / 100;
  const totalPrice = itemsPrice + shippingCost + taxPrice;

  const PlaceorderHandler = async () => {
    try {
      // Prepare shipment details
      const shipmentDetails = {
        recipientName: userInfo.name,
        street,
        nearestLandmark,
        city,
        postalCode: pin,
        countryCode: country,
        productId: cart.cartItems[0].product._id,
        totalPrice,
      };
      console.log("🚀 Sending Shipment Details:", shipmentDetails);
      // Create shipment with FedEx
      const shipmentResponse = await dispatch(createShipment(shipmentDetails));
      console.log("📦 Shipment Response:", shipmentResponse);
      const shipmentData = shipmentResponse.data;

      const orderData = {
        user: userInfo._id,
        orderItems: cart.cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.brandname,
          price: item.product.price,
          qty: item.qty,
        })),
        shippingAddress: {
          street,
          city,
          state,
          pin,
          country,
          phoneNumber,
          doorNo,
          nearestLandmark,
        },
        shippingRates,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice: shippingCost,
        taxPrice: taxPercentage,
        totalPrice,
        shipmentDetails: [shipmentData],
      };

      console.log("Final Order Payload:", orderData);
      dispatch(CreateOrder(orderData));
    } catch (error) {
      console.error("❌ Error creating order:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      console.log(order._id);
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order]);
  return (
    <div className="placeorder">
      <Helmet>
        <title>Place Order</title>
      </Helmet>

      {/* Order Details */}
      <div className="informations-placeorder">
        <div className="shipping-placeorder">
          <h2>📦 Shipping</h2>
          <p>
            <strong>Address:</strong> {cart.shippingAddress.doorNo},{" "}
            {cart.shippingAddress.street},{" "}
            {cart.shippingAddress.nearestLandmark}, {cart.shippingAddress.city},{" "}
            {cart.shippingAddress.state} - {cart.shippingAddress.pin},{" "}
            {cart.shippingAddress.country}
          </p>
          <p>
            <strong>📞 Phone:</strong> {cart.shippingAddress.phoneNumber}
          </p>
        </div>

        <div className="payment-placeorder">
          <h2>💳 Payment Method</h2>
          <p>
            <strong>Method:</strong> {cart.paymentMethod}
          </p>
        </div>

        {/* Order Items */}
        <div>
          <h2>🛒 Order Items</h2>
          {cart.cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="orders-placeorder">
              {cart.cartItems.map((item) => (
                <p key={item.product._id}>
                  <Link
                    to={`/product/${item.product._id}`}
                    className="color-name"
                  >
                    {item.product.brandname}
                  </Link>
                  <br />
                  <b>Price: Rs. {item.product.price.toFixed(2)}</b> | Qty:{" "}
                  {item.qty}
                  <hr />
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="your-products">
        <div className="cart-summ">
          <h1>📝 Order Summary</h1>

          <h3>
            Subtotal: <span>Rs. {itemsPrice.toFixed(2)}</span>
          </h3>
          <h3>
            Shipping: <span>Rs. {shippingCost}</span>
          </h3>
          <h3>
            Tax (5%): <span>Rs. {taxPrice.toFixed(2)}</span>
          </h3>
          <h3>
            <b>Total:</b>{" "}
            <span>
              <b>Rs. {totalPrice.toFixed(2)}</b>
            </span>
          </h3>

          {/* Order Button */}
          <div className="div-placeorder-btn">
            <button className="placeorder-btn" onClick={PlaceorderHandler}>
              🛍️ Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Placeorder;

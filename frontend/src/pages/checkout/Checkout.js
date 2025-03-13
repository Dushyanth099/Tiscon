import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Input,
  Stack,
  Select,
  Button,
  Flex,
  VStack,
  HStack,
  Text,
  Divider,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiShoppingCart2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  saveAddressshipping,
  savepaymentmethod,
  fetchCart,
} from "../../actions/cartActions";
import Payment from "./Payment";
import { fetchShippingRates } from "../../actions/deliveryActions";
import { saveShippingCost } from "../../actions/cartActions";
import { saveShippingRates } from "../../actions/cartActions";
import StripePayment from "./Stripepayment";
import { createShipment } from "../../actions/deliveryActions";
import { CreateOrder } from "../../actions/orderActions";
import { getUserDetails } from "../../actions/userActions";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const itemsPrice = cart.cartItems.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + item.qty * item.product.price;
    }
    return acc;
  }, 0);

  const { shippingAddress } = cart;
  const { rates, loading, error } = useSelector((state) => state.shipping);
  const [doorNo, setDoorNo] = useState(shippingAddress?.doorNo || "");
  const [street, setStreet] = useState(shippingAddress?.street || "");
  const [nearestLandmark, setNearestLandmark] = useState(
    shippingAddress?.nearestLandmark || ""
  );
  const [selectedRate, setSelectedRate] = useState(null);
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [state, setState] = useState(shippingAddress?.state || "");
  const [pin, setPin] = useState(shippingAddress?.pin || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const dispatch = useDispatch();
  const taxPercentage = 5;
  const shippingRates = cart.shippingRates;
  const subtotal = cart.cartItems.reduce(
    (acc, item) => acc + item.qty * item.product.price,
    0
  );
  const taxAmount = (subtotal * taxPercentage) / 100;
  const [shippingCost, setShippingCost] = useState(0);
  const totalPrice = subtotal + taxAmount + shippingCost;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, ordererror } = orderCreate;
  const userProfile = useSelector((state) => state.userDetails);
  const { user, loading: userLoading } = userProfile;
  const recipientAddress = user?.address;

  const handleShippingRateChange = (rate) => {
    setSelectedRate(rate);

    const netCharge =
      (rate.ratedShipmentDetails &&
        rate.ratedShipmentDetails[0]?.totalNetCharge) ||
      0;
    const currency = rate.ratedShipmentDetails?.[0]?.currency || "USD";
    const estimatedDeliveryDate =
      rate.operationalDetail?.astraDescription || "N/A";

    setShippingCost(netCharge);
    dispatch(saveShippingCost(netCharge));
    dispatch(
      saveShippingRates([
        {
          serviceType: rate.serviceType,
          totalNetCharge: parseFloat(netCharge),
          estimatedDeliveryDate,
          currency,
        },
      ])
    );
    console.log("✅ Shipping Rate Saved in Redux:", {
      serviceType: rate.serviceType,
      totalNetCharge: parseFloat(netCharge),
      estimatedDeliveryDate: rate.estimatedDeliveryDate || "N/A",
      currency: rate.currency || "USD",
    });
  };

  const handleFetchRates = () => {
    if (cart.cartItems.length > 0) {
      const firstProduct = cart.cartItems[0].product;
      dispatch(
        fetchShippingRates(
          { street, city, state, zip: pin, country },
          firstProduct._id
        )
      );
    }
  };

  useEffect(() => {
    if (cart.cartItems.length > 0) {
      handleFetchRates();
    }
  }, [pin, country]);
  useEffect(() => {
    if (rates) {
      console.log("FedEx API Response:", rates);
    }
  }, [rates]);

  const handleOrder = async (e) => {
    e.preventDefault();
    dispatch(
      saveAddressshipping({
        doorNo,
        street,
        nearestLandmark,
        city,
        state,
        pin,
        country,
        phoneNumber,
      })
    );

    dispatch(savepaymentmethod(paymentMethod));

    try {
      // Prepare shipment details
      const shipmentDetails = {
        recipientName: userInfo.name,
        street: recipientAddress.street,
        nearestLandmark: recipientAddress.nearestLandmark,
        city: recipientAddress.city,
        postalCode: recipientAddress.pin,
        countryCode: recipientAddress.country || "IN",
        phoneNumber: recipientAddress?.phoneNumber,
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
        shippingAddress: recipientAddress,
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
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (success) {
      console.log(order._id);
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order]);

  return (
    <Box p={6} maxW="container.xl" mx="auto">
      <Grid templateColumns={{ base: "1fr", md: "0fr 1fr" }} gap={8}>
        {/* Right Side - Order Summary */}
        <VStack
          align="start"
          spacing={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          shadow="md"
        >
          <Text fontSize="xl" fontWeight="bold">
            Order Summary
          </Text>
          <Divider />

          {cart.cartItems.map((item, index) => (
            <HStack key={index} justify="space-between" w="full">
              <Text>
                {item.qty} x{" "}
                <Link
                  to={`/product/${item.product._id}`}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {" "}
                  {item.product.brandname}
                </Link>
              </Text>
              <Text fontWeight="bold">Rs. {item.product.price * item.qty}</Text>
            </HStack>
          ))}

          <Divider />
          <HStack justify="space-between" w="full">
            <Text>Subtotal:</Text>
            <Text fontWeight="bold">Rs. {subtotal.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text>Shipping:</Text>
            <Text fontWeight="bold">Rs. {shippingCost.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text>Taxes (5%):</Text>
            <Text fontWeight="bold">Rs. {taxAmount.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text fontSize="xl" fontWeight="bold">
              Total:
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              Rs. {totalPrice.toFixed(2)}
            </Text>
          </HStack>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : rates && rates.length > 0 ? (
            rates.map((rate, index) => {
              const serviceName =
                rate.serviceDescription?.description || "Unknown Service";
              const netCharge =
                rate.ratedShipmentDetails[0]?.totalNetCharge || "N/A";

              return (
                <HStack key={index}>
                  <input
                    type="radio"
                    name="shippingRate"
                    value={rate.serviceType}
                    onChange={() => handleShippingRateChange(rate)}
                  />
                  <Text>
                    {serviceName} - RS.{netCharge.toFixed(2)} (Est. Delivery:{" "}
                    {rate.estimatedDeliveryDate})
                  </Text>
                </HStack>
              );
            })
          ) : (
            <p>
              No shipping rates available. Please check your address details.
            </p>
          )}

          <Text fontSize="2xl" fontWeight="bold">
            Payment Method
          </Text>
          <Divider />

          <HStack spacing={4} w="full">
            <Button
              onClick={() => setPaymentMethod("Online Payment")}
              variant={Payment === "Online Payment" ? "solid" : "outline"}
              colorScheme="yellow"
              flex="1"
            >
              Online Payment
            </Button>
            <Button
              onClick={() => setPaymentMethod("COD")}
              variant={Payment === "COD" ? "solid" : "outline"}
              colorScheme="green"
              flex="1"
            >
              Cash on Delivery
            </Button>
          </HStack>
          {paymentMethod === "Online Payment" && (
            <Payment
              totalPrice={totalPrice}
              onSuccess={() => navigate("/placeorder")}
              setPaymentMethod={setPaymentMethod}
            />
          )}
          {paymentMethod === "Online Payment" && (
            <StripePayment
              totalPrice={totalPrice}
              onSuccess={() => navigate("/placeorder")}
              setPaymentMethod={setPaymentMethod}
            />
          )}
          <Button color="black" size="lg" w="full" onClick={handleOrder}>
            Place Order
          </Button>
        </VStack>
      </Grid>
    </Box>
  );
};

export default Checkout;

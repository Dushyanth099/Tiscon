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

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
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

  const subtotal = cart.cartItems.reduce(
    (acc, item) => acc + item.qty * item.product.price,
    0
  );
  const taxAmount = (subtotal * taxPercentage) / 100;
  const [shippingCost, setShippingCost] = useState(0);
  const totalPrice = subtotal + taxAmount + shippingCost;

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
  }, [
    // doorNo,
    // street,
    // nearestLandmark,
    // city,
    // state,
    // cart.cartItems,
    pin,
    country,
  ]);
  useEffect(() => {
    if (rates) {
      console.log("FedEx API Response:", rates); // 🔍 Check if the response contains rates
    }
  }, [rates]);
  const handleOrder = (e) => {
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
    navigate("/placeorder");
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="100vh"
      p={10}
      mt={20}
    >
      <Helmet>
        <title>Checkout</title>
      </Helmet>

      <Flex
        maxW="1200px"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        gap={8}
      >
        {/* Left Side - Billing & Payment */}
        <VStack flex="2" bg="white" p={6} borderRadius="md" boxShadow="lg">
          <Text fontSize="2xl" fontWeight="bold">
            Billing Address
          </Text>
          <Divider />

          <Input
            placeholder="Door No."
            value={doorNo}
            onChange={(e) => setDoorNo(e.target.value)}
          />
          <Input
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <Input
            placeholder="Nearest Landmark"
            value={nearestLandmark}
            onChange={(e) => setNearestLandmark(e.target.value)}
          />
          <HStack spacing={4}>
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </HStack>
          <HStack spacing={4}>
            <Input
              placeholder="Pin Code"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </HStack>
          <Select
            placeholder="Select Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="IN">IN</option>
            <option value="USA">USA</option>
            <option value="France">France</option>
          </Select>

          <Text fontSize="2xl" fontWeight="bold" mt={6}>
            Payment Method
          </Text>
          <Divider />

          <Stack spacing={4} direction="row">
            <Button
              onClick={() => setPaymentMethod("Online Payment")}
              variant={Payment === "Online Payment" ? "solid" : "outline"}
              colorScheme="yellow"
            >
              Online Payment
            </Button>
            <Button
              onClick={() => setPaymentMethod("COD")}
              variant={Payment === "COD" ? "solid" : "outline"}
              colorScheme="green"
            >
              Cash on Delivery
            </Button>
          </Stack>
          {paymentMethod === "Online Payment" && (
            <Payment
              totalPrice={totalPrice}
              onSuccess={() => navigate("/placeorder")}
              setPaymentMethod={setPaymentMethod}
            />
          )}
          <Button colorScheme="blue" size="lg" w="full" onClick={handleOrder}>
            Place Order
          </Button>
        </VStack>

        {/* Right Side - Order Summary */}
        <VStack flex="1" bg="white" p={6} borderRadius="md" boxShadow="lg">
          <Text fontSize="2xl" fontWeight="bold">
            <RiShoppingCart2Line size="24" /> Cart ({cart.cartItems.length})
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
          <Box>
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
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Checkout;

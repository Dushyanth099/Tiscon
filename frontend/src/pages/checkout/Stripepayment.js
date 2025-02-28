import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Box, Button, Text } from "@chakra-ui/react";

const stripePromise = loadStripe("your-stripe-public-key"); // Replace with your Stripe Public Key

const CheckoutForm = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { data: clientSecret } = await axios.post("/api/payment/stripe", {
      amount: totalPrice,
    });

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (paymentResult.error) {
      console.error(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === "succeeded") {
        setPaymentMethod("Card"); // Save as "Card" in DB
        onSuccess(paymentResult);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button mt={4} colorScheme="blue" type="submit" isDisabled={!stripe}>
        Pay with Card
      </Button>
    </form>
  );
};

const StripePayment = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  return (
    <Elements stripe={stripePromise}>
      <Box mt={4} w="full">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Pay with Stripe
        </Text>
        <CheckoutForm
          totalPrice={totalPrice}
          onSuccess={onSuccess}
          setPaymentMethod={setPaymentMethod}
        />
      </Box>
    </Elements>
  );
};

export default StripePayment;

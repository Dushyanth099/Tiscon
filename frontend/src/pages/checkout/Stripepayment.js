import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";

const stripeApiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
console.log("Stripe API Key:", stripeApiKey); // Debugging

const stripePromise = loadStripe(stripeApiKey);

const GooglePayButton = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canShowPaymentRequest, setCanShowPaymentRequest] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "Total", amount: totalPrice * 100 },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      console.log("Google Pay canMakePayment result:", result); // Debugging
      if (result) {
        console.log("Google Pay is supported!");
        setPaymentRequest(pr);
        setCanShowPaymentRequest(true);
      } else {
        console.warn("Google Pay is not supported on this device.");
        console.warn("Debug info: result is", JSON.stringify(result, null, 2));
      }
    });
  }, [stripe, totalPrice]);

  if (!canShowPaymentRequest) {
    return (
      <Text fontSize="lg">Google Pay is not available on this device.</Text>
    );
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Pay with Google Pay
      </Text>
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </Box>
  );
};

const StripePayment = ({ totalPrice, onSuccess, setPaymentMethod }) => {
  return (
    <Elements stripe={stripePromise}>
      <GooglePayButton
        totalPrice={totalPrice}
        onSuccess={onSuccess}
        setPaymentMethod={setPaymentMethod}
      />
    </Elements>
  );
};

export default StripePayment;

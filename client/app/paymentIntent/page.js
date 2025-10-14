"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51SHjwYJ4FRwlPxFg2kRfsKEREwKfjW7VOYQdCEMN2yxHXEGrM1ehB9P5Tq4UxsWUlpVgvmojXt1feup0vhYLGJBd000O95jDgn"
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ correct spelling (you had e.preventDefaul)
    setLoading(true);

    // 1️⃣ Create Payment Intent on backend
    const res = await fetch("http://localhost:8000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // $10
    });

    const { clientSecret } = await res.json();

    // 2️⃣ Confirm payment on frontend
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setMessage("✅ Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[400px] m-[50px] flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold">Custom Card Payment</h2>

      {/* ✅ CardElement is a self-closing tag — not wrapping the button */}
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#fa755a" },
          },
        }}
      />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay $10"}
      </button>

      <p>{message}</p>
    </form>
  );
}

export default function Page() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

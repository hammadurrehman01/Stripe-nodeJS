"use client";

import { useState } from "react";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SHjwYJ4FRwlPxFg2kRfsKEREwKfjW7VOYQdCEMN2yxHXEGrM1ehB9P5Tq4UxsWUlpVgvmojXt1feup0vhYLGJBd000O95jDgn"
);

function SaveCardForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [message, setMessage] = useState("");

  // 1️⃣ Create customer
  const createCustomer = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/create-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setCustomerId(data.customer.id);
    setMessage(`Customer created: ${data.customer.id}`);
  };

  // 2️⃣ Save card to customer
  const saveCard = async () => {
    const res = await fetch("http://localhost:8000/save-payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    console.log("result ==>, result", result);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("✅ Card saved successfully!");
    }
  };

  // 3️⃣ Charge customer later
  const chargeCustomer = async () => {
    const res = await fetch("http://localhost:8000/charge-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, amount: 500 }), // $5
    });

    const data = await res.json();
    if (data.success) setMessage("💰 Charged $5 successfully!");
    else setMessage("❌ Failed to charge customer");
  };

  return (
    <div className="p-8 max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Save Card & Charge Later</h1>

      <input
        className="border p-2 rounded"
        type="email"
        placeholder="Customer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={createCustomer}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Customer
      </button>

      {customerId && (
        <>
          <CardElement
            options={{ style: { base: { fontSize: "18px", color: "white" } } }}
            className="p-2 border rounded"
          />
          <button
            onClick={saveCard}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Card
          </button>

          <button
            onClick={chargeCustomer}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Charge $5
          </button>
        </>
      )}

      <p className="text-sm mt-2">{message}</p>
    </div>
  );
}

export default function Page() {
  return (
    <Elements stripe={stripePromise}>
      <SaveCardForm />
    </Elements>
  );
}

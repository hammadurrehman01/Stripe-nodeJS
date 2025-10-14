"use client";
import { useState } from "react";

export default function page() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/create-subscription-session", {
      method: "POST",
    });
    const data = await res.json();
    console.log("data ===>", data)
    window.location.href = data.url; // redirect to Stripe Checkout
  };

  return (
    <main style={{ padding: 50 }}>
      <h1>Pro Plan - $10/month</h1>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Redirecting..." : "Subscribe"}
      </button>
    </main>
  );
}

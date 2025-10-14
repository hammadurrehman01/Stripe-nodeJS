"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SHjwYJ4FRwlPxFg2kRfsKEREwKfjW7VOYQdCEMN2yxHXEGrM1ehB9P5Tq4UxsWUlpVgvmojXt1feup0vhYLGJBd000O95jDgn");

stripePromise.then((res) => { console.log('res======>', res) })

export default function page() {
  const handleCheckout = async () => {
    const res = await fetch("http://localhost:8000/create-checkout-session", {
      method: "POST",
    });
    const data = await res.json();
    console.log("data ===>", data)
    window.location.href = data.url;
  };

  return (
    <main className="p-56">
      <h1>Buy T-Shirt - $10</h1>
      <button onClick={handleCheckout} className="cusror-pointer">Checkout</button>
    </main>
  );
}

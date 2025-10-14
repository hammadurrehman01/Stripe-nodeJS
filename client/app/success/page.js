"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [session, setSession] = useState(null);
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(async () => {
    if (!sessionId) return;
    const res = await fetch(`http://localhost:8000/session/${sessionId}`);
    const data = await res.json();
    setSession(data)
    console.log("data ==>", data)
  }, [sessionId]);

  if (!session) return <p>Loading...</p>;

  console.log("session -->", session)

  return (
    <main style={{ padding: 50 }}>
      <h1>Payment Successful 🎉</h1>
      <p>Session ID: {session.id}</p>
      <p>Customer Email: {session.customer_details.email}</p>
      <p>Subscription ID: {session.subscription.id}</p>
    </main>
  );
}

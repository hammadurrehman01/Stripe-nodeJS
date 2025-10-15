import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 8000;

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
              images: [
                "https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533",
              ],
            },
            unit_amount: 10000,
          },
          quantity: 3,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error?.message,
    });
  }
});

app.post("/create-customer", async (req, res) => {
  const { email } = req.body;

  const customer = await stripe.customers.create({
    email,
  });

  res.send({ customer });
});

app.post("/create-subscription-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1SI7PzJ4FRwlPxFgKXZ37Kj3",
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ["customer", "subscription"],
    });
    res.send(session);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/save-payment-method", async (req, res) => {
  const { customerId } = req.body;
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
  });

  res.send({ clientSecret: setupIntent.client_secret });
});

app.post("/charge-customer", async (req, res) => {
  const { customerId, amount } = req.body;

  const customer = await stripe.customers.retrieve(customerId);

  console.log("customer ===>", customer);

  if (!customer.invoice_settings.default_payment_method) {
    return res.status(400).send({ error: "No default payment method found" });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    customer: customerId,
    payment_method: customer.invoice_settings.default_payment_method,
    off_session: true,
    confirm: true,
  });

  return res.send({ success: true, paymentIntent });
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    console.log("sig ========>", sig)
    console.log("req.body ========>", req.body)

    let event;

    try {
      stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

    } catch (error) {
      console.error("⚠️  Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        console.log("✅ Checkout session completed:", event.data.object.id);
        break;
      case "invoice.payment_succeeded":
        console.log("💰 Invoice payment succeeded:", event.data.object.id);
        break;
      case "customer.subscription.deleted":
        console.log("❌ Subscription canceled:", event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

app.listen(PORT, () => {
  console.log(`Server is listening to the port ${PORT}`);
});


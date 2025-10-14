import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json())

const stripe = new Stripe("https://prod.liveshare.vsengsaas.visualstudio.com/join?8C905A920FC167A82D44308C66740A5BEA12");

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
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        product_data: { name: "T-shirt",  images: ["https://tasweer.com.pk/cdn/shop/files/mustard_Hurricane_T-Shirt_Unisex.jpg?v=1729601769&width=533"]},
                        unit_amount: 10000
                    },
                    quantity: 3
                }
            ],
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        })
        res.json({ url: session.url })
    } catch (error) {
        res.status(500).json({ error: error?.message })
    }
})


app.listen(PORT, () => {
    console.log(`Server is listening to the port ${PORT}`);
})
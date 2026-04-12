import Stripe from 'stripe';
import userModel from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = {
    'Basic': { price: 10, credits: 100 },
    'Advanced': { price: 50, credits: 500 },
    'Business': { price: 250, credits: 5000 },
};

const createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body;
        const clerkId = req.clerkid; 

        if (!plans[planId]) {
            return res.json({ success: false, message: "Invalid plan" });
        }

        const user = await userModel.findOne({ clerkId });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const plan = plans[planId];
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            client_reference_id: clerkId,
            metadata: {
                creditsAmount: plan.credits,
                planId: planId
            },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${planId} Plan - ${plan.credits} Credits`,
                        },
                        unit_amount: plan.price * 100, // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/result?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/buy?payment=cancelled`,
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

const stripeWebhook = async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    
    let event;

    try {
        // req.body must be raw buffer for this to work correctly! We will handle this in routing.
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const clerkId = session.client_reference_id;
        const creditsToAdd = parseInt(session.metadata.creditsAmount, 10);

        try {
            const user = await userModel.findOne({ clerkId });
            if (user) {
                user.creditBalance += creditsToAdd;
                await user.save();
                console.log(`Successfully added ${creditsToAdd} credits to ${clerkId}`);
            }
        } catch (error) {
            console.error("Error updating user credits:", error);
        }
    }

    res.status(200).send('Webhook Received');
};

export { createCheckoutSession, stripeWebhook };

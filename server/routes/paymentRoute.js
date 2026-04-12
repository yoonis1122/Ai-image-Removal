import express from 'express';
import { createCheckoutSession, stripeWebhook } from '../controllers/paymentController.js';
import authUser from '../middlewares/auth.js';

const paymentRouter = express.Router();

paymentRouter.post('/buy-credits', authUser, createCheckoutSession);
paymentRouter.post('/stripe-webhook', stripeWebhook);

export default paymentRouter;

import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY; // pk_test_...

export const stripePromise = loadStripe(stripePublicKey);

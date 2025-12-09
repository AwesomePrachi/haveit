import stripe from 'stripe'

const Stripe = stripe(process.env.STRIPE_KEY_SECRET)

export default Stripe
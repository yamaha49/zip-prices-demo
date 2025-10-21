import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded:', session.id);
      
      // Store unlock status
      await storeUnlockStatus(session.metadata.zip, session.id);
      
      // Send confirmation email (optional)
      console.log(`Unlock confirmed for ZIP ${session.metadata.zip}`);
      break;
    
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded');
      break;
    
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function storeUnlockStatus(zip, sessionId) {
  // For demo purposes, we'll use localStorage/sessionStorage
  // In production, use a database like Vercel KV, Supabase, or MongoDB
  
  // This is a placeholder - in a real app, you'd store this in a database
  console.log(`Storing unlock status: ZIP ${zip}, Session ${sessionId}`);
  
  // Example with Vercel KV (uncomment when ready):
  // const kv = require('@vercel/kv');
  // await kv.set(`unlocked:${zip}`, sessionId, { ex: 86400 }); // 24 hours
}

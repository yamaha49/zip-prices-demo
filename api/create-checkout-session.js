// Check for required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe is properly configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ 
      error: 'Stripe configuration missing',
      details: 'STRIPE_SECRET_KEY environment variable is not set'
    });
  }

  try {
    const { zip, items } = req.body;
    
    // Calculate total savings for display
    const totalSavings = items.reduce((sum, item) => sum + (item.retail - item.price), 0);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `TurboSearch+ Access for ZIP ${zip}`,
              description: `Unlock ${items.length} hidden deals worth $${totalSavings.toFixed(2)} in savings`,
              images: ['https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=TurboSearch+'],
            },
            unit_amount: 1, // $0.01 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&zip=${zip}`,
      cancel_url: `${req.headers.origin}/dashboard?zip=${zip}`,
      metadata: {
        zip: zip,
        items: JSON.stringify(items),
        totalSavings: totalSavings.toString(),
      },
      customer_email: 'demo@turbosearch.com', // Demo email
      allow_promotion_codes: true,
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}

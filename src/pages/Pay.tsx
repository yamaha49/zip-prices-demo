import { useNavigate, useSearchParams } from 'react-router-dom'
import { trackPurchase } from '../analytics'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function Pay() {
  const [params] = useSearchParams()
  const zip = params.get('zip') ?? ''
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 0, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  async function handlePay() {
    if (!zip) return;
    
    setLoading(true);
    
    try {
      // Get items for this ZIP (you might want to pass this from dashboard)
      const response = await fetch(`/api/items?zip=${zip}`);
      const data = await response.json();
      const items = data.data?.items || [];

      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zip, items }),
      });

      const { url } = await checkoutResponse.json();
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Fallback to demo mode
      sessionStorage.setItem('unlockedZip', zip);
      localStorage.setItem('unlockedZip', zip);
      trackPurchase(zip, 0.01);
      navigate(`/thank-you?zip=${encodeURIComponent(zip)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full px-6 py-10 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Unlock Your ZIP {zip} Deals</h1>
          <p className="text-xl text-blue-200">Get instant access to hidden clearance items worth $1,000s</p>
        </motion.div>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-red-600 text-white p-4 rounded-xl mb-6 text-center font-semibold"
        >
          ⚡ LIMITED TIME: Only 47 spots left for ZIP {zip} ⚡
          <div className="mt-2 text-sm">
            Deal expires in: <span className="font-bold text-yellow-300">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          {/* Price */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-white mb-2">$0.01</div>
            <div className="text-xl text-green-300 line-through">$49.99</div>
            <div className="text-sm text-blue-200 mt-2">One-time access fee • Cancel anytime</div>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">✓</div>
              <span>Unblur all items in ZIP {zip} (normally $49.99)</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">✓</div>
              <span>Real-time inventory updates & price alerts</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">✓</div>
              <span>Priority support & exclusive deals</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">✓</div>
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-white text-sm">
                <span className="font-semibold">4,847 people</span> unlocked deals in the last 24 hours
              </div>
            </div>
            <div className="text-xs text-blue-200">
              "Saved $2,847 on Home Depot clearance items!" - Sarah M., ZIP 90210
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={handlePay}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              '🔓 Unlock All Deals for $0.01'
            )}
          </motion.button>

          {/* Trust Signals */}
          <div className="mt-6 text-center">
            <div className="flex justify-center items-center gap-4 text-xs text-blue-200 mb-4">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>SSL Secured</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>30-Day Guarantee</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>⚡</span>
                <span>Instant Access</span>
              </div>
            </div>
            
            {/* Security badges */}
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="text-xs text-white/60">Trusted by 5,000+ users</div>
              <div className="text-xs text-white/60">•</div>
              <div className="text-xs text-white/60">Stripe powered</div>
            </div>
            
            <p className="mt-3 text-xs text-white/60">Demo checkout: no real payment processed</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}



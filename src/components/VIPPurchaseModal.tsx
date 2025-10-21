import { useState } from 'react'
import { motion } from 'framer-motion'

interface VIPPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan: (plan: string, billing: 'monthly' | 'yearly') => void
}

export function VIPPurchaseModal({ isOpen, onClose, onSelectPlan }: VIPPurchaseModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      id: 'premium',
      name: 'PREMIUM',
      monthlyPrice: 49.99,
      yearlyPrice: 19.99,
      originalPrice: 247.00,
      savings: 80,
      features: [
        'Daily Reselling Opportunities',
        'Clearance Software (Walmart, Target, Home Depot)',
        'Automatic Checkout Service',
        'Weekly Live Calls',
        'Community Access'
      ],
      popular: false
    },
    {
      id: 'vip',
      name: 'VIP',
      monthlyPrice: 74.99,
      yearlyPrice: 29.99,
      originalPrice: 447.00,
      savings: 83,
      features: [
        'Everything in Premium',
        'Home Depot Penny AI Software',
        '+2 Extra Clearance Stores (Lowe\'s, Sam\'s Club)',
        'Upgraded Clearance Software',
        'Exclusive VIP Ranking'
      ],
      popular: true,
      spotsLeft: 2
    },
    {
      id: 'elite',
      name: 'ELITE',
      monthlyPrice: 99.99,
      yearlyPrice: 39.99,
      originalPrice: 747.00,
      savings: 87,
      features: [
        'Everything in VIP',
        'Amazon Reselling Sourcing Software',
        'Exclusive Amazon Course',
        '1 on 1 Demo Call',
        'Exclusive Elite Ranking'
      ],
      popular: false
    }
  ]

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-black/70 backdrop-blur-2xl rounded-3xl p-8 max-w-6xl w-full border border-purple-400/30 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-white/70 text-lg">Unlock exclusive deals and premium features</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/50 rounded-full p-1 border border-purple-400/30">
            <div className="flex">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  billing === 'monthly' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  billing === 'yearly' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Savings Banner */}
        {billing === 'yearly' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-400 font-bold">SAVE UP TO 58% WITH YEARLY</span>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                plan.popular 
                  ? 'border-purple-400 bg-purple-500/10' 
                  : 'border-white/20 bg-black/40'
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    SAVE {plan.savings}%
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                
                <div className="mb-2">
                  <span className="text-white/50 line-through text-lg">
                    ${plan.originalPrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-white">
                  ${billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  <span className="text-lg text-white/70">/{billing === 'yearly' ? 'month' : 'month'}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => onSelectPlan(plan.id, billing)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Join with card
              </motion.button>

              {plan.spotsLeft && (
                <div className="text-center mt-3">
                  <span className="text-orange-400 text-sm flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.05 6.05 0 003 11a7 7 0 1011.95-4.95c-.592-1.965-.84-3.133-.84-4.87a1 1 0 00-1.555-.832z" clipRule="evenodd" />
                    </svg>
                    Only {plan.spotsLeft} VIP spots left!
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

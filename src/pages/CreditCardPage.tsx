import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export function CreditCardPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const plan = params.get('plan') || 'vip'
  const billing = params.get('billing') || 'monthly'
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required'
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Invalid card number'
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date'
    }
    
    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required'
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'Invalid CVC'
    }
    
    if (!formData.cardholderName) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    
    if (!formData.streetAddress) {
      newErrors.streetAddress = 'Street address is required'
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required'
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required'
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Store card info and unlock access
    localStorage.setItem('cardLinked', 'true')
    localStorage.setItem('selectedPlan', plan)
    localStorage.setItem('billingCycle', billing)
    localStorage.setItem('cardLast4', formData.cardNumber.slice(-4))
    
    // Trigger custom storage event to update VIP status in other components
    window.dispatchEvent(new CustomEvent('customStorageChange'))
    
    // Navigate back to dashboard with unlocked access and preserve ZIP code
    const currentZip = params.get('zip') || '33130'
    navigate(`/dashboard?zip=${currentZip}&unlocked=true`)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-black/70 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full border border-purple-400/30 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Link Your Card</h1>
            <p className="text-white/70">Complete your VIP membership setup</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Card Information</h3>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="•••• •••• •••• ••••"
                  className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setFormData(prev => ({ ...prev, cardNumber: formatted }))
                  }}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Expiration Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value)
                      setFormData(prev => ({ ...prev, expiryDate: formatted }))
                    }}
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="•••"
                    className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    maxLength={4}
                  />
                  {errors.cvc && (
                    <p className="text-red-400 text-sm mt-1">{errors.cvc}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                />
                {errors.cardholderName && (
                  <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Billing Address</h3>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="123 Main St"
                  className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                />
                {errors.streetAddress && (
                  <p className="text-red-400 text-sm mt-1">{errors.streetAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Miami"
                  className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="FL"
                    className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                    value={formData.state}
                    onChange={handleInputChange}
                    maxLength={2}
                  />
                  {errors.state && (
                    <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="33130"
                    className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                  {errors.zipCode && (
                    <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <motion.button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Link Card
                  </>
                )}
              </motion.button>
            </div>

            {/* Security Notice */}
            <div className="text-center pt-4">
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

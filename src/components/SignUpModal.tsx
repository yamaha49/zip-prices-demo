import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUp: (email: string, zip: string) => void
}

export function SignUpModal({ isOpen, onClose, onSignUp }: SignUpModalProps) {
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !zip || !captchaValue) return
    
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSignUp(email, zip)
    setLoading(false)
  }

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-black/90 backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Try Demo Mode</h2>
          <p className="text-white/70 text-sm">Enter your email and zip code to access the demo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email (Gmail, Yahoo, Outlook, etc.)"
              className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-green-400 focus:outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="ZIP Code"
              className="w-full px-4 py-3 bg-black/50 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-green-400 focus:outline-none transition-colors"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              maxLength={5}
              required
            />
          </div>

          {/* reCAPTCHA Section */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key - replace with your actual key
              onChange={handleCaptchaChange}
              theme="dark"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email || !zip || !captchaValue}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Access Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        <p className="text-white/60 text-xs mt-4 text-center">
          By entering your email, you will get demo access plus updates and special offers from TurboSearch. You can unsubscribe anytime.
        </p>

        <div className="text-center mt-4">
          <span className="text-white/60 text-sm">Already have an account? </span>
          <a href="#" className="text-green-400 hover:underline text-sm">Log in here</a>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

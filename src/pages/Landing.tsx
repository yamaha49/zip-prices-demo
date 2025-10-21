import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendEvent } from '../analytics'
import { motion } from 'framer-motion'
import { ScanModal } from '../components/ScanModal'

export function Landing() {
  const navigate = useNavigate()
  const [zip, setZip] = useState('')
  const [showScanning, setShowScanning] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zip) {
      sendEvent('zip_submit', { zip_code: zip })
      setShowScanning(true)
    }
  }

  const handleScanComplete = () => {
    setShowScanning(false)
    navigate(`/dashboard?zip=${zip}`)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background with flowing lines and glows - fills entire screen */}
      <div className="fixed inset-0 w-full h-full">
        {/* Top-left purple glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl"></div>
        {/* Center-bottom blue glow */}
        <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/25 rounded-full blur-3xl"></div>
        {/* Right side purple glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        {/* Flowing lines that span the entire screen */}
        <div className="absolute inset-0 w-full h-full">
          {/* Main blue line - bottom to top curve */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 opacity-70"></div>
          {/* Curved purple line - top right */}
          <div className="absolute top-20 right-0 w-[800px] h-1 bg-gradient-to-l from-purple-400 to-transparent opacity-50 transform rotate-12"></div>
          {/* Additional flowing line - center */}
          <div className="absolute top-1/2 left-0 w-[600px] h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-blue-400 opacity-40 transform rotate-6"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-xl font-bold text-white">EMONEY</span>
        </div>
        <div className="text-white/70 text-sm">
          Deals near you
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-6">
            Find deals for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">a penny</span> in your ZIP.
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Enter your ZIP to see what's popping near you. No distractions, just results.
          </p>

          {/* ZIP Input Form - Smaller and more centered */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-sm mx-auto mb-8"
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Zip Code"
                className="flex-1 px-4 py-3 text-base bg-black/50 border border-purple-400/50 rounded-lg focus:border-purple-400 focus:outline-none transition-colors text-white placeholder-white/60 backdrop-blur-sm"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                maxLength={5}
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg text-base shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </motion.button>
            </div>
            <p className="text-white/60 text-sm mt-2">US ZIP codes only.</p>
          </motion.form>
        </motion.div>
      </main>

        {/* Scan Modal */}
        <ScanModal
          isOpen={showScanning}
          zipCode={zip}
          onComplete={handleScanComplete}
        />

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          <p className="text-sm">© 2024 eMoney. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
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
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
      {/* Background image collage with dark overlay - Full Screen */}
      <div className="fixed inset-0 w-full h-full">
        {/* Grid of product images */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 opacity-40">
          {Array.from({ length: 48 }).map((_, i) => {
            const images = [
              '11.jpg', '123.jpg', '21.png', '22.jpg', '222.png', '22222.jpg',
              '32.png', '33.png', '34.jpg', '43.jpg', '432432.jpg', '43432.png',
              '44.png', '444.jpg', '453.png', '543.jpg', '5432.jpg', '55.jpg',
              '55.png', '6.jpg', '6543.jpg', '666.jpg', '6754.jpg'
            ];
            const img = images[i % images.length];
            return (
              <div 
                key={i} 
                className="aspect-square bg-cover bg-center rounded"
                style={{ backgroundImage: `url(/goods/${img})` }}
              />
            );
          })}
        </div>
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/85 to-[#0a0a0f]/95"></div>
        
        {/* Purple glows */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Main 1150px Container */}
      <div className="relative z-10 w-full max-w-[1150px] mx-auto px-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-5">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-lg font-bold text-white">EMONEY</span>
          </motion.button>
        </header>

        {/* Main Content - Centered */}
        <main className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[800px] mx-auto"
          >
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
              Find deals for <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">wild markdowns</span> in your <span className="text-white">ZIP</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm md:text-base text-gray-400 mb-10 mx-auto font-light">
              Enter your ZIP to see what's popping near you. No distractions, just results.
            </p>

            {/* ZIP Input Form */}
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-3"
            >
              <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-center">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter US ZIP (e.g., 33101)"
                    className="w-full sm:w-[340px] px-5 py-3.5 text-sm bg-black/70 border-2 border-purple-500/50 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder-gray-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:from-purple-600 hover:via-purple-700 hover:to-pink-600 text-white font-semibold py-3.5 px-8 rounded-xl text-sm shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
              <p className="text-gray-500 text-xs mt-2.5">US ZIP codes only.</p>
            </motion.form>

            {/* Bottom Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2.5 justify-center mt-6 mx-auto"
            >
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs">
                Real people finding penny deals
              </span>
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs">
                Shelving, tools, home goods & more
              </span>
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs">
                Results vary by ZIP — check yours
              </span>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Scan Modal */}
      <ScanModal
        isOpen={showScanning}
        zipCode={zip}
        onComplete={handleScanComplete}
      />
    </div>
  )
}
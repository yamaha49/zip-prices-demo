import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScanModalProps {
  isOpen: boolean
  zipCode: string
  onComplete: () => void
}

export function ScanModal({ isOpen, zipCode, onComplete }: ScanModalProps) {
  const [progress, setProgress] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [foundDeals, setFoundDeals] = useState(0)
  
  // Mock product images for preview
  const productImages = [
    '/goods/11.jpg', '/goods/123.jpg', '/goods/21.png', '/goods/22.jpg',
    '/goods/222.png', '/goods/32.png', '/goods/33.png', '/goods/34.jpg',
    '/goods/43.jpg', '/goods/432432.jpg', '/goods/44.png', '/goods/444.jpg'
  ]

  const steps = [
    { 
      text: "Connecting to stores...", 
      color: "from-blue-500 via-cyan-500 to-blue-600",
      speed: 0.5 // Slower start
    },
    { 
      text: "Scanning inventory...", 
      color: "from-purple-500 via-pink-500 to-purple-600",
      speed: 1.8 // Fast scanning
    },
    { 
      text: "Finding deals...", 
      color: "from-orange-500 via-yellow-500 to-orange-600",
      speed: 1.2 // Medium speed
    },
    { 
      text: "Finalizing results...", 
      color: "from-green-500 via-emerald-500 to-green-600",
      speed: 0.7 // Slowing down to finish
    }
  ]

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setDisplayProgress(0)
      setCurrentStep(0)
      setFoundDeals(0)
      return
    }

    const updateInterval = 16 // ~60fps for smooth animation
    let currentProgress = 0
    let velocity = 0
    let displayValue = 0
    
    const interval = setInterval(() => {
      // Determine current phase and target speed
      let stepIndex = 0
      if (currentProgress >= 75) stepIndex = 3
      else if (currentProgress >= 50) stepIndex = 2
      else if (currentProgress >= 25) stepIndex = 1
      
      const currentPhaseSpeed = steps[stepIndex].speed
      
      // Base progress per step, adjusted by phase speed
      const baseProgressPerStep = (100 / 2500) * updateInterval
      const targetVelocity = baseProgressPerStep * currentPhaseSpeed
      
      // Smooth acceleration/deceleration (easing)
      velocity += (targetVelocity - velocity) * 0.08
      
      currentProgress += velocity
      
      // Smooth number display with easing (follows progress naturally)
      const displayEasing = 0.15 * currentPhaseSpeed // Display speed matches phase speed
      displayValue += (currentProgress - displayValue) * displayEasing
      
      if (currentProgress >= 100) {
        setProgress(100)
        setDisplayProgress(100)
        clearInterval(interval)
        setTimeout(onComplete, 300)
      } else {
        setProgress(currentProgress)
        setDisplayProgress(displayValue)
      }

      // Update step based on progress
      setCurrentStep(stepIndex)

      // Simulate finding deals as progress increases (proportional to progress)
      const dealsFound = Math.floor((currentProgress / 100) * 48)
      setFoundDeals(dealsFound)
    }, updateInterval)

    return () => {
      clearInterval(interval)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Purple glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Flowing gradient lines */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60"></div>
        <div className="absolute top-3/4 right-0 w-3/4 h-0.5 bg-gradient-to-l from-transparent via-blue-400 to-transparent opacity-40 transform rotate-12"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-black/60 backdrop-blur-2xl rounded-2xl p-8 max-w-xl w-full mx-4 border border-purple-400/30 shadow-2xl"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-sm"></div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-purple-400/40 animate-pulse"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-3 text-center">
            Scanning {zipCode}...
          </h2>
          
          {/* Progress Bar with Color Phases - Thin and Refined */}
          <div className="mb-3">
            <div className="w-full bg-gray-900/50 rounded-full h-2.5 overflow-hidden shadow-inner border border-purple-500/20">
              <div
                className={`h-full bg-gradient-to-r ${steps[currentStep].color} relative will-change-[width]`}
                style={{ 
                  width: `${progress}%`,
                  transition: 'background-image 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 12px ${currentStep === 0 ? 'rgba(59, 130, 246, 0.5)' : currentStep === 1 ? 'rgba(168, 85, 247, 0.5)' : currentStep === 2 ? 'rgba(249, 115, 22, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`
                }}
              >
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    style={{
                      animation: 'shimmer 1.5s infinite linear',
                      transform: 'translateX(-100%) skewX(-12deg)'
                    }}
                  ></div>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
              </div>
            </div>
          </div>

          {/* Percentage Display - Dynamic Speed */}
          <div className="text-center mb-4 bg-black/30 rounded-lg py-2 px-4 inline-block mx-auto w-auto" style={{ display: 'block' }}>
            <div className="flex items-center justify-center gap-2">
              <span 
                className="text-white font-black text-3xl tabular-nums tracking-tight"
                style={{
                  transition: 'transform 80ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: Math.round(displayProgress) !== Math.round(displayProgress - 1) ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {Math.round(displayProgress)}%
              </span>
              <span className="text-white/60 text-sm font-medium">complete</span>
            </div>
          </div>

          {/* Product Preview Strip */}
          <div className="mb-4">
            <AnimatePresence>
              {foundDeals > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <motion.p
                        key={foundDeals}
                        initial={{ scale: 1.2, color: '#fbbf24' }}
                        animate={{ scale: 1, color: '#fcd34d' }}
                        className="text-lg font-bold text-yellow-300 uppercase"
                      >
                        {foundDeals} DEALS FOUND
                      </motion.p>
                      <span className="text-xs text-white/60">Scanning...</span>
                    </div>
                    
                    {/* Product Preview Horizontal Strip - Shows 3.5 items */}
                    <div className="relative overflow-hidden h-28">
                      <div className="flex gap-3 h-full">
                        {productImages.slice(0, Math.min(foundDeals, 12)).map((img, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8, x: -30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ 
                              delay: index * 0.03,
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                            className="flex-shrink-0 rounded-lg overflow-hidden border-2 border-purple-400/40 bg-black/60 shadow-xl hover:scale-105 transition-transform duration-200"
                            style={{ width: 'calc(28.57% - 8.57px)' }} // 3.5 items visible (100% / 3.5 ≈ 28.57%)
                          >
                            <img 
                              src={img} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Fade out edge effect on the right to show "more items" */}
                      {foundDeals > 3 && (
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-purple-900/80 to-transparent pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Status Messages */}
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white text-center font-medium"
              >
                {steps[currentStep].text}
              </motion.p>
            </AnimatePresence>
            <p className="text-white/60 text-sm text-center">
              This won't take long.
            </p>
          </div>
          
          {/* Step Indicators with Speed Visual */}
          <div className="mt-6">
            <div className="flex justify-center space-x-2 mb-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 relative ${
                    i === currentStep 
                      ? 'w-8 bg-gradient-to-r ' + step.color
                      : i < currentStep
                      ? 'w-4 bg-green-500/80'
                      : 'w-4 bg-gray-700'
                  }`}
                >
                  {/* Pulse effect on active step */}
                  {i === currentStep && (
                    <div 
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        background: `linear-gradient(to right, ${i === 0 ? '#3b82f6, #06b6d4' : i === 1 ? '#a855f7, #ec4899' : i === 2 ? '#f97316, #facc15' : '#22c55e, #10b981'})`,
                        opacity: 0.5
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* Speed Indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full">
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => {
                    const speedLevel = steps[currentStep].speed
                    const isActive = speedLevel > 0.5 + (i * 0.4)
                    return (
                      <div
                        key={i}
                        className={`w-1 h-3 rounded-full transition-all duration-200 ${
                          isActive ? 'bg-gradient-to-t ' + steps[currentStep].color : 'bg-gray-700'
                        }`}
                        style={{
                          height: isActive ? `${8 + i * 4}px` : '12px',
                          opacity: isActive ? 1 : 0.3
                        }}
                      />
                    )
                  })}
                </div>
                <span className="text-xs text-white/60 font-medium">
                  {steps[currentStep].speed < 0.8 ? 'Slow' : steps[currentStep].speed > 1.5 ? 'Fast' : 'Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

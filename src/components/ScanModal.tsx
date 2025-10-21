import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScanModalProps {
  isOpen: boolean
  zipCode: string
  onComplete: () => void
}

export function ScanModal({ isOpen, zipCode, onComplete }: ScanModalProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    "Checking live prices...",
    "Scanning inventory...",
    "Analyzing deals...",
    "Finalizing results..."
  ]

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
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
        className="relative bg-black/60 backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-400/30 shadow-2xl"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-sm"></div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-purple-400/40 animate-pulse"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Scanning {zipCode}...
          </h2>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full relative"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </motion.div>
            </div>
            <div className="text-center mt-2">
              <span className="text-white/60 text-sm">{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Status Messages */}
          <div className="space-y-2">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-center font-medium"
            >
              {steps[currentStep]}
            </motion.p>
            <p className="text-white/60 text-sm text-center">
              This won't take long.
            </p>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-6 space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

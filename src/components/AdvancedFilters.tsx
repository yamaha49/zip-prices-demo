import { useState } from 'react'
import { motion } from 'framer-motion'

interface AdvancedFiltersProps {
  filters: {
    priceRange: [number, number]
    categories: string[]
    stores: string[]
    scoreRange: [number, number]
    inStock: boolean
    dateRange: string | null
    minRetailPrice: number
    maxRetailPrice: number
    minSavingsPercent: number
    dealAge: string
  }
  onFiltersChange: (filters: any) => void
}

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const [localMinRetail, setLocalMinRetail] = useState(filters.minRetailPrice || 0)

  const handleMinRetailChange = (value: number) => {
    setLocalMinRetail(value)
    onFiltersChange({ ...filters, minRetailPrice: value })
  }

  const handleMaxRetailChange = (value: number) => {
    onFiltersChange({ ...filters, maxRetailPrice: value })
  }

  return (
    <div className="space-y-6">
      {/* Minimum Retail Price Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-900/30 backdrop-blur-xl border border-purple-400/50 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Minimum Retail Price</h3>
          <span className="text-pink-400 font-bold text-lg">${localMinRetail}+</span>
        </div>
        
        <div className="relative">
          {/* Slider Track */}
          <div className="w-full h-2 bg-cyan-400 rounded-full relative">
            {/* Slider Handle */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black border-2 border-pink-400 rounded-full cursor-pointer shadow-lg"
              style={{ left: `${(localMinRetail / 279) * 100}%` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDrag={(e, info) => {
                const target = e.currentTarget as HTMLElement
                const rect = target.parentElement?.getBoundingClientRect()
                if (rect) {
                  const percentage = Math.max(0, Math.min(100, (info.point.x - rect.left) / rect.width * 100))
                  const value = Math.round((percentage / 100) * 279)
                  handleMinRetailChange(value)
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          
          {/* Range Labels */}
          <div className="flex justify-between mt-3 text-white text-sm">
            <span>$0</span>
            <span>$50</span>
            <span>$100</span>
            <span>$279</span>
          </div>
        </div>
      </motion.div>

      {/* Maximum Retail Price Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-purple-900/30 backdrop-blur-xl border border-purple-400/50 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Maximum Retail Price</h3>
          <span className="text-pink-400 font-bold text-lg">${filters.maxRetailPrice || 1000}+</span>
        </div>
        
        <div className="relative">
          {/* Slider Track */}
          <div className="w-full h-2 bg-cyan-400 rounded-full relative">
            {/* Slider Handle */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black border-2 border-pink-400 rounded-full cursor-pointer shadow-lg"
              style={{ left: `${((filters.maxRetailPrice || 1000) / 1000) * 100}%` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDrag={(e, info) => {
                const target = e.currentTarget as HTMLElement
                const rect = target.parentElement?.getBoundingClientRect()
                if (rect) {
                  const percentage = Math.max(0, Math.min(100, (info.point.x - rect.left) / rect.width * 100))
                  const value = Math.round((percentage / 100) * 1000)
                  handleMaxRetailChange(value)
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          
          {/* Range Labels */}
          <div className="flex justify-between mt-3 text-white text-sm">
            <span>$0</span>
            <span>$250</span>
            <span>$500</span>
            <span>$1000</span>
          </div>
        </div>
      </motion.div>

      {/* Savings Percentage Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-purple-900/30 backdrop-blur-xl border border-purple-400/50 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Minimum Savings %</h3>
          <span className="text-pink-400 font-bold text-lg">{filters.minSavingsPercent || 0}%+</span>
        </div>
        
        <div className="relative">
          {/* Slider Track */}
          <div className="w-full h-2 bg-cyan-400 rounded-full relative">
            {/* Slider Handle */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black border-2 border-pink-400 rounded-full cursor-pointer shadow-lg"
              style={{ left: `${((filters.minSavingsPercent || 0) / 100) * 100}%` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDrag={(e, info) => {
                const target = e.currentTarget as HTMLElement
                const rect = target.parentElement?.getBoundingClientRect()
                if (rect) {
                  const percentage = Math.max(0, Math.min(100, (info.point.x - rect.left) / rect.width * 100))
                  const value = Math.round((percentage / 100) * 100)
                  onFiltersChange({ ...filters, minSavingsPercent: value })
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          
          {/* Range Labels */}
          <div className="flex justify-between mt-3 text-white text-sm">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </motion.div>

      {/* Deal Age Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-purple-900/30 backdrop-blur-xl border border-purple-400/50 rounded-xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Deal Age</h3>
        <div className="space-y-3">
          {[
            { label: 'Last 24 Hours', value: '24h' },
            { label: 'Last 3 Days', value: '3d' },
            { label: 'Last Week', value: '1w' },
            { label: 'Last Month', value: '1m' },
            { label: 'All Time', value: 'all' }
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="dealAge"
                value={option.value}
                checked={filters.dealAge === option.value}
                onChange={(e) => onFiltersChange({ ...filters, dealAge: e.target.value })}
                className="w-4 h-4 text-purple-500 border-white/30 bg-white/10 focus:ring-purple-500"
              />
              <span className="text-white/80">{option.label}</span>
            </label>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

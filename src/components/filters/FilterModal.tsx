import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  stores: string[]
  scoreRange: [number, number]
  inStock: boolean
  dateRange: string | null
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

export function FilterModal({ isOpen, onClose, onApplyFilters, currentFilters }: FilterModalProps) {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(currentFilters)

  useEffect(() => {
    setTempFilters(currentFilters)
  }, [currentFilters])

  const handleApply = () => {
    onApplyFilters(tempFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priceRange: [0, 1000],
      categories: [],
      stores: [],
      scoreRange: [0, 100],
      inStock: false,
      dateRange: null
    }
    setTempFilters(resetFilters)
  }

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...tempFilters.priceRange]
    newRange[index] = value
    setTempFilters({ ...tempFilters, priceRange: newRange })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter(c => c !== category)
      : [...tempFilters.categories, category]
    setTempFilters({ ...tempFilters, categories: newCategories })
  }

  const handleStoreToggle = (store: string) => {
    const newStores = tempFilters.stores.includes(store)
      ? tempFilters.stores.filter(s => s !== store)
      : [...tempFilters.stores, store]
    setTempFilters({ ...tempFilters, stores: newStores })
  }

  const handleScoreRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...tempFilters.scoreRange]
    newRange[index] = value
    setTempFilters({ ...tempFilters, scoreRange: newRange })
  }

  if (!isOpen) return null

  const categories = ['Electronics', 'Tools', 'Appliances', 'Home & Garden', 'Automotive', 'Sports']
  const stores = ['Home Depot', 'Walmart', 'Target', 'Lowe\'s', 'Sam\'s Club']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="max-w-2xl w-full rounded-2xl border border-purple-400/60 bg-black/95 backdrop-blur-2xl p-6 relative shadow-2xl text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-1"
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">Advanced Filters</h2>

        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Price Range</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                className="w-24 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                value={tempFilters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
              />
              <span className="text-white/60">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-24 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                value={tempFilters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10"
                  />
                  <span className="text-white/80 text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stores */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Stores</label>
            <div className="grid grid-cols-2 gap-2">
              {stores.map((store) => (
                <label key={store} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.stores.includes(store)}
                    onChange={() => handleStoreToggle(store)}
                    className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10"
                  />
                  <span className="text-white/80 text-sm">{store}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Score Range */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">PennyAI Score</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                className="w-24 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                value={tempFilters.scoreRange[0]}
                onChange={(e) => handleScoreRangeChange(0, Number(e.target.value))}
              />
              <span className="text-white/60">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-24 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                value={tempFilters.scoreRange[1]}
                onChange={(e) => handleScoreRangeChange(1, Number(e.target.value))}
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tempFilters.inStock}
                onChange={(e) => setTempFilters({ ...tempFilters, inStock: e.target.checked })}
                className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10"
              />
              <span className="text-white/80">Show only items in stock</span>
            </label>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Date Range</label>
            <select
              value={tempFilters.dateRange || ''}
              onChange={(e) => setTempFilters({ ...tempFilters, dateRange: e.target.value || null })}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
            >
              <option value="">Any time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <motion.button
            onClick={handleReset}
            className="flex-1 py-3 px-6 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300 border border-white/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset
          </motion.button>
          <motion.button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Apply Filters
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

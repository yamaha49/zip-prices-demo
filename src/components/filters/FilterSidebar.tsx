import { useState } from 'react'
import { motion } from 'framer-motion'

interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  stores: string[]
  scoreRange: [number, number]
  inStock: boolean
  dateRange: string | null
}

interface FilterSidebarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  isOpen: boolean
  onClose: () => void
}

export function FilterSidebar({ filters, onFiltersChange, onClearFilters, isOpen, onClose }: FilterSidebarProps) {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters)

  const handleQuickFilter = (type: string) => {
    let newFilters = { ...tempFilters }
    
    switch (type) {
      case 'priceUnder10':
        newFilters.priceRange = [0, 10]
        break
      case 'priceUnder50':
        newFilters.priceRange = [0, 50]
        break
      case 'highScore':
        newFilters.scoreRange = [90, 100]
        break
      case 'inStock':
        newFilters.inStock = !newFilters.inStock
        break
      case 'today':
        newFilters.dateRange = 'today'
        break
    }
    
    setTempFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter(c => c !== category)
      : [...tempFilters.categories, category]
    
    const newFilters = { ...tempFilters, categories: newCategories }
    setTempFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleStoreToggle = (store: string) => {
    const newStores = tempFilters.stores.includes(store)
      ? tempFilters.stores.filter(s => s !== store)
      : [...tempFilters.stores, store]
    
    const newFilters = { ...tempFilters, stores: newStores }
    setTempFilters(newFilters)
    onFiltersChange(newFilters)
  }

  if (!isOpen) return null

  const categories = ['Electronics', 'Tools', 'Appliances', 'Home & Garden', 'Automotive']
  const stores = ['Home Depot', 'Walmart', 'Target', 'Lowe\'s']

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed left-0 top-0 h-full w-80 bg-black/95 backdrop-blur-2xl border-r border-purple-400/30 z-40 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Filters</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Quick Filters</h4>
          <div className="space-y-2">
            <motion.button
              onClick={() => handleQuickFilter('priceUnder10')}
              className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Under $10
            </motion.button>
            <motion.button
              onClick={() => handleQuickFilter('priceUnder50')}
              className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Under $50
            </motion.button>
            <motion.button
              onClick={() => handleQuickFilter('highScore')}
              className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              High Score (90+)
            </motion.button>
            <motion.button
              onClick={() => handleQuickFilter('inStock')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                tempFilters.inStock 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              In Stock Only
            </motion.button>
            <motion.button
              onClick={() => handleQuickFilter('today')}
              className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Today's Deals
            </motion.button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Categories</h4>
          <div className="space-y-2">
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
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Stores</h4>
          <div className="space-y-2">
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

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Price Range</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="flex-1 px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 text-sm focus:border-purple-400 focus:outline-none"
              value={tempFilters.priceRange[0]}
              onChange={(e) => {
                const newFilters = { ...tempFilters, priceRange: [Number(e.target.value), tempFilters.priceRange[1]] as [number, number] }
                setTempFilters(newFilters)
                onFiltersChange(newFilters)
              }}
            />
            <span className="text-white/60 text-sm">to</span>
            <input
              type="number"
              placeholder="Max"
              className="flex-1 px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 text-sm focus:border-purple-400 focus:outline-none"
              value={tempFilters.priceRange[1]}
              onChange={(e) => {
                const newFilters = { ...tempFilters, priceRange: [tempFilters.priceRange[0], Number(e.target.value)] as [number, number] }
                setTempFilters(newFilters)
                onFiltersChange(newFilters)
              }}
            />
          </div>
        </div>

        {/* Score Range */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">PennyAI Score</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="flex-1 px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 text-sm focus:border-purple-400 focus:outline-none"
              value={tempFilters.scoreRange[0]}
              onChange={(e) => {
                const newFilters = { ...tempFilters, scoreRange: [Number(e.target.value), tempFilters.scoreRange[1]] as [number, number] }
                setTempFilters(newFilters)
                onFiltersChange(newFilters)
              }}
            />
            <span className="text-white/60 text-sm">to</span>
            <input
              type="number"
              placeholder="Max"
              className="flex-1 px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 text-sm focus:border-purple-400 focus:outline-none"
              value={tempFilters.scoreRange[1]}
              onChange={(e) => {
                const newFilters = { ...tempFilters, scoreRange: [tempFilters.scoreRange[0], Number(e.target.value)] as [number, number] }
                setTempFilters(newFilters)
                onFiltersChange(newFilters)
              }}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <motion.button
          onClick={onClearFilters}
          className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors border border-red-500/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Clear All Filters
        </motion.button>
      </div>
    </motion.div>
  )
}

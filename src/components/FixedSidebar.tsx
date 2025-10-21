import { useState } from 'react'
import { motion } from 'framer-motion'

interface FixedSidebarProps {
  filters: {
    priceRange: [number, number]
    categories: string[]
    stores: string[]
    scoreRange: [number, number]
    inStock: boolean
    dateRange: string | null
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export function FixedSidebar({ filters, onFiltersChange, onClearFilters }: FixedSidebarProps) {
  const [quickFilters, setQuickFilters] = useState({
    under10: false,
    under50: false,
    highScore: false,
    inStock: false,
    todayDeals: false
  })

  const handleQuickFilter = (filter: string) => {
    const newQuickFilters = { ...quickFilters, [filter]: !quickFilters[filter as keyof typeof quickFilters] }
    setQuickFilters(newQuickFilters)

    // Apply quick filter logic
    let newFilters = { ...filters }
    
    if (filter === 'under10') {
      newFilters.priceRange = newQuickFilters.under10 ? [0, 10] : [0, 1000]
    } else if (filter === 'under50') {
      newFilters.priceRange = newQuickFilters.under50 ? [0, 50] : [0, 1000]
    } else if (filter === 'highScore') {
      newFilters.scoreRange = newQuickFilters.highScore ? [90, 100] : [0, 100]
    } else if (filter === 'inStock') {
      newFilters.inStock = newQuickFilters.inStock
    }

    onFiltersChange(newFilters)
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleStoreChange = (store: string) => {
    const newStores = filters.stores.includes(store)
      ? filters.stores.filter(s => s !== store)
      : [...filters.stores, store]
    
    onFiltersChange({ ...filters, stores: newStores })
  }

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number]
    newPriceRange[index] = value
    onFiltersChange({ ...filters, priceRange: newPriceRange })
  }

  const handleScoreRangeChange = (index: number, value: number) => {
    const newScoreRange = [...filters.scoreRange] as [number, number]
    newScoreRange[index] = value
    onFiltersChange({ ...filters, scoreRange: newScoreRange })
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full w-80 bg-black/95 backdrop-blur-2xl border-r border-purple-400/30 shadow-2xl z-40 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button
            onClick={onClearFilters}
            className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Filters */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Filters</h3>
          <div className="space-y-2">
            {[
              { key: 'under10', label: 'Under $10' },
              { key: 'under50', label: 'Under $50' },
              { key: 'highScore', label: 'High Score (90+)' },
              { key: 'inStock', label: 'In Stock Only' },
              { key: 'todayDeals', label: 'Today\'s Deals' }
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => handleQuickFilter(filter.key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                  quickFilters[filter.key as keyof typeof quickFilters]
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-3">
            {['Tools', 'Appliances', 'Home & Garden', 'Electronics', 'Automotive'].map((category) => (
              <label key={category} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10 focus:ring-purple-500"
                />
                <span className="text-white/80">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stores */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stores</h3>
          <div className="space-y-3">
            {['Home Depot', 'Walmart', 'Target', 'Lowe\'s'].map((store) => (
              <label key={store} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.stores.includes(store)}
                  onChange={() => handleStoreChange(store)}
                  className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10 focus:ring-purple-500"
                />
                <span className="text-white/80">{store}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
              placeholder="Min"
            />
            <span className="text-white/60">to</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 1000)}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
              placeholder="Max"
            />
          </div>
        </div>

        {/* PennyAI Score */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">PennyAI Score</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.scoreRange[0]}
              onChange={(e) => handleScoreRangeChange(0, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
              placeholder="Min"
            />
            <span className="text-white/60">to</span>
            <input
              type="number"
              value={filters.scoreRange[1]}
              onChange={(e) => handleScoreRangeChange(1, parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
              placeholder="Max"
            />
          </div>
        </div>

      </div>
    </motion.div>
  )
}

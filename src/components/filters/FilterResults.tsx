import { motion } from 'framer-motion'

interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  stores: string[]
  scoreRange: [number, number]
  inStock: boolean
  dateRange: string | null
}

interface FilterResultsProps {
  filters: FilterOptions
  totalItems: number
  filteredItems: number
  onClearFilters: () => void
}

export function FilterResults({ filters, totalItems, filteredItems, onClearFilters }: FilterResultsProps) {
  const hasActiveFilters = () => {
    return (
      filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ||
      filters.categories.length > 0 ||
      filters.stores.length > 0 ||
      filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100 ||
      filters.inStock ||
      filters.dateRange !== null
    )
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++
    if (filters.categories.length > 0) count++
    if (filters.stores.length > 0) count++
    if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) count++
    if (filters.inStock) count++
    if (filters.dateRange !== null) count++
    return count
  }

  const getFilterSummary = () => {
    const parts = []
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      parts.push(`$${filters.priceRange[0]} - $${filters.priceRange[1]}`)
    }
    
    if (filters.categories.length > 0) {
      parts.push(`${filters.categories.length} categories`)
    }
    
    if (filters.stores.length > 0) {
      parts.push(`${filters.stores.length} stores`)
    }
    
    if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) {
      parts.push(`Score ${filters.scoreRange[0]}-${filters.scoreRange[1]}`)
    }
    
    if (filters.inStock) {
      parts.push('In stock only')
    }
    
    if (filters.dateRange) {
      parts.push(filters.dateRange)
    }
    
    return parts.join(' • ')
  }

  if (!hasActiveFilters()) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">
              {totalItems} items found
            </span>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              All Items
            </span>
          </div>
          <div className="text-white/60 text-sm">
            No filters applied
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">
              {filteredItems} of {totalItems} items
            </span>
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {getActiveFilterCount()} filters
            </span>
          </div>
        </div>
        
        <motion.button
          onClick={onClearFilters}
          className="text-white/60 hover:text-white transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
        >
          Clear all
        </motion.button>
      </div>
      
      <div className="mt-2">
        <p className="text-white/60 text-sm">
          {getFilterSummary()}
        </p>
      </div>
    </motion.div>
  )
}

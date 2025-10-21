import { useState } from 'react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search products, brands, stores..." }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-6 max-w-4xl mx-auto shadow-xl relative overflow-hidden"
    >
      {/* Flashing light effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent flash-light"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full px-4 py-3 pl-12 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none transition-all duration-300 ${
                isFocused 
                  ? 'border-purple-400 shadow-lg shadow-purple-400/20' 
                  : 'border-white/30'
              }`}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </motion.button>
        </div>
        
        {/* Search suggestions */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-white/5 rounded-lg p-3"
          >
            <div className="text-white/60 text-sm mb-2">Quick searches:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchQuery('under $10')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Under $10
              </button>
              <button
                onClick={() => setSearchQuery('high score')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                High Score
              </button>
              <button
                onClick={() => setSearchQuery('electronics')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Electronics
              </button>
              <button
                onClick={() => setSearchQuery('tools')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Tools
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

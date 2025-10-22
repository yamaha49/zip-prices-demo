import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { trackViewDashboard } from '../analytics'
import { motion } from 'framer-motion'
import data from '../sample-data.json'
import { SignUpModal } from '../components/SignUpModal'
import { VIPPurchaseModal } from '../components/VIPPurchaseModal'
import { ScanModal } from '../components/ScanModal'

type Item = {
  id: string
  title: string
  price: number
  retail: number
  score: number
  stock: number
  store: string
  imageUrl: string
  brand?: string
  location?: string
  aisle?: string
  date?: string
  sku?: string
  upc?: string
  barcode?: string
}

export function Dashboard() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const zip = params.get('zip') ?? '00000'
  const [showModal, setShowModal] = useState<null | Item>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showVIPModal, setShowVIPModal] = useState(false)
  const [showScanModal, setShowScanModal] = useState(false)
  const [vipStatus, setVipStatus] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newZip, setNewZip] = useState(zip)
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [showCheckingModal, setShowCheckingModal] = useState(false)
  const [checkingCities, setCheckingCities] = useState<string[]>([])
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [checkingComplete, setCheckingComplete] = useState(false)

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/items?zip=${zip}`)
        const result = await response.json()
        
        if (result.success) {
          setItems(result.data.items)
        } else {
          // Fallback to local data - use exact ZIP match only
          const exact = (data as any)[zip] as Item[] | undefined
          if (exact && exact.length) {
            setItems(exact)
          } else {
            // If no exact match, show empty array instead of random items
            setItems([])
          }
        }
      } catch (error) {
        console.error('Error fetching items:', error)
        // Fallback to local data - use exact ZIP match only
        const exact = (data as any)[zip] as Item[] | undefined
        if (exact && exact.length) {
          setItems(exact)
        } else {
          // If no exact match, show empty array instead of random items
          setItems([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [zip])

  const unlocked = (typeof window !== 'undefined') && (
    sessionStorage.getItem('unlockedZip') === zip || 
    localStorage.getItem('unlockedZip') === zip ||
    localStorage.getItem('cardLinked') === 'true' ||
    params.get('unlocked') === 'true'
  )

  // Check if user has completed VIP registration
  const hasCompletedVIP = (typeof window !== 'undefined') && localStorage.getItem('cardLinked') === 'true'

  // Monitor VIP status changes
  useEffect(() => {
    const checkVIPStatus = () => {
      const isVIP = localStorage.getItem('cardLinked') === 'true'
      console.log('Checking VIP status:', isVIP)
      setVipStatus(isVIP)
    }
    
    checkVIPStatus()
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cardLinked') {
        console.log('Storage change detected for cardLinked:', e.newValue)
        checkVIPStatus()
      }
    }
    
    // Listen for custom storage events (same tab)
    const handleCustomStorageChange = () => {
      console.log('Custom storage change detected')
      checkVIPStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('customStorageChange', handleCustomStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('customStorageChange', handleCustomStorageChange)
    }
  }, [])

  // Debug logging
  useEffect(() => {
    console.log('Unlock status:', {
      unlocked,
      hasCompletedVIP,
      vipStatus,
      zip,
      sessionZip: sessionStorage.getItem('unlockedZip'),
      localZip: localStorage.getItem('unlockedZip'),
      cardLinked: localStorage.getItem('cardLinked'),
      urlUnlocked: params.get('unlocked')
    })
  }, [unlocked, hasCompletedVIP, vipStatus, zip])

  useEffect(() => {
    window.scrollTo(0, 0)
    trackViewDashboard(zip, items.length)
    
    // Check VIP status when component mounts or ZIP changes
    const isVIP = localStorage.getItem('cardLinked') === 'true'
    setVipStatus(isVIP)
    console.log('Dashboard mounted/updated, VIP status:', isVIP)
    
    // Also check if we're coming from credit card page with unlocked=true
    if (params.get('unlocked') === 'true') {
      console.log('Coming from credit card page, setting VIP status to true')
      setVipStatus(true)
    }
  }, [zip, items.length, params])

  // Get cities based on ZIP code
  const getCitiesByZip = (zipCode: string): string[] => {
    const cityMap: Record<string, string[]> = {
      '33130': ['Miami', 'Coral Gables', 'Coconut Grove', 'Brickell'],
      '92592': ['Temecula', 'Murrieta', 'Vista', 'Oceanside'],
      '92025': ['Escondido', 'San Marcos', 'Vista', 'Carlsbad'],
      '10001': ['New York', 'Manhattan', 'Brooklyn', 'Queens'],
      '90210': ['Beverly Hills', 'West Hollywood', 'Santa Monica', 'Culver City'],
      '60601': ['Chicago', 'Evanston', 'Oak Park', 'Naperville'],
      '94102': ['San Francisco', 'Oakland', 'Berkeley', 'Daly City'],
      // Default cities for any other ZIP
      'default': ['Your Area', 'Nearby Locations', 'Local Stores', 'Surrounding Cities']
    }
    return cityMap[zipCode] || cityMap['default']
  }

  // Cycle through cities when checking modal is shown
  useEffect(() => {
    if (!showCheckingModal) {
      setCurrentCityIndex(0)
      setCheckingComplete(false)
      return
    }

    const cities = getCitiesByZip(zip)
    setCheckingCities(cities)
    
    const cityInterval = setInterval(() => {
      setCurrentCityIndex(prev => {
        if (prev >= cities.length - 1) {
          clearInterval(cityInterval)
          setCheckingComplete(true)
          // After showing "Items found!", wait a bit then show VIP modal
          setTimeout(() => {
            setShowCheckingModal(false)
            if (!unlocked) {
              setShowSignUpModal(true)
            } else {
              setShowVIPModal(true)
            }
          }, 1500)
          return prev
        }
        return prev + 1
      })
    }, 800) // Change city every 800ms

    return () => clearInterval(cityInterval)
  }, [showCheckingModal, zip, unlocked])

  // Apply search when items or search change
  useEffect(() => {
    const filtered = applySearch(items, searchQuery)
    setFilteredItems(filtered)
  }, [items, searchQuery])


  const handleSignUp = (email: string, zipCode: string) => {
    // Store sign-up data
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('unlockedZip', zipCode)
    setShowSignUpModal(false)
    // Show VIP purchase modal
    setShowVIPModal(true)
  }

  const handleVIPPlanSelect = (plan: string, billing: 'monthly' | 'yearly') => {
    setShowVIPModal(false)
    // Navigate to credit card page with ZIP code
    navigate(`/credit-card?plan=${plan}&billing=${billing}&zip=${zip}`)
  }

  const handleScanComplete = () => {
    setShowScanModal(false)
    // Items are already loaded, just show them
  }

  // Simple search logic
  const applySearch = (items: Item[], searchTerm: string = '') => {
    if (!searchTerm) return items
    
    const searchLower = searchTerm.toLowerCase()
    return items.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.store.toLowerCase().includes(searchLower) ||
      (item.brand && item.brand.toLowerCase().includes(searchLower)) ||
      item.id.toLowerCase().includes(searchLower)
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleZipChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newZip && newZip !== zip) {
      navigate(`/dashboard?zip=${newZip}`)
    }
  }


  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleUnsubscribe = () => {
    // Clear all VIP-related data
    localStorage.removeItem('cardLinked')
    localStorage.removeItem('unlockedZip')
    localStorage.removeItem('selectedPlan')
    localStorage.removeItem('billingCycle')
    localStorage.removeItem('cardLast4')
    sessionStorage.removeItem('unlockedZip')
    sessionStorage.removeItem('userEmail')
    
    // Update VIP status immediately
    setVipStatus(false)
    
    // Trigger custom storage event to update VIP status in other components
    window.dispatchEvent(new CustomEvent('customStorageChange'))
    
    // Navigate to dashboard without refresh to maintain state
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

      {/* Main Content Area - Full width without sidebar */}
      <div className="relative z-10 px-3 sm:px-4 md:px-6 pb-20">
        {/* Header - Fully Responsive */}
        <header className="py-4 sm:py-5 md:py-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {/* Logo Section */}
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-none">EMONEY</span>
                <span className="text-[10px] sm:text-xs text-white/60 leading-none mt-0.5">Deals near you</span>
              </div>
            </motion.button>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {!unlocked && (
                <motion.button
                  onClick={() => setShowSignUpModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden sm:inline">🚀 Upgrade</span>
                  <span className="sm:hidden">🚀</span>
                </motion.button>
              )}
              
              {vipStatus && (
                <motion.button
                  onClick={handleUnsubscribe}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden sm:inline">Unsubscribe</span>
                  <span className="sm:hidden">Logout</span>
                </motion.button>
              )}
            </div>
          </div>
        </header>

        {/* ZIP Code Input Section - Fully Responsive */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="mx-4 sm:mx-auto bg-gradient-to-br from-[#2a1a4a] to-[#1a0f2e] backdrop-blur-xl border border-purple-500/40 rounded-3xl p-4 sm:p-5 md:p-6 max-w-md shadow-2xl shadow-purple-500/20 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            
            {/* Glow effect */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 text-center relative z-10">Enter Your ZIP Code</h2>
            
            <form onSubmit={handleZipChange} className="space-y-2.5 sm:space-y-3 relative z-10">
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="10001"
                  className="flex-1 min-w-0 px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 text-sm sm:text-base md:text-lg font-medium bg-[#0f0a1a] border border-purple-500/30 rounded-xl sm:rounded-2xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 text-white placeholder-white/40"
                  value={newZip}
                  onChange={(e) => setNewZip(e.target.value)}
                  maxLength={5}
                />
                <motion.button
                  type="submit"
                  className="flex-shrink-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white/50 text-[10px] sm:text-xs">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="leading-tight">ZIP code locked until 11/18/2025</span>
              </div>
            </form>
          </div>
        </div>

        {/* Search Bar - Fully Responsive */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="bg-gradient-to-br from-slate-900/50 to-black/50 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 max-w-2xl mx-auto shadow-xl">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products, brands, stores..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base bg-black/50 border border-white/30 rounded-xl sm:rounded-2xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 text-white placeholder-white/40"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <motion.button
                onClick={() => handleSearch(searchQuery)}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg shadow-purple-500/50 hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="hidden sm:inline">Search</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Results - Fully Responsive */}
        <div className="bg-gradient-to-br from-slate-900/40 to-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6 max-w-[1150px] mx-auto shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-white font-semibold text-sm sm:text-base">
                {filteredItems.length} items found
              </span>
              {searchQuery && (
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  "{searchQuery}"
                </span>
              )}
            </div>
            {searchQuery && (
              <motion.button
                onClick={handleClearSearch}
                className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors self-start sm:self-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕ Clear Search
              </motion.button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="bg-black/50 border border-purple-400/50 rounded-xl p-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <div className="text-white font-semibold">Loading exclusive deals...</div>
                  <div className="text-white/60 text-sm">Scanning {zip} for hidden savings</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
                      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-[1150px] mx-auto px-4">
                        {filteredItems.map((item) => (
              <article
                key={item.id}
                className="product-card group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#16162a] to-[#0a0a15] border border-white/10 shadow-2xl hover:border-purple-500/40 transition-all duration-300 flex flex-col cursor-pointer w-full"
                onClick={() => {
                  if (unlocked) {
                    navigate(`/product?id=${item.id}&zip=${zip}`)
                  } else {
                    setShowSignUpModal(true)
                  }
                }}
              >
                {/* Top Section: Image + Product Info (Side by Side) */}
                <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 grid grid-cols-[35%_1fr] gap-2 sm:gap-3">
                  {/* Product Image in White Box */}
                  <div className={`relative bg-white rounded-xl p-2 sm:p-2.5 flex items-center justify-center aspect-square ${!unlocked ? 'filter blur-[6px]' : ''}`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-contain transition-all duration-500" 
                    />
                  </div>

                  {/* Product Info (Brand, Title, Price) */}
                  <div className="flex flex-col justify-between py-1">
                    {/* Brand & Title */}
                    <div className="flex-1">
                      <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-normal text-white/80 mb-1 leading-tight">
                        {item.brand || 'Generic'}
                      </h3>
                      
                      {/* Product Title */}
                      <p className="text-[9px] sm:text-[10px] md:text-[11px] text-white font-medium line-clamp-3 leading-[1.3]">
                        {item.title}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-base sm:text-lg md:text-xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent leading-none">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 line-through leading-none">
                        ${item.retail.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Middle Section: Store, Location, Found */}
                <div className="px-3 sm:px-4 py-2">
                  {/* Store Badge */}
                  <div className="mb-2">
                    <span className="inline-block bg-black/70 text-white px-2.5 sm:px-3 py-1 rounded-md text-[9px] sm:text-[10px] md:text-xs font-medium">
                      {item.store}
                    </span>
                  </div>

                  {/* Location Tags - Horizontal Scroll Pills */}
                  <div className="mb-2 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-1.5 pb-1">
                      {item.location && item.location
                        .replace(/\s*\(\d+\.?\d*\s*mi\)/gi, '') // Remove mile distance like "(2.4 mi)"
                        .split(',')
                        .map((loc, i) => {
                          const cleanLoc = loc.trim()
                          return cleanLoc && (
                            <span key={i} className="inline-block whitespace-nowrap bg-[#1a1a2e] text-gray-300 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-normal">
                              {cleanLoc}
                            </span>
                          )
                        })}
                    </div>
                  </div>

                  {/* Items Found */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-xs sm:text-sm font-semibold">{item.stock} Found</span>
                  </div>
                </div>
 
                {/* Bottom Section: Barcode, SKU, UPC */}
                <div className="px-3 sm:px-4 py-3">
                  {/* Barcode with SVG */}
                  <div className="rounded-lg bg-black p-2.5">
                    <div className={`relative w-full overflow-hidden rounded bg-black mb-2 ${!unlocked ? 'filter blur-[6px]' : ''}`} style={{height: '70px'}}>
                      <svg className="h-full w-full" viewBox="0 0 222 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                        <rect x="0" y="0" width="222" height="80" fill="#000000" />
                        
                        {/* Start Guard */}
                        <g transform="translate(0, 0)" fill="#ffffff">
                          <text style={{font: '11px monospace'}} textAnchor="start" x="0" y="76">8</text>
                        </g>
                        <g transform="translate(18, 5)" fill="#ffffff">
                          <rect x="0" y="0" width="2" height="60" />
                          <rect x="4" y="0" width="2" height="60" />
                          <rect x="8" y="0" width="4" height="60" />
                          <rect x="14" y="0" width="6" height="60" />
                        </g>
                        
                        {/* First Group of Digits */}
                        <g transform="translate(40, 5)" fill="#ffffff">
                          <rect x="2" y="0" width="4" height="54" />
                          <rect x="8" y="0" width="6" height="54" />
                          <rect x="16" y="0" width="8" height="54" />
                          <rect x="26" y="0" width="2" height="54" />
                          <rect x="30" y="0" width="8" height="54" />
                          <rect x="40" y="0" width="2" height="54" />
                          <rect x="44" y="0" width="4" height="54" />
                          <rect x="54" y="0" width="2" height="54" />
                          <rect x="60" y="0" width="4" height="54" />
                          <rect x="68" y="0" width="2" height="54" />
                          <text style={{font: '11px monospace'}} textAnchor="middle" x="35" y="71">
                            {item.upc ? item.upc.slice(1, 6).padStart(5, '0') : '49278'}
                          </text>
                        </g>
                        
                        {/* Middle Guard */}
                        <g transform="translate(112, 5)" fill="#ffffff">
                          <rect x="2" y="0" width="2" height="60" />
                          <rect x="6" y="0" width="2" height="60" />
                        </g>
                        
                        {/* Second Group of Digits */}
                        <g transform="translate(122, 5)" fill="#ffffff">
                          <rect x="0" y="0" width="2" height="54" />
                          <rect x="6" y="0" width="2" height="54" />
                          <rect x="14" y="0" width="2" height="54" />
                          <rect x="20" y="0" width="6" height="54" />
                          <rect x="28" y="0" width="2" height="54" />
                          <rect x="34" y="0" width="6" height="54" />
                          <rect x="42" y="0" width="4" height="54" />
                          <rect x="50" y="0" width="4" height="54" />
                          <rect x="56" y="0" width="4" height="54" />
                          <rect x="62" y="0" width="4" height="54" />
                          <text style={{font: '11px monospace'}} textAnchor="middle" x="35" y="71">
                            {item.upc ? item.upc.slice(6, 11).padStart(5, '0') : '01659'}
                          </text>
                        </g>
                        
                        {/* End Guard */}
                        <g transform="translate(194, 5)" fill="#ffffff">
                          <rect x="0" y="0" width="6" height="60" />
                          <rect x="8" y="0" width="2" height="60" />
                          <rect x="14" y="0" width="2" height="60" />
                          <rect x="18" y="0" width="2" height="60" />
                        </g>
                        <g transform="translate(216, 0)" fill="#ffffff">
                          <text style={{font: '11px monospace'}} textAnchor="end" x="6" y="76">9</text>
                        </g>
                      </svg>
                    </div>
                    
                    {/* SKU Pill */}
                    {item.sku && (
                      <div className="w-full text-center mb-1.5">
                        <span className="inline-block bg-transparent border-0 text-white px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-normal">
                          SKU: {item.sku}
                        </span>
                      </div>
                    )}
                    
                    {/* UPC Pill */}
                    {item.upc && (
                      <div className="w-full text-center">
                        <span className="inline-block bg-transparent border-0 text-white px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-normal">
                          UPC: {item.upc.padStart(13, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* GET DEAL Button */}
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 mt-auto">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Button clicked, unlocked:', unlocked, 'hasCompletedVIP:', hasCompletedVIP, 'vipStatus:', vipStatus)
                      // Always show the checking animation first
                      setShowCheckingModal(true)
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 uppercase tracking-wide"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    GET DEAL
                  </motion.button>
                </div>

                {/* Lock Overlay for Non-Registered Users */}
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
                    <div className="text-center pointer-events-none px-4">
                      <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xl animate-pulse">
                        <svg className="w-7 sm:w-8 h-7 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-white text-sm sm:text-base font-bold mb-3">🔒 Locked</p>
                      
                      {/* Beautiful Click to Unlock Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowSignUpModal(true)
                        }}
                        className="pointer-events-auto relative inline-flex items-center justify-center px-5 sm:px-6 py-2 overflow-hidden font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full shadow-lg group whitespace-nowrap"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-40 group-hover:h-40 opacity-10"></span>
                        <span className="relative flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          Click to Unlock
                        </span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </article>
                      ))}
                      </section>
        )}

        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
              className="max-w-md w-full rounded-2xl border border-purple-400/60 bg-black/95 backdrop-blur-2xl p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setShowModal(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-1"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">Unlock the store & aisle</h3>
                <p className="text-white/80 text-sm mb-6">
                  These deals move fast. Upgrade to VIP to reveal store, aisle, and live stock for your ZIP.
                </p>
                
                <motion.button 
                  onClick={() => navigate(`/pay?zip=${encodeURIComponent(zip)}`)} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl text-base shadow-lg transition-all duration-300 border border-purple-400/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upgrade to VIP
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Checking Cities Loading Modal */}
        {showCheckingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative bg-gradient-to-br from-purple-900/50 to-black rounded-3xl p-12 max-w-md w-full border border-purple-400/30 shadow-2xl"
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
              </div>

              <div className="relative z-10 text-center">
                {!checkingComplete ? (
                  <>
                    {/* Scanning Animation */}
                    <motion.div
                      className="mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="w-20 h-20 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white mb-4">Checking...</h2>
                    
                    {/* City Name Display with Animation */}
                    <motion.div
                      key={currentCityIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4"
                    >
                      <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {checkingCities[currentCityIndex] || 'Loading...'}
                      </p>
                    </motion.div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                      {checkingCities.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index <= currentCityIndex ? 'bg-purple-400' : 'bg-gray-600'
                          }`}
                          animate={index === currentCityIndex ? { scale: [1, 1.5, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success State */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="mb-6"
                    >
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-3xl font-bold text-white mb-2"
                    >
                      Items Found! ✅
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-purple-300 text-lg"
                    >
                      Preparing exclusive deals...
                    </motion.p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Sign Up Modal */}
        <SignUpModal
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          onSignUp={handleSignUp}
        />

        {/* VIP Purchase Modal */}
        <VIPPurchaseModal
          isOpen={showVIPModal}
          onClose={() => setShowVIPModal(false)}
          onSelectPlan={handleVIPPlanSelect}
        />

        {/* Scan Modal */}
        <ScanModal
          isOpen={showScanModal}
          zipCode={zip}
          onComplete={handleScanComplete}
        />
      </div>
    </div>
  )
}
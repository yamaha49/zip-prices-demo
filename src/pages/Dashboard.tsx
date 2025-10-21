import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { trackViewDashboard } from '../analytics'
import { motion } from 'framer-motion'
import data from '../sample-data.json'
import { SignUpModal } from '../components/SignUpModal'
import { VIPPurchaseModal } from '../components/VIPPurchaseModal'
import { ScanModal } from '../components/ScanModal'
import { UserProfile } from '../components/profile/UserProfile'
import { SearchBar } from '../components/SearchBar'

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
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [user, setUser] = useState({
    id: 'user_123',
    email: 'demo@turbosearch.com',
    name: 'Demo User',
    zipCode: zip,
    joinDate: '2024-01-15',
    totalSavings: 2847.50,
    totalPurchases: 12,
    vipStatus: vipStatus,
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsAlerts: false
    }
  })

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
      <div className="relative z-10 px-6 pb-20">
        {/* Header */}
        <header className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-white">EMONEY</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white/70 text-sm">
              Deals near you
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setShowUserProfile(true)}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border border-green-400/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                👤 Profile
              </motion.button>
            </div>
            {vipStatus && (
              <motion.button
                onClick={handleUnsubscribe}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Unsubscribe
              </motion.button>
            )}
          </div>
        </header>

        {/* ZIP Code Input Section - Glass-like effect with flashing */}
        <div className="mb-4 flex justify-center">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 max-w-xs w-full shadow-2xl relative overflow-hidden flash-border">
            {/* Flashing light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent flash-light"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 flash-light"></div>

            <h2 className="text-sm font-bold text-white mb-2 text-center relative z-10">Enter Your ZIP Code</h2>
            <form onSubmit={handleZipChange} className="flex gap-2 relative z-10">
              <input
                type="text"
                placeholder="Zip Code"
                className="flex-1 px-2 py-1.5 text-xs bg-white/10 border border-white/30 rounded-lg focus:border-purple-400 focus:outline-none transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
                maxLength={5}
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden flash-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Flashing button effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent flash-light"></div>
                <span className="relative z-10">Search</span>
              </motion.button>
            </form>
            <p className="text-white/50 text-xs mt-1 text-center relative z-10">ZIP code locked until 11/18/2025</p>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search products, brands, stores..."
        />

        {/* Search Results */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">
                {filteredItems.length} items found
              </span>
              {searchQuery && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
            {searchQuery && (
              <motion.button
                onClick={handleClearSearch}
                className="text-white/70 hover:text-white text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Search
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
                      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
                        {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-black/60 backdrop-blur-xl border border-purple-400/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                console.log('Card clicked, unlocked:', unlocked, 'hasCompletedVIP:', hasCompletedVIP, 'vipStatus:', vipStatus)
                console.log('localStorage cardLinked:', localStorage.getItem('cardLinked'))
                if (unlocked || vipStatus) {
                  // Navigate to product page
                  console.log('Navigating to product page:', item.id, 'zip:', zip)
                  navigate(`/product?id=${item.id}&zip=${zip}`)
                } else {
                  // Show sign-up modal
                  console.log('Showing sign-up modal')
                  setShowSignUpModal(true)
                }
              }}
            >
              {/* Hot Deal Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">HOT</span>
              </div>

              <div className="relative group cursor-pointer">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className={`w-full aspect-square object-cover transition-all duration-500 ${(unlocked || vipStatus) ? 'filter-none' : 'filter blur-lg brightness-50 saturate-150'}`} 
                />
                {!(unlocked || vipStatus) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/90 via-purple-900/80 to-black/90 backdrop-blur-md group-hover:from-black/95 group-hover:via-purple-800/90 group-hover:to-black/95 transition-all duration-300">
                    <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xl animate-pulse group-hover:animate-bounce">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-white text-base font-bold mb-1 group-hover:text-yellow-300 transition-colors duration-300">🔒 Premium Content Locked</p>
                      <p className="text-white/90 text-sm mb-2 group-hover:text-white transition-colors duration-300">Sign up to reveal this amazing deal!</p>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                        Click to Unlock
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-2">
                <h3 className="text-xs font-bold text-white mb-1 line-clamp-2 leading-tight">
                  {item.brand ? `${item.brand} ` : ''}{item.title}
                </h3>
                
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-purple-400">${item.price.toFixed(2)}</span>
                    <span className="text-xs text-white/50 line-through">Retail: ${item.retail.toFixed(2)}</span>
                  </div>
                </div>

                {/* Save Amount */}
                <div className="mb-1">
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    Save ${(item.retail - item.price).toFixed(2)}
                  </span>
                </div>

                {/* Score and Stock */}
                <div className="flex items-center justify-between mb-1">
                  <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                    Score: {item.score.toFixed(1)}
                  </span>
                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    Stock: {item.stock}
                  </span>
                </div>

                {/* Date */}
                {item.date && (
                  <div className="text-xs text-white/60 mb-1">
                    {item.date}
                  </div>
                )}

                {/* Location */}
                {item.location && (
                  <div className="text-xs text-white/60 mb-1">
                    {item.location}
                  </div>
                )}

                {/* Aisle */}
                {item.aisle && (
                  <div className="text-xs text-white/60 mb-1">
                    {item.aisle}
                  </div>
                )}

                {/* Barcode */}
                {item.barcode && (
                  <div className="text-center mb-1">
                    <div className="text-xs text-white/40 font-mono">{item.barcode}</div>
                  </div>
                )}

                {/* SKU and UPC */}
                <div className="flex justify-between text-xs">
                  {item.sku && (
                    <span className="bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded text-xs">
                      SKU: {item.sku}
                    </span>
                  )}
                  {item.upc && (
                    <span className="bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded text-xs">
                      UPC: {item.upc}
                    </span>
                  )}
                </div>
              </div>
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
                
                <div className="flex flex-col gap-3">
                  <motion.button 
                    onClick={() => navigate(`/pay?zip=${encodeURIComponent(zip)}`)} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl text-base shadow-lg transition-all duration-300 border border-purple-400/50"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Upgrade to VIP
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowModal(null)} 
                    className="w-full py-3 px-6 rounded-xl bg-black/60 text-white/80 hover:bg-black/80 transition-all duration-300 border border-purple-400/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Maybe later
                  </motion.button>
                </div>
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

        {/* User Profile Modal */}
        <UserProfile
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          user={user}
          onUpdateUser={setUser}
        />
      </div>
    </div>
  )
}
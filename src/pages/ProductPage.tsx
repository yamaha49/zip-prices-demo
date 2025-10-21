import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

type Product = {
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

export function ProductPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const productId = params.get('id')
  const zip = params.get('zip')
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [vipStatus, setVipStatus] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const handleUnsubscribe = () => {
    // Clear all VIP-related data
    localStorage.removeItem('cardLinked')
    localStorage.removeItem('unlockedZip')
    localStorage.removeItem('selectedPlan')
    localStorage.removeItem('billingCycle')
    localStorage.removeItem('cardLast4')
    sessionStorage.removeItem('unlockedZip')
    sessionStorage.removeItem('userEmail')
    
    // Trigger custom storage event to update VIP status in other components
    window.dispatchEvent(new CustomEvent('customStorageChange'))
    
    // Navigate back to dashboard with current ZIP
    const currentZip = zip || '33130'
    navigate(`/dashboard?zip=${currentZip}`)
  }

  useEffect(() => {
    if (!productId) {
      navigate('/dashboard')
      return
    }

    // Check registration status
    const isVIP = localStorage.getItem('cardLinked') === 'true'
    const isUnlocked = sessionStorage.getItem('unlockedZip') === zip || params.get('unlocked') === 'true'
    setVipStatus(isVIP)
    setUnlocked(isUnlocked)

    // Simulate fetching product details
    const fetchProduct = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock product data
      const mockProduct: Product = {
        id: productId,
        title: "8-In-1 Compact Multi-Bit Screwdriver",
        price: 0.01,
        retail: 16.07,
        score: 49.0,
        stock: 3,
        store: "Home Depot",
        imageUrl: "/goods/11.jpg",
        brand: "Milwaukee",
        location: "Auburn (opelika) #816: Opelika, AL (2.4 mi)",
        aisle: "Aisle 5 - Bay 13",
        date: "Sep 10 at 11:53 AM",
        sku: "1009492990",
        upc: "0045242630530",
        barcode: "0 45242 63053 0"
      }
      
      setProduct(mockProduct)
      setLoading(false)
    }

    fetchProduct()
  }, [productId, navigate, zip, params])

  const handleBuyNow = () => {
    // Navigate to checkout or payment
    navigate(`/pay?product=${productId}&zip=${zip}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Product not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => {
              console.log('Logo clicked, navigating to landing page')
              navigate('/')
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-white">EMONEY</span>
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="text-white/70 text-sm">
              Deals near you
            </div>
            <motion.button
              onClick={handleUnsubscribe}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Unsubscribe
            </motion.button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group cursor-pointer">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className={`w-full h-96 object-cover rounded-2xl border border-purple-400/30 transition-all duration-500 ${(unlocked || vipStatus) ? '' : 'filter blur-sm'}`}
                />
                {!(unlocked || vipStatus) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 via-purple-900/50 to-black/60 backdrop-blur-sm group-hover:from-black/70 group-hover:via-purple-800/60 group-hover:to-black/70 transition-all duration-300 rounded-2xl">
                    <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse group-hover:animate-bounce">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-white text-lg font-bold mb-2 group-hover:text-yellow-300 transition-colors duration-300">🔒 Premium Product Locked</p>
                      <p className="text-white/90 text-sm mb-3 group-hover:text-white transition-colors duration-300">Sign up to reveal this amazing deal!</p>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                        Click to Unlock
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === 0 ? 'border-purple-400' : 'border-transparent'
                  }`}
                >
                  <img src={product.imageUrl} alt="Thumbnail 1" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setSelectedImage(1)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === 1 ? 'border-purple-400' : 'border-transparent'
                  }`}
                >
                  <img src="/goods/123.jpg" alt="Thumbnail 2" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => setSelectedImage(2)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === 2 ? 'border-purple-400' : 'border-transparent'
                  }`}
                >
                  <img src="/goods/21.png" alt="Thumbnail 3" className="w-full h-full object-cover" />
                </button>
                <button className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center text-white text-xs">
                  +6 images
                </button>
              </div>

              {/* Product Information Tabs */}
              <div className="flex border-b border-white/20">
                <button className="px-4 py-2 text-white border-b-2 border-purple-400">About</button>
                <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">Need To Know Info</button>
                <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">Where To Redeem</button>
                <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">Reviews</button>
              </div>

              {/* Product Description */}
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Professional-grade multi-bit screwdriver with precision engineering. Perfect for DIY projects and professional use.
                </p>
                <p className="text-white/60 text-sm">
                  This versatile tool features 8 different bit types in a compact, easy-to-carry design. Made with high-quality materials for durability and precision. The ergonomic handle provides comfortable grip during extended use. Ideal for home improvement, electronics repair, and general maintenance tasks.
                </p>
              </div>
            </div>

            {/* Right Column - Purchase Options */}
            <div className="space-y-6">
              {/* Promotional Banner */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-center">
                <div className="text-white font-bold text-lg">Extra $2.8 off</div>
                <div className="text-white/80 text-sm">Promo HALLOWEEN ends in: 10:51:25</div>
                <div className="text-white/60 text-xs mt-1">EMONEY reserves the right to end the promo at any time</div>
              </div>

              {/* Gift Option */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="gift" className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10" />
                <label htmlFor="gift" className="text-white text-sm">Buy as a gift</label>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Deal Options */}
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="deal" id="deal1" className="w-4 h-4 text-purple-500" defaultChecked />
                      <label htmlFor="deal1" className="text-white font-semibold">Single Item Purchase</label>
                    </div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 line-through">${product.retail.toFixed(2)}</span>
                      <span className="text-green-400 font-bold">-30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-lg font-bold">${product.price.toFixed(2)}</span>
                      <span className="text-white/60 text-sm">130+ bought</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-white/60 text-sm">With code HALLOWEEN:</span>
                      <span className="text-purple-400 font-bold">${(product.price * 0.7).toFixed(2)}</span>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs transition-colors">
                        Apply
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-white w-8 text-center">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy Now Button */}
              <motion.button
                onClick={handleBuyNow}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy now
              </motion.button>

              {/* Product Details */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 space-y-3">
                <h3 className="text-white font-bold">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Brand:</span>
                    <span className="text-white">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Store:</span>
                    <span className="text-white">{product.store}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Location:</span>
                    <span className="text-white">{product.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Aisle:</span>
                    <span className="text-white">{product.aisle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">SKU:</span>
                    <span className="text-white">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">UPC:</span>
                    <span className="text-white">{product.upc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

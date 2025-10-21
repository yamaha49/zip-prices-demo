import { motion } from 'framer-motion'

interface Purchase {
  id: string
  date: string
  item: string
  store: string
  originalPrice: number
  paidPrice: number
  savings: number
  status: 'completed' | 'pending' | 'cancelled'
}

interface PurchaseHistoryProps {
  purchases: Purchase[]
}

export function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-black'
      case 'cancelled':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'pending':
        return '⏳'
      case 'cancelled':
        return '❌'
      default:
        return '❓'
    }
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
        <p className="text-white/60">Your purchase history will appear here once you start buying deals.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Purchase History</h3>
        <div className="text-white/60 text-sm">
          {purchases.length} {purchases.length === 1 ? 'purchase' : 'purchases'}
        </div>
      </div>

      <div className="space-y-3">
        {purchases.map((purchase) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-white">{purchase.item}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(purchase.status)}`}>
                    {getStatusIcon(purchase.status)} {purchase.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
                  <span>🏪 {purchase.store}</span>
                  <span>📅 {formatDate(purchase.date)}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-white/80">
                    Original: <span className="line-through">${purchase.originalPrice.toFixed(2)}</span>
                  </span>
                  <span className="text-white/80">
                    Paid: <span className="text-green-400 font-semibold">${purchase.paidPrice.toFixed(2)}</span>
                  </span>
                  <span className="text-green-400 font-semibold">
                    Saved: ${purchase.savings.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${purchase.savings.toFixed(2)}
                </div>
                <div className="text-white/60 text-sm">
                  {((purchase.savings / purchase.originalPrice) * 100).toFixed(1)}% off
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {purchases.length}
            </div>
            <div className="text-white/60 text-sm">Total Purchases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              ${purchases.reduce((sum, p) => sum + p.savings, 0).toFixed(2)}
            </div>
            <div className="text-white/60 text-sm">Total Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {purchases.length > 0 ? (purchases.reduce((sum, p) => sum + p.savings, 0) / purchases.length).toFixed(0) : 0}%
            </div>
            <div className="text-white/60 text-sm">Avg. Discount</div>
          </div>
        </div>
      </div>
    </div>
  )
}

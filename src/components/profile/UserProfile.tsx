import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface User {
  id: string
  email: string
  name: string
  zipCode: string
  joinDate: string
  totalSavings: number
  totalPurchases: number
  vipStatus: boolean
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    smsAlerts: boolean
  }
}

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onUpdateUser: (user: User) => void
}

export function UserProfile({ isOpen, onClose, user, onUpdateUser }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zipCode: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        zipCode: user.zipCode
      })
    }
  }, [user])

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...formData
      }
      onUpdateUser(updatedUser)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        zipCode: user.zipCode
      })
    }
    setIsEditing(false)
  }

  if (!isOpen || !user) return null

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
        className="max-w-4xl w-full rounded-2xl border border-purple-400/60 bg-black/95 backdrop-blur-2xl p-6 relative shadow-2xl text-white"
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

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <h2 className="text-xl font-bold mb-4">My Account</h2>
            
            <motion.button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              👤 Profile
            </motion.button>
            
            <motion.button
              onClick={() => setActiveTab('history')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'history' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              📋 Purchase History
            </motion.button>
            
            <motion.button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              ⚙️ Settings
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Profile Information</h3>
                  {!isEditing && (
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        maxLength={5}
                        className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white">{user.zipCode}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">Total Savings</h4>
                      <p className="text-2xl font-bold text-green-400">${user.totalSavings.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">Total Purchases</h4>
                      <p className="text-2xl font-bold text-purple-400">{user.totalPurchases}</p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save Changes
                      </motion.button>
                      <motion.button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Purchase History</h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">VIP Subscription</h4>
                        <p className="text-white/60 text-sm">Premium Plan - Monthly</p>
                        <p className="text-white/60 text-sm">Purchased on {user.joinDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">$49.99</p>
                        <p className="text-white/60 text-sm">Active</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">Deal Access</h4>
                        <p className="text-white/60 text-sm">Unlocked deals for ZIP {user.zipCode}</p>
                        <p className="text-white/60 text-sm">Access granted on {user.joinDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">$0.01</p>
                        <p className="text-white/60 text-sm">One-time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.preferences.notifications}
                          onChange={(e) => onUpdateUser({
                            ...user,
                            preferences: { ...user.preferences, notifications: e.target.checked }
                          })}
                          className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10"
                        />
                        <span className="text-white/80">Push notifications for new deals</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.preferences.emailUpdates}
                          onChange={(e) => onUpdateUser({
                            ...user,
                            preferences: { ...user.preferences, emailUpdates: e.target.checked }
                          })}
                          className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10"
                        />
                        <span className="text-white/80">Email updates and newsletters</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.preferences.smsAlerts}
                          onChange={(e) => onUpdateUser({
                            ...user,
                            preferences: { ...user.preferences, smsAlerts: e.target.checked }
                          })}
                          className="w-4 h-4 text-purple-500 rounded border-white/30 bg-white/10"
                        />
                        <span className="text-white/80">SMS alerts for urgent deals</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Account Status</h4>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">VIP Status</p>
                          <p className="text-white/60 text-sm">Premium access active</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

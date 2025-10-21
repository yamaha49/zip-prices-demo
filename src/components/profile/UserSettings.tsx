import { useState } from 'react'
import { motion } from 'framer-motion'

interface UserSettingsProps {
  user: {
    preferences: {
      notifications: boolean
      emailUpdates: boolean
      smsAlerts: boolean
    }
  }
  onUpdatePreferences: (preferences: any) => void
}

export function UserSettings({ user, onUpdatePreferences }: UserSettingsProps) {
  const [preferences, setPreferences] = useState(user.preferences)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    onUpdatePreferences(newPreferences)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    // Here you would typically send the password change request to your backend
    alert('Password updated successfully')
    setShowPasswordForm(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Account Settings</h3>

      {/* Notification Preferences */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-white font-medium">Push Notifications</div>
              <div className="text-white/60 text-sm">Get notified about new deals and updates</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-white font-medium">Email Updates</div>
              <div className="text-white/60 text-sm">Receive email newsletters and deal alerts</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailUpdates}
              onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
              className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-white font-medium">SMS Alerts</div>
              <div className="text-white/60 text-sm">Get urgent deal alerts via text message</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.smsAlerts}
              onChange={(e) => handlePreferenceChange('smsAlerts', e.target.checked)}
              className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10"
            />
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Security</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Password</div>
              <div className="text-white/60 text-sm">Last updated 30 days ago</div>
            </div>
            <motion.button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Change Password
            </motion.button>
          </div>

          {showPasswordForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handlePasswordChange}
              className="space-y-4 pt-4 border-t border-white/20"
            >
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Update Password
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          )}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Privacy</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Data Sharing</div>
              <div className="text-white/60 text-sm">Allow sharing of anonymized data for research</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Analytics</div>
              <div className="text-white/60 text-sm">Help improve our service with usage analytics</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-purple-500 rounded border-white/30 bg-white/10"
            />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Account Actions</h4>
        <div className="space-y-3">
          <motion.button
            className="w-full text-left bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-3 rounded-lg transition-colors border border-yellow-500/30"
            whileHover={{ scale: 1.02 }}
          >
            📧 Export Data
          </motion.button>
          
          <motion.button
            className="w-full text-left bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-lg transition-colors border border-blue-500/30"
            whileHover={{ scale: 1.02 }}
          >
            📱 Download App
          </motion.button>
          
          <motion.button
            className="w-full text-left bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-lg transition-colors border border-red-500/30"
            whileHover={{ scale: 1.02 }}
          >
            🗑️ Delete Account
          </motion.button>
        </div>
      </div>
    </div>
  )
}

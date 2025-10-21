import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { trackUnlockSuccess } from '../analytics'

export function ThankYou() {
  const [params] = useSearchParams()
  const zip = params.get('zip') ?? ''
  const sessionId = params.get('session_id') ?? ''
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    if (!zip) {
      navigate('/')
      return
    }

    // If we have a session ID, verify the payment
    if (sessionId) {
      verifyPayment(sessionId)
    } else {
      // Demo mode - just set unlock status
      sessionStorage.setItem('unlockedZip', zip)
      localStorage.setItem('unlockedZip', zip)
      trackUnlockSuccess(zip)
      setVerifying(false)
    }
  }, [zip, sessionId, navigate])

  const verifyPayment = async (_sessionId: string) => {
    try {
      // In a real app, you'd verify with your backend
      // For demo, we'll just simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Set unlock status
      sessionStorage.setItem('unlockedZip', zip)
      localStorage.setItem('unlockedZip', zip)
      trackUnlockSuccess(zip)
      setVerifying(false)
    } catch (error) {
      console.error('Payment verification failed:', error)
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-full px-6 py-10 text-center flex items-center justify-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white">Verifying payment...</span>
          </div>
          <p className="text-white/70">Please wait while we confirm your purchase.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-10 text-center">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold">You're in!</h1>
        <p className="mt-3 text-white/70">We unlocked your ZIP <span className="text-white font-semibold">{zip}</span>.</p>
        <button onClick={() => navigate(`/dashboard?zip=${zip}`)} className="btn-primary mt-8 px-8 py-4">View Unlocked Items</button>
      </div>
    </div>
  )
}



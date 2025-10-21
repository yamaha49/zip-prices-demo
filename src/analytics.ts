export function sendEvent(name: string, data?: Record<string, unknown>) {
  try {
    console.log('Analytics event:', name, data)
    
    // Meta Pixel
    // @ts-ignore
    if (typeof window !== 'undefined' && window.fbq) {
      // @ts-ignore
      window.fbq('trackCustom', name, data || {})
    }
    // GA4
    // @ts-ignore
    if (typeof window !== 'undefined' && window.gtag) {
      // @ts-ignore
      window.gtag('event', name, {
        event_category: 'TurboSearch',
        event_label: data?.zip || 'unknown',
        value: data?.amount || 0,
        ...data
      })
    }
    // TikTok Pixel
    // @ts-ignore
    if (typeof window !== 'undefined' && window.ttq) {
      // @ts-ignore
      window.ttq('track', name, data || {})
    }
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Enhanced tracking functions for specific events
export function trackZipSubmit(zip: string) {
  sendEvent('zip_submit', { zip_code: zip })
}

export function trackViewDashboard(zip: string, itemCount: number) {
  sendEvent('view_dashboard', { zip_code: zip, item_count: itemCount })
}

export function trackUnlockAttempt(zip: string, itemId: string) {
  sendEvent('unlock_attempt', { zip_code: zip, item_id: itemId })
}

export function trackPurchase(zip: string, amount: number) {
  sendEvent('purchase', { zip_code: zip, amount: amount })
}

export function trackUnlockSuccess(zip: string) {
  sendEvent('unlock_success', { zip_code: zip })
}



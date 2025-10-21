import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Pay } from './pages/Pay'
import { ThankYou } from './pages/ThankYou'
import { CreditCardPage } from './pages/CreditCardPage'
import { ProductPage } from './pages/ProductPage'

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/pay', element: <Pay /> },
  { path: '/credit-card', element: <CreditCardPage /> },
  { path: '/product', element: <ProductPage /> },
  { path: '/thank-you', element: <ThankYou /> },
])

const container = document.getElementById('app')!
createRoot(container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

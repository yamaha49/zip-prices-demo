# 🚀 TurboSearch+ - Local Deal Discovery App

A high-converting React application that helps users discover exclusive local deals in their area. Built with modern web technologies and optimized for conversion.

## ✨ Features

- **ZIP Code Based Search**: Find deals specific to your location
- **VIP Access System**: Premium features with Stripe integration
- **Real-time Analytics**: Track user behavior and conversions
- **Mobile Responsive**: Optimized for all devices
- **High Converting UI**: Designed for maximum conversion rates

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Payments**: Stripe Integration
- **Deployment**: Vercel
- **Analytics**: Google Analytics, Meta Pixel, TikTok Pixel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd zip-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
```

## 📁 Project Structure

```
zip-demo/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── filters/         # Filter components
│   │   └── profile/         # User profile components
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Landing.tsx     # Landing page
│   │   ├── Pay.tsx         # Payment page
│   │   └── ThankYou.tsx    # Thank you page
│   ├── analytics.ts        # Analytics tracking
│   └── sample-data.json    # Sample product data
├── api/                    # Serverless API routes
│   ├── items.js           # Product data API
│   ├── create-checkout-session.js  # Stripe checkout
│   └── webhook.js         # Stripe webhooks
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🎯 Key Pages

### Landing Page (`/`)
- High-converting headline
- ZIP code input
- Social proof elements
- Call-to-action buttons

### Dashboard (`/dashboard?zip=12345`)
- Product grid with deals
- Search and filtering
- VIP unlock system
- User profile access

### Payment Flow (`/pay`)
- Stripe checkout integration
- VIP plan selection
- Secure payment processing

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Vercel deployment
npm run vercel-build
```

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update routing
2. **Components**: Add to `src/components/`
3. **API Routes**: Add to `api/` directory
4. **Styling**: Use Tailwind CSS classes

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --yes
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

### GitHub Integration

1. Push to GitHub repository
2. Connect repository to Vercel
3. Enable automatic deployments

## 🧪 A/B Testing

The app includes built-in A/B testing capabilities:

- **Headlines**: Multiple headline variations
- **CTA Buttons**: Different call-to-action text
- **Pricing**: Various price points
- **Urgency Elements**: Scarcity and time-based messaging

See `AB_TESTING_PLAN.md` for detailed testing strategies.

## 📊 Analytics

Track key metrics:

- **Landing Page Conversion**: ZIP submissions / visitors
- **Modal Conversion**: Modal opens / dashboard views  
- **Payment Conversion**: Completed purchases / payment attempts
- **User Engagement**: Time on site, page views, interactions

## 🔒 Security

- Environment variables for sensitive data
- Stripe webhook signature verification
- Input validation and sanitization
- HTTPS enforcement in production

## 🐛 Troubleshooting

### Common Issues

1. **DNS_HOSTNAME_RESOLVED_PRIVATE**: Missing environment variables
2. **DEPLOYMENT_NOT_FOUND**: Not logged into Vercel or no deployment exists
3. **Build Failures**: Check Node.js version and dependencies

### Debug Steps

1. Check environment variables
2. Verify Vercel authentication
3. Review build logs
4. Test locally first

## 📈 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for user experience
- **Bundle Size**: Minimized with Vite optimization
- **Loading Speed**: < 2s initial load time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review Vercel documentation
3. Check Stripe integration docs
4. Open an issue on GitHub

---

**Built with ❤️ for high-converting user experiences**
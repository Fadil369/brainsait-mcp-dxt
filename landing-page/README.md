# BrainSAIT Healthcare MCP Landing Page

A sophisticated landing page for the BrainSAIT Healthcare MCP Extension, built with React, Vite, and deployed on Cloudflare Workers & Pages.

## ✨ Features

- **Advanced UI Animations**: MeshGradient components with @paper-design/shaders-react
- **60fps Smooth Transitions**: Powered by Framer Motion
- **Enterprise Pricing**: Global USD and local SAR currency support
- **Interactive Demo**: Live web connectors demonstration
- **HIPAA/NPHIES Compliance**: Healthcare-focused messaging
- **Cloudflare Deployment**: Optimized for CF Workers & Pages

## 🎨 Design System

### Animation Architecture
- **Primary MeshGradient**: Speed 0.3, black/violet/purple color anchors
- **Wireframe Overlay**: Speed 0.2, 60% opacity for depth
- **Color Palette**: Black base + violet/purple accents + selective white
- **Container**: Black fallback with overflow hidden

### Technology Stack
- **Frontend**: React 18 + Vite
- **Animations**: @paper-design/shaders-react + Framer Motion
- **Styling**: Tailwind CSS with custom BrainSAIT theme
- **Deployment**: Cloudflare Workers & Pages
- **Performance**: Optimized for 60fps animations

## 🚀 Quick Start

### Development
```bash
cd landing-page
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Deploy to Cloudflare
```bash
# First time setup
npm run cf:build

# Subsequent deployments
wrangler pages publish dist
```

## 📁 Project Structure

```
landing-page/
├── src/
│   ├── components/
│   │   ├── MeshBackground.jsx     # Animated gradient backgrounds
│   │   ├── HeroSection.jsx        # Main hero with CTA
│   │   ├── FeaturesShowcase.jsx   # Interactive features demo
│   │   ├── WebConnectorsDemo.jsx  # Live connector testing
│   │   ├── PricingSection.jsx     # USD/SAR pricing tiers
│   │   └── ContactSection.jsx     # Contact forms & CTAs
│   ├── styles/
│   │   └── globals.css            # Custom styles & animations
│   ├── App.jsx                    # Main application
│   └── main.jsx                   # React entry point
├── public/                        # Static assets
├── wrangler.toml                  # Cloudflare configuration
├── _headers                       # CF Pages headers
├── _redirects                     # CF Pages redirects
└── package.json                   # Dependencies & scripts
```

## 🎯 Key Sections

### 1. Hero Section
- Animated BrainSAIT MCP branding
- Feature pills with icons
- Dual CTA buttons (Free Trial + Demo)
- Real-time statistics

### 2. Features Showcase
- Interactive feature navigation
- Detailed capability breakdowns
- Performance metrics
- Enterprise-grade highlights

### 3. Web Connectors Demo
- 7 healthcare system templates
- Live demo console with realistic delays
- Sample integration code
- Real-time status indicators

### 4. Pricing Section
- Currency toggle (USD/SAR)
- Billing period selector (Monthly/Annual)
- 4 pricing tiers (Developer to Global Enterprise)
- Feature comparison matrix

### 5. Contact Section
- Multi-step contact form
- Organization type selection
- Response time commitments
- Enterprise support information

## 💰 Pricing Tiers

| Plan | USD/Month | SAR/Month | Features |
|------|-----------|-----------|----------|
| Developer | $49 | 184 ر.س | 5 Connectors, Basic HIPAA |
| Professional | $149 | 559 ر.س | 25 Connectors, Full Compliance |
| Enterprise | $499 | 1,871 ر.س | Unlimited, Dedicated Support |
| Global Enterprise | Custom | Custom | Multi-region, Custom SLA |

## 🌐 Deployment Configuration

### Cloudflare Workers
- **Production**: mcp.brainsait.io
- **Staging**: mcp-staging.brainsait.io
- **Compatibility Date**: 2024-01-01
- **Security Headers**: CSP, HSTS, X-Frame-Options

### Performance Optimizations
- **Static Assets**: 1-year cache
- **Images**: 1-month cache
- **HTML**: No cache for updates
- **Compression**: Brotli + Gzip
- **CDN**: Global edge caching

## 🔧 Environment Variables

```bash
# Production
ENVIRONMENT=production

# Staging
ENVIRONMENT=staging
```

## 📊 Analytics & Monitoring

- **Performance**: Core Web Vitals tracking
- **User Interactions**: Contact form submissions
- **Demo Usage**: Connector testing analytics
- **Conversion Tracking**: Pricing tier selections

## 🎨 Animation Details

### MeshGradient Configuration
```javascript
// Primary gradient
{
  animate: true,
  speed: 0.3,
  colors: ['#000000', '#7c3aed', '#a855f7', '#ffffff', '#1e1b4b', '#0f0f23'],
  blendMode: 'multiply',
  opacity: 1
}

// Wireframe overlay
{
  animate: true,
  speed: 0.2,
  opacity: 0.6,
  wireframe: true,
  blendMode: 'overlay'
}
```

### Motion Configuration
- **Stagger Children**: 0.1-0.2s delays
- **Easing**: [0.25, 0.46, 0.45, 0.94] cubic-bezier
- **Hover Animations**: Spring physics (stiffness: 300)
- **Scroll Animations**: Viewport triggers with `once: true`

## 🚀 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Animation Frame Rate**: 60fps

## 📱 Responsive Design

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

## 🔒 Security Features

- **CSP Headers**: Strict content security policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **Input Validation**: Client-side form validation
- **Rate Limiting**: CF Workers rate limiting

## 📞 Support

For technical support or deployment issues:
- **Email**: dev@brainsait.io
- **Documentation**: Internal deployment guides
- **Monitoring**: Cloudflare Analytics dashboard

---

Built with ❤️ by the BrainSAIT Development Team
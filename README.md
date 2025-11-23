# Estate Bali - Bali's Premier Real Estate Platform

Modern, responsive real estate platform for Bali properties built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Property Listings**: Browse villas, apartments, houses, and land
- **Advanced Search**: Filter by price, location, type, and 50+ features
- **Interactive Map**: Find properties by location
- **Short-term Booking**: Airbnb-style rental options
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark Mode**: Beautiful dark theme with green accent colors
- **Fast Performance**: Optimized images and lazy loading

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Leaflet + React Leaflet
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/estatebali.git
cd estatebali
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and fill in required values
# See docs/ENV_VALIDATION.md for detailed instructions
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Follow the prompts to link your project.

### Option 2: Deploy with GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/estatebali.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### Option 3: Direct Deploy

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Third-Party Git Repository"
4. Upload the project folder
5. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

## 🔧 Environment Variables

### Required Variables

The following environment variables are **required** for the application to run:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication (Required)
JWT_SECRET=your-secret-32+-characters-long

# Application URL (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Email Service (Required in Production)

```env
# Resend (recommended)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=noreply@yourdomain.com

# OR SendGrid (alternative)
SENDGRID_API_KEY=SG.your_api_key
FROM_EMAIL=noreply@yourdomain.com
```

### Optional Services

```env
# Redis (for distributed rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

### Setup Instructions

1. **Copy example file:**
   ```bash
   cp .env.example .env
   ```

2. **Generate JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Validate environment:**
   ```bash
   npm run validate-env
   ```

📖 **For detailed environment setup, see [docs/ENV_VALIDATION.md](docs/ENV_VALIDATION.md)**

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing & Validation
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run validate-env     # Validate environment variables
npm run validate-env:prod # Validate for production

# Pre-Deployment
npm run pre-deploy       # Run all checks before deployment
                         # (validation + tests + lint + build)

# Code Quality
npm run lint             # Run ESLint
```

## 🔒 Security & Production Readiness

This project includes comprehensive security measures and production-ready features:

- ✅ **Environment Validation**: Automatic validation with fail-fast mechanism
- ✅ **JWT Security**: Strong authentication with 32+ character secrets
- ✅ **Build Validation**: TypeScript & ESLint errors block production builds
- ✅ **Email Service**: Required in production for password reset
- ✅ **Pre-Deployment Checks**: Automated validation before deployment
- ✅ **Comprehensive Tests**: Full test coverage for critical functionality

📖 **For security details, see [docs/SECURITY_FIXES.md](docs/SECURITY_FIXES.md)**

## 📱 Pages

- `/` - Home page with hero, featured properties, and search
- `/buy` - Properties for sale
- `/rent` - Properties for rent  
- `/map` - Interactive map search
- `/property/[id]` - Property detail page
- `/create` - Create new listing
- `/about` - About Estate Bali
- `/agents` - Find agents

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```js
colors: {
  primary: {
    DEFAULT: "#00FF66", // Change primary green
    dark: "#00CC52",
    light: "#33FF85",
  }
}
```

### Mock Data
Edit `/src/data/mockData.ts` to add/modify properties.

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@estatebali.app

---

**Estate Bali** - Find Your Dream Property in Paradise 🏝️

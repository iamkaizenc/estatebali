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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## 🔧 Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# Add any API keys or environment variables here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

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

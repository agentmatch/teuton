# Luxor Metals Website

A modern, high-performance website for Luxor Metals, a leading mineral exploration company. Built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- ⚡ **Next.js 14+ with App Router** - Latest React framework with server components
- 🎨 **Modern UI/UX** - Glass morphism, smooth animations, and dynamic gradients
- 🌓 **Dark Mode Support** - Elegant theme switching with system preference detection
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🚀 **Progressive Web App** - Installable with offline capabilities
- 🗺️ **Interactive Maps** - Mapbox GL integration for project locations
- 🎭 **3D Elements** - Three.js particle effects on the homepage
- 📊 **SEO Optimized** - Meta tags, sitemap, and structured data
- 🎬 **Smooth Animations** - Framer Motion for delightful interactions

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **3D Graphics:** Three.js, React Three Fiber
- **Maps:** Mapbox GL
- **Icons:** React Icons
- **Theme:** next-themes
- **CMS:** Strapi (setup instructions in STRAPI_SETUP.md)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox access token (for maps)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/luxormetals/website.git
cd luxor-metals
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run dev:watch` - Start development server with auto-restart (nodemon)
- `./start-dev.sh` - Clean start with auto-restart on port 3000 (recommended)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Development Server Tips

For the best development experience, use:
```bash
./start-dev.sh
```

This will:
- Kill any existing dev servers
- Always start on port 3000 (no more random ports!)
- Auto-restart when you save files
- Ignore unnecessary file changes (images, fonts, etc.)

## Project Structure

```
luxor-metals/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   └── [pages]/           # Page routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── lib/                   # Utility functions
├── public/               # Static assets
│   ├── images/          # Images
│   ├── fonts/           # Fonts
│   └── manifest.json    # PWA manifest
└── styles/               # Additional styles
```

## Customization

### Colors

Update the color palette in `tailwind.config.ts`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      gold: { /* your colors */ },
    }
  }
}
```

### Fonts

The project uses Inter font by default. To change it, update `app/layout.tsx`.

### Content

Content is managed through Strapi CMS. See `STRAPI_SETUP.md` for setup instructions.

## Performance Optimization

- Images are optimized using Next.js Image component
- Fonts are self-hosted for better performance
- Components are lazy-loaded where appropriate
- CSS is purged in production

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Docker
- Self-hosted

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential.

## Support

For support, email tech@luxormetals.com or create an issue in the repository.
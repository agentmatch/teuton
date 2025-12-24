/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.luxormetals.com', 'storage.googleapis.com'],
  },
  
  // Enhanced cache busting for development
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
            },
            {
              key: 'Pragma',
              value: 'no-cache'
            },
            {
              key: 'Expires',
              value: '0'
            },
            {
              key: 'Surrogate-Control',
              value: 'no-store'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'Vary',
              value: '*'
            }
          ]
        },
        {
          // Specifically target CSS and JS files
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate'
            }
          ]
        }
      ]
    }
    return []
  },
  
  // Disable static optimization in development to prevent caching issues
  ...(process.env.NODE_ENV === 'development' && {
    generateEtags: false,
    poweredByHeader: false,
    // Add timestamp to chunk names in development
    webpack: (config, { dev }) => {
      if (dev) {
        config.output.filename = 'static/chunks/[name].[fullhash].js'
        config.output.chunkFilename = 'static/chunks/[name].[fullhash].js'
      }
      return config
    }
  })
}

module.exports = nextConfig
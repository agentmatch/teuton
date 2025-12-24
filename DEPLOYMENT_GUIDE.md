# Deploying Luxor Metals to Vercel

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (optional but recommended)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Navigate to your project directory:
```bash
cd /Users/romanalexander/luxorwebsitelaunch/luxor-metals
```

3. Run the deployment command:
```bash
vercel
```

4. Follow the prompts:
   - Login to your Vercel account (if not already logged in)
   - Set up and deploy the project
   - Choose the project name
   - Confirm the settings

### Option 2: Deploy via GitHub/GitLab/Bitbucket

1. Push your code to a Git repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GIT_REPO_URL
git push -u origin main
```

2. Go to https://vercel.com/new
3. Import your Git repository
4. Vercel will automatically detect Next.js and configure the build settings
5. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard (Direct Upload)

1. Build your project locally:
```bash
npm run build
```

2. Go to https://vercel.com/new
3. Click "Upload Folder"
4. Select your project folder
5. Vercel will detect Next.js and configure automatically
6. Click "Deploy"

## Environment Variables

If your project uses environment variables (for API keys, etc.), add them in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add your variables (e.g., API keys for stock data)

## Important Notes

1. **API Routes**: The `/api/stock-quote` and `/api/gold-price` routes may need environment variables for API keys.

2. **Image Optimization**: Vercel automatically optimizes images served through Next.js Image component.

3. **Domain**: After deployment, you can add a custom domain in the project settings.

## Build Configuration

The project is already configured for Vercel deployment with:
- Next.js 15.3.2
- Automatic static optimization
- API routes support
- Image optimization

## Post-Deployment

After successful deployment:
1. Test all pages and functionality
2. Check that stock tickers are updating
3. Verify all images are loading correctly
4. Test responsive design on various devices

## Troubleshooting

If you encounter issues:
1. Check the Vercel build logs for errors
2. Ensure all dependencies are listed in package.json
3. Verify that all environment variables are set
4. Check that all file paths are correct (case-sensitive on Vercel)

## Custom Domain

To add a custom domain:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your domain and follow the DNS configuration instructions
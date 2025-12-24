# Cloudflare R2 Setup Guide

## 1. Create Cloudflare R2 Storage

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Create a new bucket (e.g., `silvergrail-videos`)
4. Note your **Account ID** from the dashboard

## 2. Create API Token

1. In R2 section, go to **Manage R2 API tokens**
2. Click **Create API token**
3. Select **Custom token**
4. Configure permissions:
   - **Zone:Zone:Read** (if needed)
   - **Account:Cloudflare R2:Edit** (for your account)
5. Copy the **API Token**, **Access Key ID**, and **Secret Access Key**

## 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key_here
CLOUDFLARE_R2_BUCKET_NAME=silvergrail-videos
```

## 4. Enable Public Access (Optional)

If you want videos to be publicly accessible:

1. Go to your R2 bucket settings
2. Enable **Public URL access**
3. Note the public domain (e.g., `pub-abc123.r2.dev`)

## 5. Upload Videos

Run the upload script:

```bash
node scripts/upload-videos-to-r2.js
```

## 6. Update Video URLs

After successful upload, update the video URLs in your components from:
- `/images/ramdrone1.webm` 
- `/images/ramdrone2.webm`

To:
- `https://pub-your-account-id.r2.dev/videos/ramdrone1.webm`
- `https://pub-your-account-id.r2.dev/videos/ramdrone2.webm`

## File Sizes

Current video files:
- `ramdrone1.webm` - Main drone video #1
- `ramdrone2.webm` - Main drone video #2  
- `ramdrone1thumb.webm` - Thumbnail video (no longer used)
- `ramdrone1thumb3.webm` - Alternative thumbnail video

## Benefits

- **Global CDN**: Faster video loading worldwide
- **Reduced server load**: Videos served from Cloudflare edge
- **Better performance**: Optimized video delivery
- **Cost effective**: R2 storage is cheaper than traditional CDN
- **Bandwidth savings**: Offload video traffic from main server
# VPS Deployment Guide for Luxor Metals Website

## Hetzner Ubuntu VPS Setup

### Prerequisites
- Ubuntu 22.04 or newer
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

### Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install build essentials
sudo apt-get install -y build-essential

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Install Chromium for Puppeteer
sudo apt-get install -y chromium-browser
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libgtk-3-0
```

### Deploy the Application

```bash
# Clone the repository
cd /var/www
sudo git clone [your-repo-url] luxor-metals
cd luxor-metals

# Install dependencies
npm install

# Build the application
npm run build

# Create necessary directories
mkdir -p public/regulatory-filings
mkdir -p logs/sedar

# Set permissions
sudo chown -R $USER:$USER /var/www/luxor-metals
chmod -R 755 public/regulatory-filings
```

### Configure PM2

Create a PM2 ecosystem file:

```bash
# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'luxor-metals',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/luxor-metals',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
};
EOF

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/luxor-metals

# Add the following configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve regulatory filings directly
    location /regulatory-filings/ {
        alias /var/www/luxor-metals/public/regulatory-filings/;
        autoindex off;
    }

    client_max_body_size 50M;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/luxor-metals /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup Cron Jobs

```bash
# Edit crontab
crontab -e

# Add the following lines:
# Check SEDAR for new filings every 12 hours
0 */12 * * * curl -s http://localhost:3000/api/sedar-filings/check > /var/www/luxor-metals/logs/sedar/cron.log 2>&1

# Optional: Clean up old PDFs monthly (keep last 100)
0 0 1 * * find /var/www/luxor-metals/public/regulatory-filings -name "*.pdf" -type f | sort -r | tail -n +101 | xargs rm -f
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Monitoring and Maintenance

```bash
# View PM2 logs
pm2 logs luxor-metals

# Monitor application
pm2 monit

# Check SEDAR scraping logs
tail -f /var/www/luxor-metals/logs/sedar/cron.log

# Restart application after updates
cd /var/www/luxor-metals
git pull
npm install
npm run build
pm2 restart luxor-metals
```

### Troubleshooting Puppeteer

If Puppeteer fails to launch:

```bash
# Install additional dependencies
sudo apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

# If still having issues, use system Chromium
# Update the Puppeteer launch config in route.ts:
# browser = await puppeteer.default.launch({ 
#   executablePath: '/usr/bin/chromium-browser',
#   headless: true,
#   args: ['--no-sandbox', '--disable-setuid-sandbox']
# });
```

### Backup Strategy

```bash
# Create backup script
cat > /home/ubuntu/backup-regulatory-filings.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/regulatory-filings-$DATE.tar.gz /var/www/luxor-metals/public/regulatory-filings/
# Keep only last 30 days of backups
find $BACKUP_DIR -name "regulatory-filings-*.tar.gz" -mtime +30 -delete
EOF

chmod +x /home/ubuntu/backup-regulatory-filings.sh

# Add to crontab for daily backups
# 0 2 * * * /home/ubuntu/backup-regulatory-filings.sh
```

## File System Structure

On your VPS, the PDFs will be stored at:
- `/var/www/luxor-metals/public/regulatory-filings/` - PDF files
- `/var/www/luxor-metals/public/regulatory-filings/filings-cache.json` - Metadata cache

These files are:
- Directly served by Nginx for fast access
- Persistent across application restarts
- Backed up regularly
- Accessible via URLs like: `https://your-domain.com/regulatory-filings/20241115_sample1_q3_2024_financial_statements.pdf`

## Notes

1. The VPS file system is persistent, so downloaded PDFs remain available
2. Ensure adequate disk space for PDF storage (estimate ~50-100MB per year)
3. Regular backups are recommended
4. Monitor disk usage with `df -h`
5. The cron job runs every 12 hours to check for new filings
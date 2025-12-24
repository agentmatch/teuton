#!/bin/bash

# Setup script for regulatory filings on Ubuntu VPS

echo "Setting up regulatory filings directory..."

# Create the regulatory filings directory if it doesn't exist
mkdir -p public/regulatory-filings

# Set proper permissions (www-data is typical for web servers)
# Adjust the user/group based on your Next.js process user
chown -R www-data:www-data public/regulatory-filings
chmod -R 755 public/regulatory-filings

# Create a log directory for SEDAR scraping logs
mkdir -p logs/sedar
chown -R www-data:www-data logs/sedar
chmod -R 755 logs/sedar

echo "Setup complete!"
echo ""
echo "Directory structure:"
echo "- public/regulatory-filings/ - PDF storage"
echo "- logs/sedar/ - Scraping logs"
echo ""
echo "Make sure to:"
echo "1. Install Chromium for Puppeteer: sudo apt-get install chromium-browser"
echo "2. Set up the cron job: sudo crontab -e"
echo "   Add: 0 */12 * * * curl http://localhost:3000/api/sedar-filings/check"
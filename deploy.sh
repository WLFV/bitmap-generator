#!/bin/bash

# Simple deployment script for GitHub Pages
# This script builds the project and deploys it to GitHub Pages

set -e

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if gh-pages is installed
if ! command -v gh-pages &> /dev/null; then
    echo "📥 Installing gh-pages..."
    npm install -g gh-pages
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
gh-pages -d dist/spa

echo "✅ Deployment complete!"
echo "🔗 Your site will be available at: https://yourusername.github.io/bitmap-generator/"
echo "📝 Remember to replace 'yourusername' with your actual GitHub username"
# GitHub Pages Deployment Guide

This guide will help you deploy your Bitmap Generator to GitHub Pages for free hosting.

## 🚀 Quick Setup (Recommended)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `bitmap-generator` (or any name you prefer)
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README (we already have one)

### Step 2: Push Your Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Bitmap Generator with GitHub Pages setup"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/bitmap-generator.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. That's it! The deployment will start automatically

### Step 4: Access Your Live Site

After the GitHub Action completes (usually 2-3 minutes), your site will be available at:

```
https://YOUR_USERNAME.github.io/bitmap-generator/
```

## 📋 What Happens Automatically

The included GitHub Action (`.github/workflows/deploy.yml`) will:

1. ✅ Install Node.js and dependencies
2. ✅ Build your Quasar project
3. ✅ Deploy to GitHub Pages
4. ✅ Update your live site

This happens every time you push to the `main` branch!

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually:

### Option 1: Using npm script

```bash
# Install gh-pages globally
npm install -g gh-pages

# Deploy (builds and deploys in one command)
npm run deploy
```

### Option 2: Using the deployment script

```bash
# Run the deployment script
./deploy.sh
```

### Option 3: Step by step

```bash
# Build the project
npm run build

# Install gh-pages if not already installed
npm install -g gh-pages

# Deploy to GitHub Pages
gh-pages -d dist/spa
```

## 🛠️ Customization

### Change Repository Name

If you want to use a different repository name:

1. Update the `publicPath` in `quasar.config.js`:
   ```javascript
   publicPath: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/'
   ```

2. Update the GitHub Action workflow if needed

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS to point to GitHub Pages
3. Update the `publicPath` in `quasar.config.js` to `/`

## 🔍 Monitoring Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see the deployment status and logs
4. Green checkmark = successful deployment
5. Red X = deployment failed (check logs for details)

## 🐛 Troubleshooting

### Build Fails
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Make sure there are no ESLint errors

### Site Not Loading
- Verify the repository name matches the `publicPath`
- Check that GitHub Pages is enabled in repository settings
- Wait a few minutes for DNS propagation

### 404 Errors
- Ensure you're using hash routing (already configured)
- Check that the `publicPath` is correct

### Assets Not Loading
- Verify the build completed successfully
- Check browser developer tools for 404 errors
- Ensure the `publicPath` includes your repository name

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Quasar Deployment Guide](https://quasar.dev/quasar-cli-vite/developing-spa/deploying)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🎉 Success!

Once deployed, you can:
- Share your live demo link
- Continue developing and pushing updates
- Monitor usage through GitHub repository insights
- Add the link to your portfolio or resume

Your Bitmap Generator is now live and accessible to the world! 🌍
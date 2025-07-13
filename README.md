# Bitmap Generator

A modern bitmap image processing tool built with Quasar Framework and Vue 3. Convert images to bitmap format with various dithering algorithms and customizable settings.

## Features

- 🖼️ Image upload and processing
- 🎨 Multiple dithering algorithms
- ⚙️ Customizable bitmap settings
- 📱 Responsive design
- 🌙 Dark/Light mode support
- 💾 Download processed images

## Live Demo

🚀 **[View Live Demo](https://WLFV.github.io/bitmap-generator/)**

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bitmap-generator.git
cd bitmap-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:9000`

## Building for Production

```bash
# Build for production
npm run build

# The built files will be in the dist/spa directory
```

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Fork or clone this repository** to your GitHub account

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Automatic deployment:**
   - The GitHub Action will automatically build and deploy your app
   - Your app will be available at: `https://yourusername.github.io/bitmap-generator/`
   - Check the "Actions" tab in your repository to monitor deployment status

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist/spa
```

## Technology Stack

- **[Quasar Framework](https://quasar.dev/)** - Vue.js framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vite](https://vitejs.dev/)** - Build tool
- **Canvas API** - Image processing
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

## Project Structure

```
src/
├── components/
│   ├── BitmapCanvas.vue      # Core image processing component
│   ├── ControlsPanel.vue     # Settings and parameter controls
│   └── ImageUploader.vue     # File upload interface
├── layouts/
│   └── MainLayout.vue        # Main application layout
├── pages/
│   └── IndexPage.vue         # Main application page
├── boot/
│   └── dark-mode.js          # Dark mode initialization
├── css/
│   └── app.scss              # Global styles and theme
└── router/
    ├── index.js              # Vue Router configuration
    └── routes.js             # Application routes
```

## Component Architecture

### BitmapCanvas.vue
The core component responsible for:
- Canvas-based image processing
- Implementation of dithering algorithms
- Real-time preview rendering
- Image scaling and optimization

### ControlsPanel.vue
Provides user interface for:
- Size adjustment with presets
- Threshold control with quick presets
- Dithering method selection
- Settings reset functionality

### ImageUploader.vue
Handles:
- File selection and validation
- Image preview generation
- File information display
- Error handling and user feedback

## Dithering Algorithms

### Floyd-Steinberg Dithering
Error diffusion algorithm that distributes quantization errors to neighboring pixels, creating smooth gradients.

### Atkinson Dithering
Similar to Floyd-Steinberg but with reduced contrast, originally used in early Macintosh computers.

### Bayer Dithering
Ordered dithering using predefined matrices (2×2 and 4×4) for consistent patterns.

### Random Dithering
Adds random noise to create a more organic, textured appearance.

### Detailed Features

#### 🖼️ Image Upload
- Support for PNG, JPG, and WEBP formats
- Drag & drop interface
- File size validation (max 10MB)
- Real-time image preview with dimensions

#### ⚙️ Adjustable Parameters
- **Size Control**: Adjustable output resolution (8×8 to 128×128 pixels)
- **Threshold**: Black & white threshold value (0-255)
- **Dithering Methods**:
  - None (simple threshold)
  - Floyd-Steinberg (error diffusion)
  - Atkinson (reduced contrast error diffusion)
  - Bayer 2×2 (ordered dithering)
  - Bayer 4×4 (ordered dithering)
  - Random (noise dithering)

#### 🎨 Real-time Preview
- Instant processing and preview
- Pixelated rendering with crisp edges
- Original vs processed comparison
- Processing method information display

#### 💾 Export Functionality
- Download processed bitmap as PNG
- Maintains original processing quality
- One-click download

## Design Features

### Dark Theme
- Modern dark interface with retro accents
- Custom color palette with bitmap-inspired colors
- Glassmorphism effects with backdrop blur
- Responsive design for all screen sizes

### User Experience
- Intuitive drag & drop interface
- Real-time parameter adjustment
- Visual feedback for all interactions
- Mobile-optimized touch interface

### Performance
- Client-side processing (no backend required)
- Optimized Canvas operations
- Efficient memory management
- Progressive image loading

## Browser Compatibility

- Chrome 115+
- Firefox 115+
- Safari 14+
- Edge (Chromium-based)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

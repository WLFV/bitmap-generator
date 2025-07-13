<template>
  <q-page class="bitmap-generator">
    <div class="retro-container">
      <div class="main-content">
        <!-- Left Sidebar Controls -->
        <div class="sidebar">
          <!-- File Upload Section -->
          <div class="control-section">
            <div class="section-label">PNG, JPG, WEBP:</div>
            <div class="upload-button" @click="triggerFileUpload">
              <input 
                ref="fileInput" 
                type="file" 
                accept=".png,.jpg,.jpeg,.webp" 
                @change="handleFileSelect" 
                style="display: none;"
              >
              UPLOAD
            </div>
          </div>

          <!-- Size Control -->
          <div class="control-section">
            <div class="section-label">SIZE (0-46):</div>
            <div class="slider-container">
              <q-slider
                v-model="settings.size"
                :min="0"
                :max="46"
                :step="1"
                color="black"
                track-color="grey-3"
                thumb-color="black"
                @update:model-value="debouncedProcessImage"
                class="quasar-slider"
              />
              <div class="value-display">{{ settings.size }}</div>
            </div>
          </div>

          <!-- Threshold Control -->
          <div class="control-section">
            <div class="section-label">THRESHOLD (0-46):</div>
            <div class="slider-container">
              <q-slider
                v-model="settings.threshold"
                :min="0"
                :max="46"
                :step="1"
                color="black"
                track-color="grey-3"
                thumb-color="black"
                @update:model-value="debouncedProcessImage"
                class="quasar-slider"
              />
              <div class="value-display">{{ settings.threshold }}</div>
            </div>
          </div>

          <!-- Dithering Method -->
          <div class="control-section">
            <div class="section-label">DITHERING METHOD:</div>
            <q-select
              v-model="settings.dithering"
              :options="ditheringOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              @update:model-value="updateDithering"
              class="quasar-select"
              outlined
              dense
              options-dense
              color="black"
              popup-content-class="dithering-popup"
            />
          </div>

          <!-- Export Options -->
          <div class="control-section">
            <div class="section-label">EXPORT FORMAT:</div>
            <select 
              v-model="exportFormat" 
              class="retro-select"
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>

          <!-- Export Button -->
          <div class="control-section">
            <div class="retro-button export-button" @click="exportImage" v-if="processedImage">
              EXPORT {{ exportFormat.toUpperCase() }}
            </div>
          </div>
        </div>

        <!-- Main Preview Area -->
        <div class="preview-area">
          <BitmapCanvas
            ref="bitmapCanvas"
            :original-image="originalImage"
            :settings="settings"
            @processed="onImageProcessed"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { debounce } from 'quasar'
import BitmapCanvas from '../components/BitmapCanvas.vue'

const originalImage = ref(null)
const processedImage = ref(null)
const bitmapCanvas = ref(null)
const fileInput = ref(null)

const settings = reactive({
  size: 23,
  threshold: 23,
  dithering: 'bitmap'
})

const ditheringOptions = [
  { label: 'BITMAP', value: 'bitmap' },
  { label: 'STRETCH', value: 'stretch' },
  { label: 'FLOYD–STEINBERG', value: 'floyd-steinberg' },
  { label: 'ATKINSON', value: 'atkinson' },
  { label: 'JARVIS–JUDICE–NINKE', value: 'jarvis-judice-ninke' },
  { label: 'STUCKI', value: 'stucki' },
  { label: 'BAYER 2×2', value: 'bayer-2x2' },
  { label: 'BAYER 4×4', value: 'bayer-4x4' },
  { label: 'BAYER 8×8', value: 'bayer-8x8' },
  { label: 'CLUSTERED 4×4', value: 'clustered-4x4' },
  { label: 'RANDOM', value: 'random' }
]

const exportFormat = ref('png')

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Please select a PNG, JPG, or WEBP image file.')
    return
  }
  
  // Create preview URL and load image
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    handleImageUpload({
      file: file,
      image: img,
      url: url,
      width: img.naturalWidth,
      height: img.naturalHeight
    })
  }
  img.src = url
}

const handleImageUpload = (imageData) => {
  originalImage.value = imageData
  processImage()
}

const processImage = () => {
  if (originalImage.value && bitmapCanvas.value) {
    bitmapCanvas.value.processImage()
  }
}

// Debounced version for slider updates
const debouncedProcessImage = debounce(processImage, 100)

const updateDithering = (value) => {
  settings.dithering = value
  processImage()
}

const onImageProcessed = (canvas) => {
  processedImage.value = canvas
}

const exportImage = () => {
  if (!processedImage.value) return
  
  const link = document.createElement('a')
  
  if (exportFormat.value === 'svg') {
    // Export as SVG
    const canvas = processedImage.value
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const svgContent = generateSVG(imageData, canvas.width, canvas.height)
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    link.href = URL.createObjectURL(blob)
    link.download = 'bitmap-image.svg'
  } else {
    // Export as PNG
    link.href = processedImage.value.toDataURL('image/png')
    link.download = 'bitmap-image.png'
  }
  
  link.click()
}

const generateSVG = (imageData, width, height) => {
  const pixelSize = 1
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * pixelSize}" height="${height * pixelSize}" viewBox="0 0 ${width * pixelSize} ${height * pixelSize}">`
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      const r = imageData.data[index]
      const g = imageData.data[index + 1]
      const b = imageData.data[index + 2]
      const a = imageData.data[index + 3]
      
      if (a > 0) {
        const color = `rgb(${r},${g},${b})`
        svgContent += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`
      }
    }
  }
  
  svgContent += '</svg>'
  return svgContent
}
</script>

<style lang="scss" scoped>
.bitmap-generator {
  background: #f5f5f5;
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  color: #000;
}

.retro-container {
  display: flex;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background: #fff;
  border-right: 2px solid #000;
  padding: 20px;
  overflow-y: auto;
  
  .control-section {
    margin-bottom: 25px;
    
    .section-label {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    
    .upload-button {
      background: #000;
      color: #fff;
      padding: 8px 16px;
      text-align: center;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 1px;
      border: 2px solid #000;
      
      &:hover {
        background: #333;
      }
    }
    
    .slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .quasar-slider {
        flex: 1;
      }
      
      .value-display {
        font-weight: bold;
        font-size: 12px;
        min-width: 30px;
        text-align: center;
        border: 1px solid #000;
        padding: 4px 8px;
        background: #fff;
      }
    }
    
    .retro-select {
      width: 100%;
      padding: 8px;
      border: 2px solid #000;
      background: #fff;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 1px;
      
      &:focus {
        outline: none;
        background: #f0f0f0;
      }
    }
    
    .quasar-select {
      width: 100%;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 1px;
      
      :deep(.q-field__control) {
        border: 2px solid #000;
        background: #fff;
        border-radius: 0;
        min-height: 36px;
        
        &:before {
          border: none;
        }
        
        &:after {
          border: none;
        }
      }
      
      :deep(.q-field__native) {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1px;
        color: #000;
      }
      
      :deep(.q-field__append) {
        color: #000;
      }
      
      &.q-field--focused {
        :deep(.q-field__control) {
          background: #f0f0f0;
        }
      }
    }
    
    .retro-button {
      background: #fff;
      border: 2px solid #000;
      padding: 8px 16px;
      text-align: center;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 1px;
      margin-bottom: 5px;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &.export-button {
        background: #000;
        color: #fff;
        
        &:hover {
          background: #333;
        }
      }
    }
    
    .info-text {
      font-size: 10px;
      margin: 5px 0;
      text-align: center;
    }
  }
}

.preview-area {
  flex: 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid #000;
  }
}
</style>

<style lang="scss">
.dithering-popup {
  .q-item {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #000;
    background: #fff;
    border-bottom: 1px solid #ddd;
    
    &:hover {
      background: #f0f0f0;
    }
    
    &.q-item--active {
      background: #000;
      color: #fff;
    }
  }
  
  .q-menu {
    border: 2px solid #000;
    border-radius: 0;
    background: #fff;
  }
}
</style>

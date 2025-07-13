<template>
  <div class="bitmap-canvas">
    <div v-if="!props.originalImage" class="empty-state">
      <div class="empty-icon">📤</div>
      <div class="empty-text">Upload an image to get started</div>
    </div>

    <div v-else class="canvas-container">
      <div class="canvas-display-wrapper" ref="displayWrapperRef">
        <div class="canvas-wrapper" :style="canvasWrapperStyle">
          <canvas
            ref="canvasRef"
            class="bitmap-canvas-element"
            :width="canvasSize.width"
            :height="canvasSize.height"
            :style="canvasStyle"
          ></canvas>
        </div>
      </div>
      
      <div class="canvas-info">
        <div class="info-row">
          <span>Original: {{ currentImage?.width }}×{{ currentImage?.height }}</span>
          <span>Block Size: {{ settings.size }}</span>
          <span>Threshold: {{ settings.threshold }}</span>
          <span>Method: {{ getDitheringLabel(settings.dithering) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { applyStretchDithering } from '../composables/dithering/stretch.js'
import { applyFloydSteinbergDithering } from '../composables/dithering/floydSteinberg.js'
import { applyAtkinsonDithering } from '../composables/dithering/atkinson.js'
import { applyJarvisJudiceNinkeDithering } from '../composables/dithering/jarvisJudiceNinke.js'
import { applyStuckiDithering } from '../composables/dithering/stucki.js'
import { applyBayer2x2Dithering, applyBayer4x4Dithering, applyBayer8x8Dithering } from '../composables/dithering/bayer.js'
import { applyClustered4x4Dithering } from '../composables/dithering/clustered.js'
import { applyRandomDithering } from '../composables/dithering/random.js'

const props = defineProps({
  originalImage: {
    type: Object,
    default: null
  },
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['processed'])

const canvasRef = ref(null)
const displayWrapperRef = ref(null)
const scale = ref(1)

const currentImage = computed(() => {
  return props.originalImage
})

const canvasSize = computed(() => {
  if (!currentImage.value) {
    return { width: 400, height: 400 }
  }
  // Use current image dimensions for full resolution display
  return {
    width: currentImage.value.width,
    height: currentImage.value.height
  }
})

const canvasStyle = computed(() => {
  return {
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left',
    imageRendering: 'pixelated',
    transition: 'transform 0.3s ease'
  }
})

const canvasWrapperStyle = computed(() => {
  const scaledWidth = canvasSize.value.width * scale.value
  const scaledHeight = canvasSize.value.height * scale.value
  
  return {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
})

const getDitheringLabel = (method) => {
  const labels = {
    'bitmap': 'BITMAP',
    'stretch': 'STRETCH',
    'floyd-steinberg': 'FLOYD–STEINBERG',
    'atkinson': 'ATKINSON',
    'jarvis-judice-ninke': 'JARVIS–JUDICE–NINKE',
    'stucki': 'STUCKI',
    'bayer-2x2': 'BAYER 2×2',
    'bayer-4x4': 'BAYER 4×4',
    'bayer-8x8': 'BAYER 8×8',
    'clustered-4x4': 'CLUSTERED 4×4',
    'random': 'RANDOM'
  }
  return labels[method] || method.toUpperCase()
}

const processImage = () => {
  if (!currentImage.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const { size, threshold, dithering } = props.settings
  const blockSize = Math.max(1, size) // Use size as block/sampling size

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw current image at full resolution
  ctx.drawImage(currentImage.value.image, 0, 0, canvas.width, canvas.height)
  
  // Get image data at full resolution
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Apply block-based sampling if size > 1
  if (blockSize > 1) {
    applyBlockSampling(data, canvas.width, canvas.height, blockSize)
  }

  // Apply dithering algorithm
  const scaledThreshold = Math.round((threshold / 46) * 255) // Scale threshold from 0-46 to 0-255
  switch (dithering) {
    case 'bitmap':
      // Simple binary black-and-white conversion based on threshold only
      applySimpleThreshold(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'stretch':
      applyStretchDithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'floyd-steinberg':
      applyFloydSteinbergDithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'atkinson':
      applyAtkinsonDithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'jarvis-judice-ninke':
      applyJarvisJudiceNinkeDithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'stucki':
      applyStuckiDithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'bayer-2x2':
      applyBayer2x2Dithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'bayer-4x4':
      applyBayer4x4Dithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'bayer-8x8':
      applyBayer8x8Dithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'clustered-4x4':
      applyClustered4x4Dithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    case 'random':
      applyRandomDithering(data, canvas.width, canvas.height, scaledThreshold)
      break
    default:
      applySimpleThreshold(data, canvas.width, canvas.height, scaledThreshold)
  }

  // Put processed data back to canvas
  ctx.putImageData(imageData, 0, 0)

  // Emit the processed canvas
  emit('processed', canvas)
}

const applyBlockSampling = (data, width, height, blockSize) => {
  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data)
  
  // Apply block sampling
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      // Calculate average color for the block
      let r = 0, g = 0, b = 0, a = 0, count = 0
      
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const index = ((y + by) * width + (x + bx)) * 4
          r += originalData[index]
          g += originalData[index + 1]
          b += originalData[index + 2]
          a += originalData[index + 3]
          count++
        }
      }
      
      // Calculate average
      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)
      a = Math.round(a / count)
      
      // Apply average to all pixels in the block
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const index = ((y + by) * width + (x + bx)) * 4
          data[index] = r
          data[index + 1] = g
          data[index + 2] = b
          data[index + 3] = a
        }
      }
    }
  }
}

const applySimpleThreshold = (data, width, height, threshold) => {
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    const value = gray > threshold ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = value
  }
}



const calculateScale = () => {
  if (!currentImage.value || !displayWrapperRef.value) {
    scale.value = 1
    return
  }

  const wrapper = displayWrapperRef.value
  const wrapperRect = wrapper.getBoundingClientRect()
  
  // Account for padding and margins (40px total padding)
  const availableWidth = wrapperRect.width - 40
  const availableHeight = wrapperRect.height - 40
  
  const imageWidth = canvasSize.value.width
  const imageHeight = canvasSize.value.height
  
  // Calculate scale factor to fit within available space
  const scaleX = availableWidth / imageWidth
  const scaleY = availableHeight / imageHeight
  
  // Use the smaller scale factor to ensure both dimensions fit
  // But never scale up beyond original size (max scale = 1)
  const newScale = Math.min(1, scaleX, scaleY)
  
  scale.value = Math.max(0.1, newScale) // Minimum scale of 0.1
}

const handleResize = () => {
  calculateScale()
}

let resizeObserver = null

onMounted(() => {
  if (window.ResizeObserver && displayWrapperRef.value) {
    resizeObserver = new ResizeObserver(() => {
      calculateScale()
    })
    resizeObserver.observe(displayWrapperRef.value)
  }
  
  // Fallback for window resize
  window.addEventListener('resize', handleResize)
  
  // Initial calculation
  nextTick(() => {
    calculateScale()
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', handleResize)
})

// Watch for changes and reprocess
watch(
  () => [currentImage.value, props.settings],
  () => {
    nextTick(() => {
      processImage()
      calculateScale()
    })
  },
  { deep: true, immediate: true }
)

// Watch for canvas size changes to recalculate scale
watch(
  () => canvasSize.value,
  () => {
    nextTick(() => {
      calculateScale()
    })
  },
  { deep: true }
)

// Expose processImage method
defineExpose({
  processImage
})
</script>

<style lang="scss" scoped>
.bitmap-canvas {
  font-family: 'Courier New', monospace;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    border: 2px dashed #ccc;
    background: #fff;
    margin: 20px;
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .empty-text {
      font-size: 14px;
      font-weight: bold;
      color: #666;
      letter-spacing: 1px;
    }
  }

  .canvas-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
    min-height: 0;
  }

  .canvas-display-wrapper {
    flex: 1;
    border: 2px solid #000;
    background: #fff;
    margin-bottom: 15px;
    min-height: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  }

  .canvas-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: relative;
  }

  .bitmap-canvas-element {
    display: block;
    max-width: none;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    image-rendering: -webkit-crisp-edges;
    background: #fff;
    border: 1px solid #ccc;
    transform-origin: top left;
  }



  .canvas-info {
    text-align: center;
    
    .info-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      font-size: 11px;
      font-weight: bold;
      color: #666;
      letter-spacing: 1px;
      
      span {
        padding: 4px 8px;
        border: 1px solid #ccc;
        background: #f9f9f9;
      }
      

    }
  }
}

@media (max-width: 768px) {
  .bitmap-canvas {
    .canvas-container {
      padding: 10px;
    }
    
    .canvas-wrapper {
      padding: 10px;
    }
    
    .canvas-info .info-row {
      flex-direction: column;
      gap: 5px;
      font-size: 10px;
    }
  }
}
</style>
/**
 * Atkinson dithering algorithm
 * Error diffusion dithering with Atkinson's specific error distribution pattern
 */
export function applyAtkinsonDithering(data, width, height, threshold) {
  const errors = new Float32Array(width * height)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
      const adjustedGray = Math.max(0, Math.min(255, gray + errors[y * width + x]))
      
      const newValue = adjustedGray > threshold ? 255 : 0
      const error = adjustedGray - newValue
      
      data[idx] = data[idx + 1] = data[idx + 2] = newValue
      
      // Atkinson dithering pattern (1/8 of error to each neighbor):
      //     X   1/8 1/8
      // 1/8 1/8 1/8
      //     1/8
      const errorFraction = error / 8
      if (x + 1 < width) errors[y * width + (x + 1)] += errorFraction
      if (x + 2 < width) errors[y * width + (x + 2)] += errorFraction
      if (y + 1 < height) {
        if (x > 0) errors[(y + 1) * width + (x - 1)] += errorFraction
        errors[(y + 1) * width + x] += errorFraction
        if (x + 1 < width) errors[(y + 1) * width + (x + 1)] += errorFraction
      }
      if (y + 2 < height) {
        errors[(y + 2) * width + x] += errorFraction
      }
    }
  }
}
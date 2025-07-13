/**
 * Stucki dithering algorithm
 * Error diffusion dithering with Stucki's specific error distribution pattern
 */
export function applyStuckiDithering(data, width, height, threshold) {
  const errors = new Float32Array(width * height)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
      const adjustedGray = Math.max(0, Math.min(255, gray + errors[y * width + x]))
      
      const newValue = adjustedGray > threshold ? 255 : 0
      const error = adjustedGray - newValue
      
      data[idx] = data[idx + 1] = data[idx + 2] = newValue
      
      // Stucki dithering pattern:
      //         X   8/42 4/42
      // 2/42 4/42 8/42 4/42 2/42
      // 1/42 2/42 4/42 2/42 1/42
      
      // First row
      if (x + 1 < width) errors[y * width + (x + 1)] += error * 8 / 42
      if (x + 2 < width) errors[y * width + (x + 2)] += error * 4 / 42
      
      // Second row
      if (y + 1 < height) {
        if (x - 2 >= 0) errors[(y + 1) * width + (x - 2)] += error * 2 / 42
        if (x - 1 >= 0) errors[(y + 1) * width + (x - 1)] += error * 4 / 42
        errors[(y + 1) * width + x] += error * 8 / 42
        if (x + 1 < width) errors[(y + 1) * width + (x + 1)] += error * 4 / 42
        if (x + 2 < width) errors[(y + 1) * width + (x + 2)] += error * 2 / 42
      }
      
      // Third row
      if (y + 2 < height) {
        if (x - 2 >= 0) errors[(y + 2) * width + (x - 2)] += error * 1 / 42
        if (x - 1 >= 0) errors[(y + 2) * width + (x - 1)] += error * 2 / 42
        errors[(y + 2) * width + x] += error * 4 / 42
        if (x + 1 < width) errors[(y + 2) * width + (x + 1)] += error * 2 / 42
        if (x + 2 < width) errors[(y + 2) * width + (x + 2)] += error * 1 / 42
      }
    }
  }
}
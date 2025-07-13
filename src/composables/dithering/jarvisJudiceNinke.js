/**
 * Jarvis-Judice-Ninke dithering algorithm
 * Error diffusion dithering with JJN's specific error distribution pattern
 */
export function applyJarvisJudiceNinkeDithering(data, width, height, threshold) {
  const errors = new Float32Array(width * height)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
      const adjustedGray = Math.max(0, Math.min(255, gray + errors[y * width + x]))
      
      const newValue = adjustedGray > threshold ? 255 : 0
      const error = adjustedGray - newValue
      
      data[idx] = data[idx + 1] = data[idx + 2] = newValue
      
      // Jarvis-Judice-Ninke dithering pattern:
      //         X   7/48 5/48
      // 3/48 5/48 7/48 5/48 3/48
      // 1/48 3/48 5/48 3/48 1/48
      
      // First row
      if (x + 1 < width) errors[y * width + (x + 1)] += error * 7 / 48
      if (x + 2 < width) errors[y * width + (x + 2)] += error * 5 / 48
      
      // Second row
      if (y + 1 < height) {
        if (x - 2 >= 0) errors[(y + 1) * width + (x - 2)] += error * 3 / 48
        if (x - 1 >= 0) errors[(y + 1) * width + (x - 1)] += error * 5 / 48
        errors[(y + 1) * width + x] += error * 7 / 48
        if (x + 1 < width) errors[(y + 1) * width + (x + 1)] += error * 5 / 48
        if (x + 2 < width) errors[(y + 1) * width + (x + 2)] += error * 3 / 48
      }
      
      // Third row
      if (y + 2 < height) {
        if (x - 2 >= 0) errors[(y + 2) * width + (x - 2)] += error * 1 / 48
        if (x - 1 >= 0) errors[(y + 2) * width + (x - 1)] += error * 3 / 48
        errors[(y + 2) * width + x] += error * 5 / 48
        if (x + 1 < width) errors[(y + 2) * width + (x + 1)] += error * 3 / 48
        if (x + 2 < width) errors[(y + 2) * width + (x + 2)] += error * 1 / 48
      }
    }
  }
}
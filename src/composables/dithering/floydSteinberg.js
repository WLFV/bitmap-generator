/**
 * Floyd-Steinberg dithering algorithm
 * Error diffusion dithering with specific error distribution pattern
 */
export function applyFloydSteinbergDithering(data, width, height, threshold) {
  const errors = new Float32Array(width * height)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
      const adjustedGray = Math.max(0, Math.min(255, gray + errors[y * width + x]))
      
      const newValue = adjustedGray > threshold ? 255 : 0
      const error = adjustedGray - newValue
      
      data[idx] = data[idx + 1] = data[idx + 2] = newValue
      
      // Distribute error using Floyd-Steinberg matrix:
      //     X   7/16
      // 3/16 5/16 1/16
      if (x + 1 < width) errors[y * width + (x + 1)] += error * 7 / 16
      if (y + 1 < height) {
        if (x > 0) errors[(y + 1) * width + (x - 1)] += error * 3 / 16
        errors[(y + 1) * width + x] += error * 5 / 16
        if (x + 1 < width) errors[(y + 1) * width + (x + 1)] += error * 1 / 16
      }
    }
  }
}
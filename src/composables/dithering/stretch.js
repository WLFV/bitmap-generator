/**
 * Stretch dithering algorithm
 * Stretches the contrast of the image before applying threshold
 */
export function applyStretchDithering(data, width, height, threshold) {
  // First pass: find min and max values
  let min = 255
  let max = 0
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    min = Math.min(min, gray)
    max = Math.max(max, gray)
  }
  
  // Avoid division by zero
  const range = max - min || 1
  
  // Second pass: stretch and threshold
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    const stretched = ((gray - min) / range) * 255
    const value = stretched > threshold ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = value
  }
}
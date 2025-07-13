/**
 * Random dithering algorithm
 * Applies random noise to threshold for each pixel
 */
export function applyRandomDithering(data, width, height, threshold) {
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    
    // Add random noise to threshold (-64 to +64)
    const randomNoise = (Math.random() - 0.5) * 128
    const adjustedThreshold = threshold + randomNoise
    
    const value = gray > adjustedThreshold ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = value
  }
}
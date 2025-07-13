/**
 * Clustered dithering algorithm
 * Uses a 4x4 clustered dot pattern for halftone-like effect
 */

// Clustered 4x4 matrix (creates dot patterns)
const CLUSTERED_4X4 = [
  [12, 5, 6, 13],
  [4, 0, 1, 7],
  [11, 3, 2, 8],
  [15, 10, 9, 14]
]

export function applyClustered4x4Dithering(data, width, height, threshold) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
      
      const matrixX = x % 4
      const matrixY = y % 4
      const clusteredValue = CLUSTERED_4X4[matrixY][matrixX]
      
      // Normalize clustered value to 0-255 range
      const normalizedClustered = (clusteredValue / 15) * 255
      const adjustedThreshold = threshold + (normalizedClustered - 127.5)
      
      const value = gray > adjustedThreshold ? 255 : 0
      data[idx] = data[idx + 1] = data[idx + 2] = value
    }
  }
}
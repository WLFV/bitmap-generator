/**
 * Bayer dithering algorithms
 * Ordered dithering using Bayer matrices of different sizes
 */

// Bayer 2x2 matrix
const BAYER_2X2 = [
  [0, 2],
  [3, 1]
]

// Bayer 4x4 matrix
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
]

// Bayer 8x8 matrix
const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
]

export function applyBayer2x2Dithering(data, width, height, threshold) {
  applyBayerDithering(data, width, height, threshold, BAYER_2X2, 2)
}

export function applyBayer4x4Dithering(data, width, height, threshold) {
  applyBayerDithering(data, width, height, threshold, BAYER_4X4, 4)
}

export function applyBayer8x8Dithering(data, width, height, threshold) {
  applyBayerDithering(data, width, height, threshold, BAYER_8X8, 8)
}

function applyBayerDithering(data, width, height, threshold, matrix, size) {
  const matrixSize = size * size
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
      
      const matrixX = x % size
      const matrixY = y % size
      const bayerValue = matrix[matrixY][matrixX]
      
      // Normalize bayer value to 0-255 range
      const normalizedBayer = (bayerValue / (matrixSize - 1)) * 255
      const adjustedThreshold = threshold + (normalizedBayer - 127.5)
      
      const value = gray > adjustedThreshold ? 255 : 0
      data[idx] = data[idx + 1] = data[idx + 2] = value
    }
  }
}
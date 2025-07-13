<template>
  <div class="image-uploader">
    <q-file
      v-model="file"
      accept=".png,.jpg,.jpeg,.webp"
      max-file-size="10485760"
      @update:model-value="handleFileSelect"
      outlined
      dark
      color="white"
      label="Choose image file"
      class="q-mb-md"
    >
      <template v-slot:prepend>
        <q-icon name="cloud_upload" />
      </template>
    </q-file>

    <div v-if="previewUrl" class="preview-container">
      <q-img
        :src="previewUrl"
        class="preview-image"
        fit="contain"
        :ratio="1"
      />
      <div class="image-info q-mt-sm">
        <div class="text-caption">{{ file?.name }}</div>
        <div class="text-caption text-grey-5">
          {{ formatFileSize(file?.size) }} • {{ imageInfo.width }}×{{ imageInfo.height }}
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message q-mt-sm">
      <q-banner class="bg-negative text-white" rounded>
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
      </q-banner>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['image-uploaded'])

const file = ref(null)
const previewUrl = ref('')
const error = ref('')
const imageInfo = reactive({
  width: 0,
  height: 0
})

const handleFileSelect = (selectedFile) => {
  error.value = ''
  
  if (!selectedFile) {
    previewUrl.value = ''
    return
  }

  // Validate file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!validTypes.includes(selectedFile.type)) {
    error.value = 'Please select a PNG, JPG, or WEBP image file.'
    file.value = null
    return
  }

  // Create preview URL
  previewUrl.value = URL.createObjectURL(selectedFile)

  // Load image to get dimensions and emit to parent
  const img = new Image()
  img.onload = () => {
    imageInfo.width = img.naturalWidth
    imageInfo.height = img.naturalHeight
    
    // Emit the image data to parent component
    emit('image-uploaded', {
      file: selectedFile,
      image: img,
      url: previewUrl.value,
      width: img.naturalWidth,
      height: img.naturalHeight
    })
  }
  
  img.onerror = () => {
    error.value = 'Failed to load image. Please try another file.'
    file.value = null
    previewUrl.value = ''
  }
  
  img.src = previewUrl.value
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style lang="scss" scoped>
.image-uploader {
  .preview-container {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 16px;
    background: rgba(0, 0, 0, 0.2);
  }

  .preview-image {
    max-height: 200px;
    border-radius: 4px;
  }

  .image-info {
    text-align: center;
  }

  .error-message {
    animation: shake 0.5s ease-in-out;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
<template>
  <div class="controls-panel">
    <!-- Size Control -->
    <div class="control-group q-mb-lg">
      <div class="control-label q-mb-sm">
        <q-icon name="photo_size_select_large" class="q-mr-sm" />
        Size: {{ size }}×{{ size }}
      </div>
      <q-slider
        :model-value="size"
        @update:model-value="updateSize"
        :min="8"
        :max="128"
        :step="4"
        color="primary"
        track-color="grey-8"
        thumb-color="primary"
        label
        label-always
        class="q-mb-sm"
      />
      <div class="size-presets q-mt-sm">
        <q-btn
          v-for="preset in sizePresets"
          :key="preset"
          :label="preset + '×' + preset"
          size="sm"
          :outline="size !== preset"
          :color="size === preset ? 'primary' : 'grey-6'"
          @click="updateSize(preset)"
          class="q-mr-xs q-mb-xs"
        />
      </div>
    </div>

    <!-- Threshold Control -->
    <div class="control-group q-mb-lg">
      <div class="control-label q-mb-sm">
        <q-icon name="tune" class="q-mr-sm" />
        Threshold: {{ threshold }}
      </div>
      <q-slider
        :model-value="threshold"
        @update:model-value="updateThreshold"
        :min="0"
        :max="255"
        :step="1"
        color="primary"
        track-color="grey-8"
        thumb-color="primary"
        label
        label-always
        class="q-mb-sm"
      />
      <div class="threshold-presets q-mt-sm">
        <q-btn
          v-for="preset in thresholdPresets"
          :key="preset.value"
          :label="preset.label"
          size="sm"
          :outline="threshold !== preset.value"
          :color="threshold === preset.value ? 'primary' : 'grey-6'"
          @click="updateThreshold(preset.value)"
          class="q-mr-xs q-mb-xs"
        />
      </div>
    </div>

    <!-- Dithering Method -->
    <div class="control-group q-mb-lg">
      <div class="control-label q-mb-sm">
        <q-icon name="grain" class="q-mr-sm" />
        Dithering Method
      </div>
      <q-select
        :model-value="dithering"
        @update:model-value="updateDithering"
        :options="ditheringOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        outlined
        dark
        color="primary"
        class="dithering-select"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <!-- Reset Button -->
    <div class="control-group">
      <q-btn
        label="Reset to Defaults"
        icon="refresh"
        color="grey-7"
        outline
        @click="resetToDefaults"
        class="full-width"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 32
  },
  threshold: {
    type: Number,
    default: 128
  },
  dithering: {
    type: String,
    default: 'none'
  }
})

const emit = defineEmits(['update:size', 'update:threshold', 'update:dithering', 'settings-changed'])

const sizePresets = [16, 24, 32, 48, 64, 96]

const thresholdPresets = [
  { label: 'Dark', value: 64 },
  { label: 'Medium', value: 128 },
  { label: 'Light', value: 192 }
]

const ditheringOptions = [
  {
    label: 'None',
    value: 'none',
    description: 'Simple black and white conversion'
  },
  {
    label: 'Floyd-Steinberg',
    value: 'floyd-steinberg',
    description: 'Error diffusion dithering for smooth gradients'
  },
  {
    label: 'Atkinson',
    value: 'atkinson',
    description: 'Similar to Floyd-Steinberg but with less contrast'
  },
  {
    label: 'Bayer 2×2',
    value: 'bayer-2x2',
    description: 'Ordered dithering with 2×2 matrix'
  },
  {
    label: 'Bayer 4×4',
    value: 'bayer-4x4',
    description: 'Ordered dithering with 4×4 matrix'
  },
  {
    label: 'Random',
    value: 'random',
    description: 'Random noise dithering'
  }
]

const updateSize = (value) => {
  emit('update:size', value)
  emit('settings-changed')
}

const updateThreshold = (value) => {
  emit('update:threshold', value)
  emit('settings-changed')
}

const updateDithering = (value) => {
  emit('update:dithering', value)
  emit('settings-changed')
}

const resetToDefaults = () => {
  emit('update:size', 32)
  emit('update:threshold', 128)
  emit('update:dithering', 'none')
  emit('settings-changed')
}
</script>

<style lang="scss" scoped>
.controls-panel {
  .control-group {
    .control-label {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
    }
  }

  .size-presets,
  .threshold-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .dithering-select {
    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  :deep(.q-slider__track) {
    height: 6px;
  }

  :deep(.q-slider__thumb) {
    width: 20px;
    height: 20px;
  }

  :deep(.q-slider__label) {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
  }
}
</style>
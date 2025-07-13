<template>
  <q-layout view="lHh lpR fFf" class="bitmap-layout">

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>


  </q-layout>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.bitmap-layout {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.page-container {
  background: transparent;
}
</style>

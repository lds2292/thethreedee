<template>
  <div class="app">
    <header class="header">
      <RouterLink to="/" class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        3D Viewer
      </RouterLink>
      <span class="supported-formats">STL · OBJ · GLTF · GLB 지원</span>
    </header>

    <main class="main">
      <ModelViewer v-if="modelFile" :file="modelFile" @reset="resetFile" />
      <DropZone v-else @file-loaded="onFileLoaded" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DropZone from '../components/DropZone.vue'
import ModelViewer from '../components/ModelViewer.vue'

const modelFile = ref(null)

function onFileLoaded(file) {
  modelFile.value = file
}

function resetFile() {
  modelFile.value = null
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #a78bfa;
  text-decoration: none;
}

.supported-formats {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.main {
  flex: 1;
  overflow: hidden;
}
</style>

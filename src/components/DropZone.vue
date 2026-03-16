<template>
  <div class="dropzone-wrapper">
    <div class="dropzone-area">
    <div
      class="dropzone"
      :class="{ 'drag-over': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="dropzone-content">
        <div class="icon-wrapper" :class="{ pulse: isDragging }">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        <h2 class="title">3D 모델 파일을 올려주세요</h2>
        <p class="subtitle">
          드래그 앤 드롭하거나 클릭하여 파일을 선택하세요
        </p>

        <div class="format-badges">
          <span class="badge">.stl</span>
          <span class="badge">.obj</span>
          <span class="badge">.gltf</span>
          <span class="badge">.glb</span>
        </div>

        <button class="btn-upload" @click.stop="triggerFileInput">
          파일 선택
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept=".stl,.obj,.gltf,.glb,model/stl,model/obj,model/gltf+json,model/gltf-binary,application/octet-stream"
        class="hidden-input"
        @change="onFileChange"
      />
    </div>

    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>

    <!-- Google AdSense: data-ad-slot="XXXXXXXXXX" 을 본인 광고 슬롯 ID로 교체 -->
    <div class="ad-container">
      <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-1253318658034453"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['file-loaded'])
const fileInput = ref(null)
const isDragging = ref(false)
const errorMsg = ref('')

function triggerFileInput() {
  fileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) processFile(file)
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {}
})

const MAX_FILE_BYTES = 500 * 1024 * 1024 // 500 MB

async function checkMagicBytes(file, ext) {
  const slice = await file.slice(0, 512).arrayBuffer()
  const bytes = new Uint8Array(slice)

  if (ext === 'glb') {
    // Binary GLTF: 첫 4바이트 = "glTF" (0x67 0x6C 0x54 0x46)
    return bytes[0] === 0x67 && bytes[1] === 0x6C && bytes[2] === 0x54 && bytes[3] === 0x46
  }

  if (ext === 'gltf') {
    // JSON 텍스트: 공백 제거 후 '{' 로 시작
    const text = new TextDecoder().decode(bytes).trimStart()
    return text.startsWith('{')
  }

  if (ext === 'stl') {
    // ASCII STL: "solid" 로 시작
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 256))
    if (text.trimStart().toLowerCase().startsWith('solid')) return true
    // Binary STL: 파일 크기 = 80(헤더) + 4(triCount) + triCount * 50
    if (bytes.length >= 84) {
      const triCount = new DataView(slice).getUint32(80, true)
      return Math.abs(file.size - (84 + triCount * 50)) < 10
    }
    return false
  }

  if (ext === 'obj') {
    // OBJ 텍스트: 정점(v), 노멀(vn), UV(vt), 면(f), 주석(#) 등 OBJ 키워드 포함 여부
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return /^(#|v |vt |vn |f |o |g |mtllib|usemtl)/m.test(text)
  }

  return false
}

async function processFile(file) {
  errorMsg.value = ''
  const ext = file.name.split('.').pop().toLowerCase()
  if (!['stl', 'obj', 'gltf', 'glb'].includes(ext)) {
    const displayExt = ext.length > 20 ? ext.slice(0, 20) + '...' : ext
    errorMsg.value = `지원하지 않는 형식입니다: .${displayExt} (STL, OBJ, GLTF, GLB 가능)`
    return
  }
  if (file.size > MAX_FILE_BYTES) {
    errorMsg.value = '파일 크기가 너무 큽니다 (최대 500 MB)'
    return
  }
  const isValid = await checkMagicBytes(file, ext)
  if (!isValid) {
    errorMsg.value = `파일 내용이 .${ext} 형식과 일치하지 않습니다`
    return
  }
  emit('file-loaded', file)
}
</script>

<style scoped>
.dropzone-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dropzone-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.ad-container {
  width: 100%;
  max-width: 728px;
  margin: 0 auto;
  padding: 8px 24px 16px;
}

.dropzone {
  width: 100%;
  max-width: 520px;
  border: 2px dashed #3a3a4f;
  border-radius: 20px;
  padding: 60px 40px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: #16161d;
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: #a78bfa;
  background: rgba(167, 139, 250, 0.05);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.icon-wrapper {
  color: #a78bfa;
  opacity: 0.8;
  transition: transform 0.3s;
}

.icon-wrapper.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #f0f0f5;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.format-badges {
  display: flex;
  gap: 8px;
}

.badge {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: monospace;
}

.btn-upload {
  margin-top: 8px;
  padding: 12px 32px;
  background: #a78bfa;
  color: #0f0f13;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-upload:hover {
  background: #c4b5fd;
  transform: translateY(-1px);
}

.btn-upload:active {
  transform: translateY(0);
}

.hidden-input {
  display: none;
}

.error-msg {
  margin-top: 16px;
  color: #f87171;
  font-size: 14px;
}
</style>

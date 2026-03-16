<template>
  <Transition name="modal">
    <div v-if="modelValue" class="overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            3D Viewer
          </div>
          <button class="btn-close" @click="$emit('update:modelValue', false)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="description">
            STL · OBJ 파일을 브라우저에서 바로 확인할 수 있는 3D 뷰어입니다.<br>
            파일은 서버에 업로드되지 않으며 로컬에서만 처리됩니다.
          </p>

          <div class="section">
            <h3 class="section-title">오픈소스 라이선스</h3>
            <ul class="license-list">
              <li v-for="lib in libraries" :key="lib.name" class="license-item">
                <div class="lib-info">
                  <span class="lib-name">{{ lib.name }}</span>
                  <span class="lib-version">{{ lib.version }}</span>
                  <span class="lib-license">{{ lib.license }}</span>
                </div>
                <p class="lib-copyright">{{ lib.copyright }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])

const libraries = [
  {
    name: 'Three.js',
    version: 'r170',
    license: 'MIT',
    copyright: 'Copyright © 2010-2024 three.js authors',
  },
  {
    name: 'Vue',
    version: '3',
    license: 'MIT',
    copyright: 'Copyright (c) 2018-present Yuxi (Evan) You',
  },
  {
    name: 'three-mesh-bvh',
    version: '0.x',
    license: 'MIT',
    copyright: 'Copyright (c) 2018 Garrett Johnson',
  },
  {
    name: 'vue-router',
    version: '4',
    license: 'MIT',
    copyright: 'Copyright (c) 2019-present Eduardo San Martin Morote',
  },
]
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 480px;
  max-width: calc(100vw - 32px);
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #2a2a3a;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #a78bfa;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 7px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  padding: 0;
}

.btn-close:hover {
  color: #e0e0e0;
  background: rgba(255, 255, 255, 0.05);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.description {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.7;
  margin: 0;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 10px;
}

.license-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.license-item {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
}

.lib-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.lib-name {
  font-size: 13px;
  font-weight: 500;
  color: #e0e0e0;
}

.lib-version {
  font-size: 11px;
  color: #4b5563;
  font-family: monospace;
}

.lib-license {
  font-size: 11px;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  border-radius: 4px;
  padding: 1px 6px;
}

.lib-copyright {
  font-size: 12px;
  color: #4b5563;
  margin: 0;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(12px);
}
</style>

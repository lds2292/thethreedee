<template>
  <div class="viewer-wrapper">
    <canvas ref="canvasRef" class="canvas" />

    <!-- Mesh Panel (OBJ only) -->
    <Transition name="panel-slide">
      <div v-if="meshList.length > 0" class="mesh-panel">
        <div class="mesh-panel-header">
          <span class="mesh-panel-title">레이어</span>
          <span class="mesh-count-badge">{{ meshList.length }}</span>
        </div>
        <ul class="mesh-list">
          <li
            v-for="(item, i) in meshList"
            :key="i"
            :ref="el => { if (el) meshListItems[i] = el }"
            class="mesh-item"
            :class="{ active: selectedMeshIndex === i }"
            @click="selectMesh(i)"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="mesh-icon">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <span class="mesh-name">{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </Transition>

    <!-- View Presets -->
    <div class="view-presets">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="btn-view"
        :title="v.title"
        :disabled="isLoading"
        @click="setView(v)"
      >{{ v.label }}</button>
      <div class="preset-divider" />
      <button
        class="btn-view"
        title="스크린샷 저장"
        :disabled="isLoading"
        @click="takeScreenshot"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>
      <button
        class="btn-view"
        :class="{ active: lightFollowCamera }"
        title="조명 카메라 연동"
        :disabled="isLoading"
        @click="toggleLightFollow"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
        </svg>
      </button>
      <button
        class="btn-view"
        :class="{ active: isWireframe }"
        title="와이어프레임"
        :disabled="isLoading"
        @click="toggleWireframe"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
          <line x1="12" y1="12" x2="12" y2="22"/>
          <line x1="2" y1="7" x2="12" y2="12"/>
          <line x1="22" y1="7" x2="12" y2="12"/>
        </svg>
      </button>
    </div>

    <!-- Info bar -->
    <div class="info-bar">
      <div class="file-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <span class="file-name">{{ props.file.name }}</span>
        <span class="file-size">{{ fileSize }}</span>
      </div>
      <div class="info-right">
        <span v-if="triangleCount" class="tri-count">{{ triangleCount }} tris</span>

        <!-- Color picker: STL/OBJ 전용 -->
        <div v-if="!isGltf" class="color-picker-wrap">
          <label class="color-label" title="모델 색상 변경">
            <span class="color-preview" :style="{ background: modelColor }" />
            <input
              type="color"
              class="color-input"
              :value="modelColor"
              @input="onColorChange"
            />
          </label>
          <button class="btn-icon" title="색상 초기화" @click="resetColor">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>

        <!-- Animation controls: GLTF 전용 -->
        <button v-if="hasAnimation" class="btn-icon" :title="isPlaying ? '일시정지' : '재생'" @click="toggleAnimation">
          <svg v-if="isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>

        <button class="btn-reset" @click="emit('reset')">다른 파일 열기</button>
      </div>
    </div>

    <!-- Dimensions -->
    <div v-if="modelDimensions" class="dimensions-panel">
      <span class="dim-axis x">X</span><span class="dim-val">{{ formatDim(modelDimensions.x) }}</span>
      <span class="dim-axis y">Y</span><span class="dim-val">{{ formatDim(modelDimensions.y) }}</span>
      <span class="dim-axis z">Z</span><span class="dim-val">{{ formatDim(modelDimensions.z) }}</span>
    </div>

    <!-- Controls hint -->
    <div class="controls-hint">
      <span>마우스 드래그: 회전</span>
      <span>스크롤: 확대/축소</span>
      <span>우클릭 드래그: 이동</span>
      <template v-if="meshList.length > 0">
        <span class="hint-divider">|</span>
        <span>메쉬 클릭: 선택</span>
        <span>선택 재클릭 · 빈 공간: 해제</span>
      </template>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ loadingMsg }}</p>
    </div>

    <!-- Error overlay -->
    <div v-if="errorMsg" class="error-overlay">
      <p>{{ errorMsg }}</p>
      <button class="btn-reset" @click="emit('reset')">다시 시도</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'

// Three.js에 BVH 가속 적용 (전역 1회)
THREE.BufferGeometry.prototype.computeBoundsTree  = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree  = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

const props = defineProps({ file: { type: File, required: true } })
const emit = defineEmits(['reset'])

const canvasRef = ref(null)
const isLoading = ref(true)
const loadingMsg = ref('파일 파싱 중...')
const errorMsg = ref('')
const triangleCount = ref('')
const isGltf = ref(false)
const hasAnimation = ref(false)
const isPlaying = ref(true)

const DEFAULT_COLOR = '#c8ccd0'
const modelColor = ref(DEFAULT_COLOR)
const modelDimensions = ref(null) // { x, y, z } 원본 단위

// ── OBJ 메쉬 리스트 ────────────────────────────────────────────────────
const meshList = ref([])          // { name, mesh }
const selectedMeshIndex = ref(-1)
const meshListItems = ref([])

function selectMesh(index) {
  const isSame = selectedMeshIndex.value === index
  selectedMeshIndex.value = isSame ? -1 : index

  meshList.value.forEach((item, i) => {
    const mat = item.mesh.material
    if (isSame) {
      // 전체 선택 해제
      mat.opacity = 1.0
      mat.transparent = false
      mat.emissive?.set(0x000000)
    } else if (i === index) {
      // 선택된 메쉬: 선명하게
      mat.opacity = 1.0
      mat.transparent = false
      mat.emissive?.set(0x111a2e)
    } else {
      // 나머지 메쉬: 흐리게
      mat.opacity = 0.25
      mat.transparent = true
      mat.emissive?.set(0x000000)
    }
  })

  if (!isSame) scrollToMeshItem(index)
  requestRender()
}

function scrollToMeshItem(index) {
  nextTick(() => {
    const el = meshListItems.value[index]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

// 색상 변경 (선택 상태 유지)
function applyColor(hex) {
  scene?.traverse(obj => {
    if (obj.isMesh && obj.material) {
      obj.material.color.set(hex)
    }
  })
  requestRender()
}

function onColorChange(e) {
  modelColor.value = e.target.value
  applyColor(modelColor.value)
}

function resetColor() {
  modelColor.value = DEFAULT_COLOR
  applyColor(DEFAULT_COLOR)
}

const fileSize = computed(() => {
  const bytes = props.file.size
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

// ── TODO ───────────────────────────────────────────────────────────────
// [x] 와이어프레임 토글
// [ ] 원근(Perspective) / 직교(Orthographic) 카메라 전환
// [x] 모델 치수 표시 (바운딩 박스 X/Y/Z)
// [x] 스크린샷 저장 (PNG 다운로드)
// [ ] 전체화면 (Fullscreen API)
// [ ] 키보드 단축키 (W: 와이어프레임, F: 화면 맞춤, R: 카메라 리셋 등)
// [ ] 뷰어 상태에서 파일 드래그로 교체
// [ ] 최근 파일 목록 (localStorage)
// ───────────────────────────────────────────────────────────────────────

let renderer, scene, camera, controls
let dirLight, fillLight
let mixer = null
const clock = new THREE.Clock()
let needsRender = false
let rafId = null
let fitDistance = 5
let cameraAnim = null  // { fromPos, toPos, start, duration }

function requestRender() { needsRender = true }

function renderLoop() {
  rafId = requestAnimationFrame(renderLoop)
  const delta = clock.getDelta()
  if (mixer) { mixer.update(delta); needsRender = true }
  if (cameraAnim) {
    const t = Math.min((performance.now() - cameraAnim.start) / cameraAnim.duration, 1)
    const ease = 1 - Math.pow(1 - t, 3)  // cubic ease-out
    camera.position.lerpVectors(cameraAnim.fromPos, cameraAnim.toPos, ease)
    if (t >= 1) cameraAnim = null
    needsRender = true
  }
  if (!needsRender) return
  needsRender = false
  controls?.update()
  renderer?.render(scene, camera)
}

// ── 스크린샷 ───────────────────────────────────────────────────────────
function takeScreenshot() {
  renderer.render(scene, camera)
  const link = document.createElement('a')
  link.href = canvasRef.value.toDataURL('image/png')
  const safeName = props.file.name.replace(/\.[^.]+$/, '').replace(/[^\w\-. ]/g, '_')
  link.download = safeName + '.png'
  link.click()
}

// ── 조명 카메라 연동 ────────────────────────────────────────────────────
const lightFollowCamera = ref(false)

function toggleLightFollow() {
  lightFollowCamera.value = !lightFollowCamera.value
  if (lightFollowCamera.value) {
    // 카메라에 attach → 카메라와 함께 회전
    scene.remove(dirLight)
    scene.remove(fillLight)
    dirLight.position.set(1, 1, 2)   // 카메라 기준 정면 우상단
    fillLight.position.set(-1, -0.5, -1) // 카메라 기준 후면 좌하단
    camera.add(dirLight)
    camera.add(fillLight)
    scene.add(camera)
  } else {
    // 씬에 고정 복원
    camera.remove(dirLight)
    camera.remove(fillLight)
    dirLight.position.set(5, 10, 7)
    fillLight.position.set(-5, -2, -5)
    scene.add(dirLight)
    scene.add(fillLight)
  }
  requestRender()
}

// ── 와이어프레임 ───────────────────────────────────────────────────────
const isWireframe = ref(false)

function toggleWireframe() {
  isWireframe.value = !isWireframe.value
  scene?.traverse(obj => {
    if (obj.isMesh && obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(m => { m.wireframe = isWireframe.value })
    }
  })
  requestRender()
}

// ── 시점 프리셋 ────────────────────────────────────────────────────────
const VIEWS = [
  { key: 'front', label: 'F', title: '정면', pos: () => new THREE.Vector3(0, 0,  fitDistance) },
  { key: 'top',   label: 'T', title: '상단', pos: () => new THREE.Vector3(0.001, fitDistance, 0.001) },
  { key: 'right', label: 'R', title: '우측', pos: () => new THREE.Vector3(fitDistance, 0, 0) },
  { key: 'iso',   label: '⊹', title: '아이소메트릭', pos: () => new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(fitDistance) },
]

function setView(preset) {
  const to = preset.pos()
  cameraAnim = { fromPos: camera.position.clone(), toPos: to, start: performance.now(), duration: 380 }
  controls.target.set(0, 0, 0)
  requestRender()
}

// ── Three.js 초기화 ────────────────────────────────────────────────────
function initThree() {
  const canvas = canvasRef.value
  const w = canvas.clientWidth
  const h = canvas.clientHeight

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = false

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f0f13)

  const grid = new THREE.GridHelper(10, 20, 0x888890, 0x3a3a42)
  grid.position.y = -0.01
  scene.add(grid)

  camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000)
  camera.position.set(3, 2, 5)

  scene.add(new THREE.AmbientLight(0xffffff, 0.7))
  dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(5, 10, 7)
  scene.add(dirLight)
  fillLight = new THREE.DirectionalLight(0x8888ff, 0.4)
  fillLight.position.set(-5, -2, -5)
  scene.add(fillLight)

  controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 0.1
  controls.maxDistance = 500
  controls.addEventListener('change', requestRender)

  window.removeEventListener('resize', onResize) // 중복 등록 방지
  window.addEventListener('resize', onResize)
  // iOS Safari: 화면 회전 시 100dvh 재계산 후 리사이즈
  screen.orientation?.addEventListener('change', () => setTimeout(onResize, 200))
}

// ── 캔버스 클릭: 메쉬 선택 ────────────────────────────────────────────
let pointerDownPos = null

function onPointerDown(e) {
  pointerDownPos = { x: e.clientX, y: e.clientY }
}

function onPointerUp(e) {
  if (!pointerDownPos || meshList.value.length === 0) return
  const dx = e.clientX - pointerDownPos.x
  const dy = e.clientY - pointerDownPos.y
  pointerDownPos = null
  if (Math.sqrt(dx * dx + dy * dy) > 4) return // 드래그면 무시

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1
  const y = -((e.clientY - rect.top)   / rect.height) * 2 + 1

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

  const meshes = meshList.value.map(item => item.mesh)
  const hits = raycaster.intersectObjects(meshes, false)

  if (hits.length > 0) {
    const hitIndex = meshList.value.findIndex(item => item.mesh === hits[0].object)
    if (hitIndex !== -1) selectMesh(hitIndex)
  } else {
    // 빈 공간 클릭 → 선택 해제
    if (selectedMeshIndex.value !== -1) selectMesh(selectedMeshIndex.value)
  }
}

// ── 파일 파싱: Web Worker ──────────────────────────────────────────────
function parseFileInWorker(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase()
    const worker = new Worker(new URL('../workers/modelParser.worker.js', import.meta.url), { type: 'module' })
    file.arrayBuffer().then(buffer => { worker.postMessage({ buffer, ext }, [buffer]) })
    worker.onmessage = ({ data }) => { worker.terminate(); resolve(data) }
    worker.onerror   = (e)       => { worker.terminate(); reject(e) }
  })
}

// ── 공통 메시 배치 ─────────────────────────────────────────────────────
function centerAndFit(object, geometry) {
  const box = geometry
    ? (() => { geometry.computeBoundingBox(); return geometry.boundingBox })()
    : new THREE.Box3().setFromObject(object)

  const center = new THREE.Vector3()
  const size   = new THREE.Vector3()
  box.getCenter(center)
  box.getSize(size)

  const maxDim = Math.max(size.x, size.y, size.z)
  const scale  = 3 / maxDim

  object.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  object.scale.setScalar(scale)

  camera.position.set(0, size.y * scale * 0.5, maxDim * scale * 2)
  controls.target.set(0, 0, 0)
  controls.update()
  fitDistance = camera.position.length()
  modelDimensions.value = { x: size.x, y: size.y, z: size.z }
}

function makeMaterial() {
  return new THREE.MeshPhongMaterial({
    color: 0xc8ccd0,
    specular: 0x444466,
    shininess: 40,
    side: THREE.DoubleSide,
  })
}

// BVH 가속 구조 빌드 (클릭 raycasting을 O(n)→O(log n)으로 단축)
function buildBVH(geometry) {
  geometry.computeBoundsTree({ maxLeafTris: 10 })
}

function formatDim(v) {
  if (v >= 1000) return v.toFixed(0)
  if (v >= 10)   return v.toFixed(1)
  return v.toFixed(2)
}

function countTriangles(geometry) {
  const count = geometry.index
    ? geometry.index.count / 3
    : geometry.attributes.position.count / 3
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(Math.round(count))
}

// ── GLTF/GLB ──────────────────────────────────────────────────────────
function loadGLTF() {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(props.file)

    // 외부 URI 차단: GLTF 파일 내 http/https 참조가 외부 서버로 요청되는 것을 막음
    const manager = new THREE.LoadingManager()
    manager.setURLModifier((resourceUrl) => {
      if (resourceUrl.startsWith('blob:') || resourceUrl.startsWith('data:')) {
        return resourceUrl
      }
      if (resourceUrl.startsWith('http://') || resourceUrl.startsWith('https://')) {
        console.warn('[Security] Blocked external URI in GLTF:', resourceUrl)
        return ''
      }
      return resourceUrl
    })

    new GLTFLoader(manager).load(
      url,
      (gltf) => {
        URL.revokeObjectURL(url)
        let totalTris = 0
        gltf.scene.traverse(child => {
          if (child.isMesh) {
            const geo = child.geometry
            totalTris += geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3
          }
        })
        triangleCount.value = totalTris >= 1000
          ? `${(totalTris / 1000).toFixed(1)}K`
          : String(Math.round(totalTris))
        scene.add(gltf.scene)
        centerAndFit(gltf.scene, null)
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene)
          gltf.animations.forEach(clip => mixer.clipAction(clip).play())
          hasAnimation.value = true
        }
        resolve()
      },
      undefined,
      (err) => { URL.revokeObjectURL(url); reject(err) }
    )
  })
}

function toggleAnimation() {
  if (!mixer) return
  isPlaying.value = !isPlaying.value
  mixer.timeScale = isPlaying.value ? 1 : 0
}

// ── 모델 로딩 ──────────────────────────────────────────────────────────
async function loadModel() {
  const ext = props.file.name.split('.').pop().toLowerCase()
  meshList.value = []
  selectedMeshIndex.value = -1
  modelDimensions.value = null

  try {
    loadingMsg.value = '파일 파싱 중...'

    if (ext === 'gltf' || ext === 'glb') {
      isGltf.value = true
      loadingMsg.value = 'GLTF 로딩 중...'
      await loadGLTF()
      isLoading.value = false
      requestRender()
      return
    }

    const result = await parseFileInWorker(props.file)
    loadingMsg.value = '씬 구성 중...'

    if (result.type === 'stl') {
      if (!(result.positions instanceof Float32Array) || !(result.normals instanceof Float32Array)) {
        throw new Error('Worker 응답 오류: Float32Array가 아닙니다')
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(result.positions, 3))
      geo.setAttribute('normal',   new THREE.BufferAttribute(result.normals,   3))
      buildBVH(geo)
      triangleCount.value = countTriangles(geo)
      const mesh = new THREE.Mesh(geo, makeMaterial())
      scene.add(mesh)
      centerAndFit(mesh, geo)

    } else if (result.type === 'stl_ascii') {
      const geo = new STLLoader().parse(result.buffer)
      geo.computeVertexNormals()
      buildBVH(geo)
      triangleCount.value = countTriangles(geo)
      const mesh = new THREE.Mesh(geo, makeMaterial())
      scene.add(mesh)
      centerAndFit(mesh, geo)

    } else if (result.type === 'obj_text') {
      const group = new OBJLoader().parse(result.text)
      let totalTris = 0
      let fallbackIndex = 0
      group.traverse(child => {
        if (child.isMesh) {
          child.material = makeMaterial()
          if (child.geometry.attributes.normal === undefined) {
            child.geometry.computeVertexNormals()
          }
          buildBVH(child.geometry)
          totalTris += child.geometry.attributes.position.count / 3
          meshList.value.push({
            name: child.name?.trim() || `메쉬 ${++fallbackIndex}`,
            mesh: child,
          })
        }
      })
      triangleCount.value = totalTris >= 1000
        ? `${(totalTris / 1000).toFixed(1)}K`
        : String(Math.round(totalTris))
      scene.add(group)
      centerAndFit(group, null)
    }

    isLoading.value = false
    requestRender()

  } catch (e) {
    if (import.meta.env.DEV) console.error(e)
    errorMsg.value = '파일을 로드하는 중 오류가 발생했습니다.'
    isLoading.value = false
  }
}

function onResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  requestRender()
}

onMounted(async () => {
  initThree()
  renderLoop()
  canvasRef.value.addEventListener('pointerdown', onPointerDown)
  canvasRef.value.addEventListener('pointerup',   onPointerUp)
  await loadModel()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  controls?.removeEventListener('change', requestRender)
  canvasRef.value?.removeEventListener('pointerdown', onPointerDown)
  canvasRef.value?.removeEventListener('pointerup',   onPointerUp)
  window.removeEventListener('resize', onResize)
  mixer?.stopAllAction()
  scene?.traverse(obj => {
    if (obj.isMesh) {
      obj.geometry.disposeBoundsTree?.()
      obj.geometry.dispose()
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(m => {
        if (!m) return
        // GLTF 텍스처 dispose (material.dispose()는 텍스처를 해제하지 않음)
        Object.values(m).forEach(val => { if (val?.isTexture) val.dispose() })
        m.dispose()
      })
    }
  })
  scene?.clear()
  renderer?.dispose()
  controls?.dispose()
})
</script>

<style scoped>
.viewer-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── View Presets ────────────────────────────────────────────────────── */
.view-presets {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.btn-view {
  width: 34px;
  height: 34px;
  background: rgba(18, 18, 24, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.btn-view:hover {
  color: #c4b5fd;
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(167, 139, 250, 0.1);
}

.btn-view.active {
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(167, 139, 250, 0.15);
}

.btn-view:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.preset-divider {
  width: 100%;
  height: 1px;
  background: #2a2a3a;
  margin: 2px 0;
}

/* ── Mesh Panel ──────────────────────────────────────────────────────── */
.mesh-panel {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  width: 200px;
  max-height: 60vh;
  background: rgba(18, 18, 24, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.mesh-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.mesh-panel-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.mesh-count-badge {
  font-size: 11px;
  color: #6b7280;
  background: rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 1px 7px;
}

.mesh-list {
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  overflow-x: hidden;
}

.mesh-list::-webkit-scrollbar { width: 4px; }
.mesh-list::-webkit-scrollbar-track { background: transparent; }
.mesh-list::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }

.mesh-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  color: #9ca3af;
}

.mesh-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.mesh-item.active {
  background: rgba(167, 139, 250, 0.15);
  color: #c4b5fd;
}

.mesh-item.active .mesh-icon {
  color: #a78bfa;
}

.mesh-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.mesh-item.active .mesh-icon {
  opacity: 1;
}

.mesh-name {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transition */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-8px);
}

/* ── Info bar ─────────────────────────────────────────────────────────── */
.info-bar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(22, 22, 29, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 10px 18px;
  white-space: nowrap;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a78bfa;
}

.info-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.tri-count {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.color-picker-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-label {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.color-preview {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.15);
  display: block;
  transition: border-color 0.2s;
}

.color-label:hover .color-preview {
  border-color: rgba(255,255,255,0.4);
}

.color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  padding: 0;
}

.btn-icon:hover {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
}

.btn-reset {
  padding: 6px 14px;
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-reset:hover {
  background: rgba(167, 139, 250, 0.3);
}

/* ── Dimensions ──────────────────────────────────────────────────────── */
.dimensions-panel {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(18, 18, 24, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 12px;
  font-family: monospace;
}

.dim-axis {
  font-weight: 700;
  font-size: 11px;
}
.dim-axis.x { color: #f87171; }
.dim-axis.y { color: #86efac; }
.dim-axis.z { color: #93c5fd; }

.dim-val {
  color: #d1d5db;
  margin-right: 6px;
}
.dim-val:last-child { margin-right: 0; }

/* ── Controls hint ───────────────────────────────────────────────────── */
.controls-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(22, 22, 29, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 8px 20px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.hint-divider {
  color: #2a2a3a;
  user-select: none;
}

/* ── Overlays ─────────────────────────────────────────────────────────── */
.loading-overlay,
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(15, 15, 19, 0.85);
  font-size: 16px;
  color: #a78bfa;
}

.error-overlay { color: #f87171; }

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(167, 139, 250, 0.2);
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Mobile (≤ 480px) ─────────────────────────────────────────────── */
@media (max-width: 480px) {
  /* Info bar: 좌우 여백으로 전체 너비, 줄바꿈 허용 */
  .info-bar {
    left: 8px;
    right: 8px;
    transform: none;
    padding: 8px 12px;
    gap: 8px;
    flex-wrap: wrap;
    white-space: normal; /* base의 nowrap 오버라이드 */
  }
  .file-name { max-width: 140px; font-size: 13px; }
  /* 파일 크기·삼각형 수는 공간 부족으로 숨김 */
  .file-size, .tri-count { display: none; }

  /* View presets: 오른쪽 여백 줄이고 버튼 소형화 */
  .view-presets { right: 8px; }
  .btn-view { width: 28px; height: 28px; font-size: 11px; }

  /* Mesh panel: 폭 축소 */
  .mesh-panel { width: 140px; left: 8px; max-height: 40vh; }

  /* Controls hint: 모바일은 터치 조작이라 힌트 숨김 */
  .controls-hint { display: none; }

  /* Dimensions: 하단 여백 줄이고 폰트 소형화 */
  .dimensions-panel {
    bottom: 8px;
    left: 8px;
    font-size: 11px;
    padding: 5px 8px;
    gap: 4px;
  }
}
</style>

# Three.js 메모리 관리 지침

ModelViewer.vue에서 `onBeforeUnmount` 시 반드시 확인해야 할 체크리스트.

---

## 체크리스트

### 렌더링 루프
- [ ] `cancelAnimationFrame(rafId)` — 미호출 시 컴포넌트가 사라져도 루프가 계속 누적됨

### 이벤트 리스너
- [ ] `controls.removeEventListener('change', ...)` — OrbitControls 내부 리스너
- [ ] `canvas.removeEventListener('pointerdown', ...)`
- [ ] `canvas.removeEventListener('pointerup', ...)`
- [ ] `window.removeEventListener('resize', ...)`

### 씬 내 오브젝트 (scene.traverse)
`isMesh` 오브젝트마다:
- [ ] `geometry.disposeBoundsTree()` — three-mesh-bvh BVH 가속 구조
- [ ] `geometry.dispose()` — 버텍스/인덱스 버퍼 (GPU 메모리)
- [ ] material 내 **텍스처 개별 dispose** — `material.dispose()`는 텍스처를 해제하지 않음
  ```js
  Object.values(material).forEach(val => { if (val?.isTexture) val.dispose() })
  ```
- [ ] `material.dispose()`

> **주의**: `GridHelper`는 `LineSegments` 기반이라 `isMesh === false`. `isMesh` 체크만으로는 dispose 안 됨.
> Grid는 경량이므로 `renderer.dispose()` 후 GC에 위임해도 무방하나, 명시적으로 처리하려면 별도 ref로 보관 후 dispose.

### 애니메이션
- [ ] `mixer.stopAllAction()` — 진행 중인 애니메이션 정지
- [ ] `mixer = null` — GC 참조 해제 (`AnimationMixer`는 `.dispose()` 메서드 없음)

### 씬 정리
- [ ] `scene.clear()` — 씬 그래프에서 모든 오브젝트 참조 제거 (geometry/material dispose 이후 호출)

### WebGL 컨텍스트
- [ ] `renderer.dispose()` — 컴파일된 셰이더, WebGL 버퍼, GPU에 업로드된 텍스처 전체 해제
- [ ] `controls.dispose()` — OrbitControls 내부 DOM 이벤트 정리

### Blob URL / Worker
- [ ] GLTF 로드 시 `URL.revokeObjectURL(url)` — 성공/실패 양쪽 경로에서 호출
- [ ] Web Worker `worker.terminate()` + `URL.revokeObjectURL(workerUrl)` — 응답/에러 양쪽에서 호출

---

## 리소스별 메모리 위치

| 리소스 | CPU 메모리 | GPU 메모리 | 해제 방법 |
|---|---|---|---|
| BufferGeometry | ✅ (TypedArray) | ✅ (VBO) | `geometry.dispose()` |
| Texture | ✅ (ImageData) | ✅ (텍스처 유닛) | `texture.dispose()` |
| Material | ✅ | ✅ (셰이더) | `material.dispose()` (텍스처 별도) |
| BVH | ✅ (가속 구조) | — | `geometry.disposeBoundsTree()` |
| WebGLRenderer | — | ✅ (컨텍스트 전체) | `renderer.dispose()` |

---

## 현재 onBeforeUnmount 구현 현황

```
✅ cancelAnimationFrame
✅ controls 이벤트 리스너 제거
✅ canvas pointer 이벤트 리스너 제거
✅ window resize 리스너 제거
✅ mixer.stopAllAction()
✅ geometry.disposeBoundsTree()
✅ geometry.dispose()
✅ 텍스처 개별 dispose (Object.values 순회)
✅ material.dispose()
✅ scene.clear()
✅ renderer.dispose()
✅ controls.dispose()
✅ Worker terminate + blob URL revoke
✅ GLTF blob URL revoke

⚠️  GridHelper geometry/material은 isMesh 체크에서 제외됨 (경량이므로 낮은 우선순위)
⚠️  AnimationMixer는 dispose() 메서드 없음 — stopAllAction() + null 할당으로 처리
```

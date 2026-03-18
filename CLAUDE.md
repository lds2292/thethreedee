# CLAUDE.md — Toolzy monorepo

각 툴은 독립적인 **Vite + Vue 3** 앱으로, 하나의 GitHub 저장소에서 관리됩니다.
배포는 루트 `netlify.toml` 한 곳에서 모든 앱을 통합 관리합니다.

---

## 앱 목록

| 폴더 | 경로 | 설명 |
|---|---|---|
| `landing/` | `/` | Toolzy 메인 랜딩 페이지 |
| `json-formatter/` | `/json/` | JSON Formatter / Validator |
| `3d-viewer/` | `/3d-viewer/` | STL·OBJ·GLTF·GLB 브라우저 3D 뷰어 |
| `base64-encoder/` | `/encode/` | Base64·URL 인코딩/디코딩, Image→Base64 |
| `regex-tester/` | `/regex/` | 정규식 실시간 테스트·하이라이트·치환 |
| `cron-tester/` | `/cron/` | Cron 표현식 검증·한국어 설명·다음 실행 시간 |

---

## 개발 명령어

```bash
# 개별 앱 개발 서버
npm run dev --workspace landing
npm run dev --workspace json-formatter
npm run dev --workspace base64-encoder
npm run dev --workspace regex-tester
npm run dev --workspace cron-tester
npm run dev --workspace 3d-viewer

# 개별 앱 빌드
npm run build --workspace <앱명>

# 전체 빌드 (dist/ 통합)
npm run build:all

# 로컬 통합 미리보기
npm run preview
```

---

## 배포 구조 (Netlify)

- **단일 사이트** — `netlify.toml` 기준으로 전체 앱을 하나의 Netlify 사이트에 배포
- Build command: `npm run build:all`
- Publish dir: `dist/`
- `scripts/merge-dist.js` — 각 앱의 `dist/`를 루트 `dist/` 하위 경로로 병합

| 앱 | dist 경로 |
|---|---|
| landing | `dist/` (루트) |
| json-formatter | `dist/json/` |
| 3d-viewer | `dist/3d-viewer/` |
| base64-encoder | `dist/encode/` |
| regex-tester | `dist/regex/` |
| cron-tester | `dist/cron/` |

---

## 참고 문서

- **개발 가이드** (새 앱 추가, 공통 패턴): [`./docs/DEV_GUIDE.md`](./docs/DEV_GUIDE.md)
- **디자인 시스템** (색상, 타이포, 컴포넌트 CSS): [`./docs/STYLE_GUIDE.md`](./docs/STYLE_GUIDE.md)

---

## 공통 사항

- 테스트 프레임워크 없음 — 브라우저에서 직접 확인
- vue-router 없음 — `window.location.pathname` 으로 수동 처리
- 모바일(< 768px)은 `MobileBlock.vue`로 차단 (PC 전용 툴)

# CLAUDE.md — webapp-tools monorepo

각 툴은 독립적인 Vite + Vue 3 앱으로, 같은 GitHub 저장소에서 관리됩니다.
Netlify에서 각 앱마다 별도 사이트로 배포됩니다.

## 앱 목록

| 폴더 | 도메인 | 설명 |
|---|---|---|
| `3d-viewer/` | 3d-viewer.toolzy.site | STL·OBJ·GLTF·GLB 브라우저 3D 뷰어 |
| `json-formatter/` | json.toolzy.site | JSON Formatter / Validator |
| `landing/` | toolzy.site | Toolzy 메인 랜딩 페이지 |

## 각 앱 실행

```bash
npm run dev     --prefix 3d-viewer
npm run build   --prefix 3d-viewer
npm run dev     --prefix json-formatter
npm run build   --prefix json-formatter
npm run dev     --prefix landing
npm run build   --prefix landing
```

## Netlify 설정 (앱별)

- **3d-viewer**: Base directory `3d-viewer`, Build `npm run build`, Publish `3d-viewer/dist`
- **json-formatter**: Base directory `json-formatter`, Build `npm run build`, Publish `json-formatter/dist`
- **landing**: Base directory `landing`, Build `npm run build`, Publish `landing/dist`

## 공통 사항

- 테스트 프레임워크 없음
- 각 앱의 상세 아키텍처는 해당 폴더의 `CLAUDE.md` 참조

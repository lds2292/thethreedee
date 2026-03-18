# CLAUDE.md — webapp-tools monorepo

각 툴은 독립적인 Vite + Vue 3 앱으로, 같은 GitHub 저장소에서 관리됩니다.
Netlify에서 각 앱마다 별도 사이트로 배포됩니다.

## 앱 목록

| 폴더 | 도메인 | 설명 |
|---|---|---|
| `3d-viewer/` | 3d-viewer.toolzy.site | STL·OBJ·GLTF·GLB 브라우저 3D 뷰어 |
| `json-formatter/` | json.toolzy.site | JSON Formatter / Validator |
| `base64-encoder/` | base64.toolzy.site | Base64·URL 인코딩/디코딩, Image→Base64 |
| `regex-tester/` | regex.toolzy.site | 정규식 실시간 테스트·하이라이트·치환 |
| `cron-tester/` | cron.toolzy.site | Cron 표현식 검증·한국어 설명·다음 실행 시간 |
| `landing/` | toolzy.site | Toolzy 메인 랜딩 페이지 |

## 각 앱 실행

```bash
npm run dev     --prefix 3d-viewer
npm run build   --prefix 3d-viewer
npm run dev     --prefix json-formatter
npm run build   --prefix json-formatter
npm run dev     --prefix base64-encoder
npm run build   --prefix base64-encoder
npm run dev     --prefix regex-tester
npm run build   --prefix regex-tester
npm run dev     --prefix cron-tester
npm run build   --prefix cron-tester
npm run dev     --prefix landing
npm run build   --prefix landing
```

## Netlify 설정 (앱별)

- **3d-viewer**: Base directory `3d-viewer`, Build `npm run build`, Publish `3d-viewer/dist`
- **json-formatter**: Base directory `json-formatter`, Build `npm run build`, Publish `json-formatter/dist`
- **base64-encoder**: Base directory `base64-encoder`, Build `npm run build`, Publish `base64-encoder/dist`
- **regex-tester**: Base directory `regex-tester`, Build `npm run build`, Publish `regex-tester/dist`
- **cron-tester**: Base directory `cron-tester`, Build `npm run build`, Publish `cron-tester/dist`
- **landing**: Base directory `landing`, Build `npm run build`, Publish `landing/dist`

## 공통 사항

- 테스트 프레임워크 없음
- 각 앱의 상세 아키텍처는 해당 폴더의 `CLAUDE.md` 참조
- 디자인 시스템 및 공통 패턴은 [`./STYLE_GUIDE.md`](./STYLE_GUIDE.md) 참조

# 개발·테스트·배포 절차

- **문서 목적:** 예약 앱과 별도 메뉴판 앱의 안전한 브랜치·테스트·배포 절차를 제공한다.
- **대상 저장소:** `cij5484/soorim`, `cij5484/soorim-menu`
- **최종 코드 확인일:** 2026-08-03
- **관련 문서:** [전체 목차](README.md) · [예약 앱](01-RESERVATION-APP.md) · [TV 모드](02-TV-MODE.md) · [메뉴판](03-MENU-APP.md) · [안전한 수정](05-SAFE-CHANGE-RULES.md)

> 실제 코드가 문서와 다를 경우 최신 코드가 우선이며 문서를 함께 갱신해야 한다.

## 1. 공통 개발 절차

1. 대상 저장소에서 `git switch main`, `git pull --ff-only`로 최신 `main`을 확인한다.
2. 관련 `docs/`와 실제 파일을 읽는다.
3. `git switch -c <새-작업-브랜치>`로 매번 새 브랜치를 만든다.
4. 요청 범위만 수정하고 `git diff -- <파일>`로 중간 확인한다.
5. 로컬 서버와 대상 기기 크기에서 확인한다.
6. `git diff --check`, 변경 파일 목록과 금지 파일 여부를 검사한다.
7. 커밋하고 새 PR을 만든다.
8. PR의 전체 diff, 사용자 테스트 항목과 캐시 변경 필요 여부를 검토한다.
9. 승인 후 `main`에 머지한다.
10. Pages 배포 완료 후 실제 운영 URL을 새로 열어 확인한다.

## 2. 예약 앱 (`cij5484/soorim`)

- 주 구현은 `index.html`; PWA는 `manifest.json`, `manifest-tv.json`, `service-worker.js`; 안내 데이터는 `help-data.js`이다. 요청하지 않은 파일을 함께 정리하지 않는다.
- 로컬: `py -m http.server 5173 --bind 127.0.0.1`, 접속 `http://127.0.0.1:5173/`. `package.json`이 없으므로 npm 설치·빌드 명령을 사용하지 않는다.
- 저장소에는 정적 Replit 설정(`.replit`)은 있으나 GitHub Actions Pages 워크플로는 확인되지 않았다. GitHub Pages의 실제 source/활성 상태는 Settings → Pages에서 확인한다.
- GitHub Pages는 HTML·JS·CSS·이미지를 전달한다. Firestore는 예약 데이터를 저장하고 실시간 전달하며 Firebase Authentication은 수정 권한 로그인을 담당한다. Pages와 Firestore를 같은 “서버”로 취급하지 않는다.
- 앱 실행 결과나 선캐시 파일 변경 시에만 최신 `service-worker.js`의 `CACHE_NAME`을 확인해 갱신한다. 문서만 수정하면 바꾸지 않는다.

## 3. 메뉴판 앱 (`cij5484/soorim-menu`)

- 운영 주소는 `https://cij5484.github.io/soorim-menu/`이며 최신 manifest의 `id`, `start_url`, `scope`는 `/soorim-menu/`이다.
- 주요 수정 대상은 별도 저장소의 `index.html`, `manifest.json`, `service-worker.js`, `images/`, `icons/menu-icon.svg`이다. 예약 저장소의 동명 파일이나 과거 `menu/` 스냅샷으로 대신 배포하지 않는다.
- 최신 `main`에는 `package.json`과 GitHub Actions Pages 워크플로가 없다. 빌드 없는 정적 파일을 GitHub Pages 프로젝트 경로 `/soorim-menu/`에서 제공하므로 npm·Vite·React 명령을 사용하지 않는다. GitHub 웹 설정 화면의 Pages source 선택값은 설정을 변경할 때 Settings → Pages에서 별도로 확인한다.
- 저장소 루트에서 `py -m http.server 5173 --bind 127.0.0.1`로 열고 `http://127.0.0.1:5173/`에서 언어·이미지·모바일 레이아웃을 점검한다. 이 로컬 주소는 테스트용이며 실제 운영 주소를 대체하지 않는다.
- 앱 또는 선캐시 파일 변경 시 메뉴 저장소 최신 `service-worker.js`의 `MENU_CACHE_NAME`만 확인해 현재 번호를 한 단계 올린다. 예약 앱의 `CACHE_NAME`과 혼동하거나 함께 수정하지 않는다.

## 4. PWA 캐시 규칙

**번호를 올리는 경우**

- `index.html`의 기능 또는 UI 변경
- service worker가 캐시하는 파일 내용/목록 변경
- 설치형 PWA에 새 코드가 반영되어야 하는 변경

**번호를 올리지 않는 경우**

- `docs/`의 Markdown만 변경
- `README.md` 등 문서만 변경
- 앱 실행 결과에 영향 없는 문서 작업

작업 순서는 (1) 대상 앱의 현재 캐시 상수를 실제 파일에서 확인, (2) 끝 번호를 정확히 1 증가, (3) diff로 한 단계만 바뀌었는지 확인이다. 여러 단계를 임의로 올리거나 다른 앱의 캐시 이름을 수정하지 않는다.

## 5. 배포 후 예전 화면이 보일 때

1. GitHub Pages 배포가 대상 커밋으로 완료됐는지 확인한다.
2. 브라우저를 새로고침한다.
3. 홈 화면 앱을 완전히 종료하고 다시 실행한다.
4. 개발자 도구에서 브라우저 Cache Storage와 응답 파일을 확인한다.
5. Application → Service Workers에서 등록 URL, scope, 활성 worker를 확인한다.
6. 계속되면 홈 화면 PWA를 제거한 뒤 다시 설치한다.
7. 배포된 `service-worker.js`의 캐시 버전이 커밋과 같은지 확인한다.

## 6. PR 확인 기준

- PR 번호와 제목이 작업을 정확히 설명하는가?
- 변경 파일이 요청 범위뿐인가?
- [민감 기능](05-SAFE-CHANGE-RULES.md#2-매우-민감한-기능)을 요청 없이 건드리지 않았는가?
- 캐시 번호 변경이 필요한 작업인가? 필요 없다면 그대로인가?
- `git diff --check`와 가능한 문법 검사가 통과했는가?
- PC/모바일/PWA 등 실제 사용자 흐름을 테스트했는가?
- 실패·미확인 사항을 숨기지 않았고 머지 가능한가?

# 수림횟집 외국어 메뉴판 앱

- **문서 목적:** 별도 메뉴판 저장소의 정적 구조, 언어·이미지·PWA 운영 기준을 예약 앱과 분리해 기록한다.
- **대상 저장소:** `cij5484/soorim-menu` (`main`, 읽기 전용 조사 대상)
- **최종 코드 확인일:** 2026-08-03
- **관련 문서:** [전체 목차](README.md) · [개발·배포](04-DEVELOPMENT-DEPLOYMENT.md) · [안전한 수정](05-SAFE-CHANGE-RULES.md)

> `cij5484/soorim-menu` 최신 `main`을 직접 확인해 작성했다. 실제 코드가 문서와 다를 경우 최신 코드가 우선이며 문서를 함께 갱신해야 한다.

## 1. 기본 정보

- **저장소/브랜치:** `cij5484/soorim-menu`, `main`. 예약 앱과 다른 저장소이므로 예약 앱의 `menu/` 파일을 대신 수정하지 않는다.
- **운영 주소:** `https://cij5484.github.io/soorim-menu/`. 최신 `manifest.json`의 `id`, `start_url`, `scope`도 모두 `/soorim-menu/`이다.
- **기술 구조:** `index.html`에 HTML, CSS, JavaScript와 메뉴 데이터를 둔 빌드 없는 정적 앱이다. `package.json`이 없으므로 npm·Vite·React 프로젝트가 아니며 `npm install`, `npm run dev`, `npm run build`를 사용하지 않는다.
- **PWA/기기:** `manifest.json`과 `service-worker.js`가 있는 세로형 standalone PWA이며, 실제 manifest 아이콘은 `./icons/menu-icon.svg`이다. 손님 모바일 사용을 중심으로 반응형 UI를 제공한다.

## 2. 주요 파일

최신 `main`에서 확인한 주요 파일은 다음과 같다.

| 경로 | 역할 |
|---|---|
| `index.html` | 메뉴, 번역 데이터, 언어 전환, 반응형 UI와 About 수림 |
| `manifest.json` | 앱 이름, `/soorim-menu/`의 `id`·`start_url`·`scope`, `./icons/menu-icon.svg` 아이콘 |
| `service-worker.js` | 메뉴판 전용 정적 캐시. `index.html`이 `./service-worker.js`를 `scope: "./"`로 등록한다. |
| `icons/menu-icon.svg` | manifest에서 실제 사용하는 PWA 아이콘 |
| `images/` | `index.html`에서 참조하는 메뉴 및 안내 이미지 |

최신 `main`에는 `README.md`, `package.json`, GitHub Actions Pages 워크플로가 없다. 따라서 별도 빌드 단계 없이 저장소의 정적 파일을 GitHub Pages의 `/soorim-menu/` 프로젝트 경로에서 제공한다. GitHub 웹 설정 화면 내부의 Pages source 선택값은 저장소 파일만으로 확인할 수 없으므로, 배포 설정을 바꿀 때 Settings → Pages에서 확인한다.

## 3. 지원 언어

언어 버튼의 `data-lang`에서 확인된 구현 언어는 **한국어(`ko`, 기본), 영어(`en`), 일본어(`ja`), 중국어 간체(`zh`), 중국어 번체(`zhTw`), 베트남어(`vi`), 필리핀어(`fil`), 러시아어(`ru`), 몽골어(`mn`)**이다.

`applyLanguage()`가 버튼 활성 상태, 각 렌더 함수, 문서 `lang`과 `localStorage` 키 `soorim-menu-lang`을 갱신한다. 시작 시 저장값이 없으면 `ko`를 쓴다. 일부 번체는 간체 번역, 일부 필리핀어는 영어를 fallback으로 사용할 수 있으므로 “버튼 존재”와 “모든 문구의 독립 번역 완료”를 같은 뜻으로 보지 않는다.

## 4. 메뉴판 운영 규칙

- 코스는 `courseMenus`와 `renderCourse()`가 그리며 코스는 2인 이상, 가격은 1인 기준이라는 안내가 있다. 전체 안내에는 1인 1주문 원칙도 있다.
- 코스/점심에 포함된 매운탕을 맵지 않은 지리탕으로 바꿀 수 있다는 안내가 있다.
- 점심특선은 오후 2:30까지 주문 가능하다고 표시한다.
- `best` 값과 `★ BEST` 배지가 대표 메뉴를 표시한다. 가격은 메뉴별 번역 객체의 `price` 또는 크기별 `prices`를 렌더하므로 숫자만 한 군데 고치면 된다고 가정하지 않는다.
- `<meta name="viewport">`, 미디어 쿼리와 반응형 카드/가로 스크롤 구조를 사용한다. 사용자 확대 허용 여부의 세부 브라우저 동작은 실제 기기에서 **확인 필요**하다.
- About 수림은 `about-modal`, `aboutTexts`, `renderAboutModal()`로 매장 소개와 운영 철학을 언어별 표시한다.

## 5. 이미지 관리

1. 실제 파일은 `images/`, 아이콘은 `icons/`에서 확인한다.
2. 파일명을 바꾸면 `index.html`에서 기존 `images/파일명`을 모두 검색하고, 선캐시 대상이면 `service-worker.js`도 수정한다.
3. GitHub Pages는 Linux 기반 경로처럼 대소문자를 구분한다. `.JPG`와 `.jpg`, 하이픈과 철자를 정확히 맞춘다.
4. 이미지가 안 나오면 개발자 도구 Network의 404, HTML 경로, 실제 Git 파일명/대소문자, Pages 배포 커밋, service worker의 이전 캐시 순으로 확인한다.

## 6. PWA와 캐시

최신 `service-worker.js`의 상수는 `MENU_CACHE_NAME`, 작성 당시 참고값은 `soorim-menu-v2`이다. 이 값은 영구 고정값이 아니므로 다음 변경 전에는 **별도 저장소 최신 `service-worker.js` 첫 줄을 다시 확인**한다.

- `index.html`, `manifest.json` 또는 선캐시 이미지 등 앱 결과가 바뀌면 현재 번호를 정확히 1 올린다.
- Markdown 문서만 바꾸면 올리지 않는다.
- 이전 화면이면 Pages 배포 확인 → 새로고침 → 앱 완전 종료 → 브라우저/서비스워커 캐시 확인 → 필요 시 홈 화면 앱 재설치 순으로 확인한다.
- 예약 앱의 `CACHE_NAME`과 메뉴 앱의 `MENU_CACHE_NAME`은 서로 다른 값이다. 한 앱 작업으로 다른 앱 캐시를 수정하지 않는다.

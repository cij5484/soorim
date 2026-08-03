# 수림횟집 외국어 메뉴판 앱

- **문서 목적:** 별도 메뉴판 저장소의 정적 구조, 언어·이미지·PWA 운영 기준을 예약 앱과 분리해 기록한다.
- **대상 저장소:** `cij5484/soorim-menu` (`main`, 읽기 전용 조사 대상)
- **최종 코드 확인일:** 2026-08-01
- **관련 문서:** [전체 목차](README.md) · [개발·배포](04-DEVELOPMENT-DEPLOYMENT.md) · [안전한 수정](05-SAFE-CHANGE-RULES.md)

> 실제 코드가 문서와 다를 경우 최신 코드가 우선이며 문서를 함께 갱신해야 한다. 이번 조사 환경에서는 외부 저장소 원격 접속이 차단되어, `cij5484/soorim`에 포함된 읽기 전용 `menu/` 스냅샷과 그 Git 이력으로 구조를 대조했다. 따라서 별도 저장소 최신 `main`의 커밋·운영 주소·현재 캐시는 배포 작업 전에 **확인 필요**하다.

## 1. 기본 정보

- **저장소/브랜치:** `cij5484/soorim-menu`, `main`. 예약 앱과 다른 저장소이므로 예약 앱의 `menu/` 파일을 대신 수정하지 않는다.
- **운영 주소:** **확인 필요**. 저장소 이름만으로 URL을 추측하지 말고 별도 저장소의 Settings → Pages와 최신 `manifest.json`의 `start_url`을 함께 확인한다.
- **기술 구조:** 확인한 스냅샷은 `index.html`에 CSS·JavaScript·메뉴 데이터를 둔 빌드 없는 정적 앱이다. `package.json`은 확인되지 않았다.
- **PWA/기기:** `manifest.json`, `service-worker.js`, 192/512 아이콘이 있는 세로형 standalone PWA이며 손님 모바일 사용을 중심으로 반응형 UI를 제공한다.

## 2. 주요 파일

확인한 구조에는 다음 파일만 있다.

| 경로 | 역할 |
|---|---|
| `index.html` | 메뉴, 번역 데이터, 언어 전환, 반응형 UI와 About 수림 |
| `manifest.json` | 앱 이름, 시작 주소·범위, 아이콘 |
| `service-worker.js` | 메뉴판 전용 정적 캐시 |
| `icons/icon-192.png`, `icons/icon-512.png`, `icons/menu-icon.svg` | PWA/메뉴 아이콘 |
| `images/` | 메뉴 및 와이파이 QR 이미지. 확인된 파일은 `b-course.JPG`, `hoedeopbap.JPG`, `kids-donkatsu.JPG`, `live-octopus.JPG`, `lunch-set.JPG`, `mulhoe.JPG`, `sashimi-red-sea-bream.JPG`, `wifi-qr.JPG`, `wooreok-maeuntang.JPG`, `wooreok-tangsuyuk.JPG` 등 |

별도 `README.md`, `package.json`, GitHub Actions Pages 워크플로의 최신 존재 여부는 외부 저장소에서 **확인 필요**하다.

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

확인한 스냅샷의 상수는 `MENU_CACHE_NAME`, 참고값은 `soorim-menu-v3`이다. 이 값은 문서 작성 당시 참고일 뿐이며 다음 변경 전에는 **별도 저장소 최신 `service-worker.js` 첫 줄을 다시 확인**한다.

- `index.html`, `manifest.json` 또는 선캐시 이미지 등 앱 결과가 바뀌면 현재 번호를 정확히 1 올린다.
- Markdown 문서만 바꾸면 올리지 않는다.
- 이전 화면이면 Pages 배포 확인 → 새로고침 → 앱 완전 종료 → 브라우저/서비스워커 캐시 확인 → 필요 시 홈 화면 앱 재설치 순으로 확인한다.
- 예약 앱의 `CACHE_NAME`과 메뉴 앱의 `MENU_CACHE_NAME`은 서로 다른 값이다. 한 앱 작업으로 다른 앱 캐시를 수정하지 않는다.

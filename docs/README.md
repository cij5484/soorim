# 수림 앱 개발·운영 문서

- **문서 목적:** 예약관리 앱, TV 화면, 외국어 메뉴판의 저장소·개발·배포 기준을 구분하는 중앙 안내서
- **대상 저장소:** `cij5484/soorim` (메뉴판 참고 저장소: `cij5484/soorim-menu`)
- **최종 코드 확인일:** 2026-08-03
- **관련 문서:** [예약관리 앱](01-RESERVATION-APP.md) · [TV 모드](02-TV-MODE.md) · [메뉴판 앱](03-MENU-APP.md) · [개발·배포](04-DEVELOPMENT-DEPLOYMENT.md) · [안전한 수정](05-SAFE-CHANGE-RULES.md)

> 실제 코드가 문서와 다를 경우 최신 코드가 우선이며 문서를 함께 갱신해야 한다.

## 1. 문서의 목적

여러 화면의 저장소, 개발 방식과 배포 방식을 섞지 않기 위한 시작점이다. 작업 전 이 목차와 작업 대상의 상세 문서를 반드시 먼저 읽는다. 이 문서에는 비밀번호, 인증정보 또는 Firebase 설정값을 기록하지 않는다.

## 2. 앱 전체 목록

| 앱 | 용도 | 저장소 | 실제 운영 주소 | 주요 파일 | 데이터 저장 방식 | 배포 방식 | PWA | 기기 |
|---|---|---|---|---|---|---|---|---|
| 예약관리 앱 | 예약 조회·등록·운영 | `cij5484/soorim` | `https://cij5484.github.io/soorim/app/` (`manifest.json`의 `start_url`) | `index.html`, `app/index.html`, `manifest.json`, `service-worker.js`, `help-data.js` | Firebase Firestore `reservations`; Firebase Authentication | 저장소 파일을 정적으로 제공하는 GitHub Pages 구조. Pages 설정 화면/워크플로 파일은 저장소에서 확인되지 않아 최종 배포 설정은 **확인 필요** | 예 | 매장 PC·모바일 |
| PC TV 화면 | 당일 예약 현황 표시 | `cij5484/soorim` | `https://cij5484.github.io/soorim/tv/` (`manifest-tv.json`의 `start_url`) | 같은 `index.html`, `tv/index.html`, `manifest-tv.json`, TV 이미지 | Firestore 날짜별 `reservations`; 취소 표시 일부는 브라우저 `localStorage` | 예약 앱과 같은 정적 배포 | 예 | PC/대형 화면 |
| 모바일 TV 화면 | 모바일용 예약 현황·상태·착석 관리 | `cij5484/soorim` | 위 TV 주소와 동일하며 화면 폭으로 모바일 UI 선택 | 같은 `index.html`, `tv/index.html`, `manifest-tv.json` | 날짜별 `reservations`, `tableOccupancy/{날짜}` | 예약 앱과 같은 정적 배포 | 예 | 모바일 |
| 외국어 메뉴판 | 다국어 메뉴·매장 안내 | 별도 저장소 `cij5484/soorim-menu` | `https://cij5484.github.io/soorim-menu/` | `index.html`, `manifest.json`, `service-worker.js`, `images/`, `icons/menu-icon.svg` | 정적 코드의 메뉴 데이터와 언어 선택 `localStorage` | 빌드 없이 `/soorim-menu/` 경로에 제공하는 GitHub Pages 정적 배포 | 예 | 손님 모바일 중심 |

운영 주소와 로컬 테스트 주소는 다르다. `http://127.0.0.1:5173`은 개발 중 확인에만 쓴다. URL 근거와 제한은 각 상세 문서를 참고한다.

## 3. 문서 목차

1. [수림횟집 예약관리 앱](01-RESERVATION-APP.md)
2. [수림 예약 TV 모드](02-TV-MODE.md)
3. [수림횟집 외국어 메뉴판 앱](03-MENU-APP.md)
4. [개발·테스트·배포 절차](04-DEVELOPMENT-DEPLOYMENT.md)
5. [안전한 수정 원칙](05-SAFE-CHANGE-RULES.md)

## 4. 작업 시작 전 기본 순서

1. 원격 `main`을 가져와 최신 커밋을 확인한다.
2. 이 목차와 대상 문서를 읽는다.
3. 실제 파일, 함수와 변수를 검색해 문서가 여전히 맞는지 확인한다.
4. 최신 `main`에서 매번 새 작업 브랜치를 만든다. 이전 PR 브랜치를 재사용하지 않는다.
5. 요청된 최소 범위만 수정한다.
6. 로컬 서버로 대상 화면을 테스트한다.
7. 커밋하고 새 PR을 만든다.
8. PR의 전체 diff와 변경 파일을 검토한다.
9. 사용자 테스트 후 머지한다.
10. GitHub Pages 배포 완료와 실제 운영 화면을 확인한다.

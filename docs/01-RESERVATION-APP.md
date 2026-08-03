# 수림횟집 예약관리 앱

- **문서 목적:** 실제 예약관리 코드의 구조, 운영 규칙과 안전한 확인 지점을 설명한다.
- **대상 저장소:** `cij5484/soorim` (`main`)
- **최종 코드 확인일:** 2026-08-03
- **관련 문서:** [전체 목차](README.md) · [TV 모드](02-TV-MODE.md) · [개발·배포](04-DEVELOPMENT-DEPLOYMENT.md) · [안전한 수정](05-SAFE-CHANGE-RULES.md)

> 실제 코드가 문서와 다를 경우 최신 코드가 우선이며 문서를 함께 갱신해야 한다. 함수명과 캐시 값은 작성 시점 참고값이므로 작업할 때 다시 검색한다.

## 1. 기본 정보

- **운영 주소:** `manifest.json`의 `start_url`과 `scope`가 `/soorim/app/`이므로 `https://cij5484.github.io/soorim/app/`이다. GitHub Pages 활성 설정 자체는 저장소 파일에서 확인되지 않아 배포 장애 시 저장소 Settings에서 재확인한다.
- **구조:** 빌드 없는 정적 HTML 앱이다. 화면, CSS, JavaScript 모듈이 주로 `index.html` 한 파일에 있고 Firebase SDK를 CDN에서 가져온다. `package.json`은 없다. React·Vite·npm 프로젝트가 아니다.
- **기기:** 매장 PC와 모바일 브라우저/PWA.
- **데이터:** Firestore의 `reservations` 컬렉션. 모바일 TV 착석 정보는 `tableOccupancy/{날짜}` 문서에 별도로 저장한다.
- **인증:** Firebase Authentication의 이메일/비밀번호 로그인(`getAuth`, `signInWithEmailAndPassword`, `onAuthStateChanged`). 계정이나 Firebase 설정값은 문서화하지 않는다.

## 2. 주요 파일 역할

| 파일 | 역할 |
|---|---|
| `index.html` | 예약 앱과 PC/모바일 TV의 실제 UI, 스타일, Firebase/Firestore 로직 |
| `app/index.html` | `/soorim/app/` 진입용 파일. 실제 동작을 바꾸기 전 루트 `index.html`과의 관계를 확인한다. |
| `service-worker.js` | 루트 예약/TV PWA 파일을 캐시한다. 작성 시점 `CACHE_NAME`은 `soorim-reservation-v69`이나 항상 첫 줄을 다시 확인한다. |
| `manifest.json` | 예약 PWA 이름, 아이콘, `/soorim/app/` 시작 주소·범위 |
| `manifest-tv.json` | TV PWA 이름, 아이콘, `/soorim/tv/` 시작 주소·범위 |
| `tv/index.html` | `/soorim/tv/` 진입용 파일 |
| `help-data.js` | 앱 내 사용설명서 데이터. `loadHelpDataOnce()`가 필요할 때 읽는다. |
| `server.js`, `.replit` | Replit용 정적 서버와 실행/배포 설정. `package.json` 기반 빌드는 아니다. |

## 3. 로컬 실행

저장소 루트에서 다음처럼 정적 서버를 연다.

```text
py -m http.server 5173 --bind 127.0.0.1
```

Windows에서 `py` 명령이 없으면 같은 Python의 `python -m http.server 5173 --bind 127.0.0.1` 사용 가능 여부를 확인한다. 기본 확인 주소는 `http://127.0.0.1:5173/`이다. 경로 기반 PWA 동작은 운영 환경과 다를 수 있다. `localhost`와 `127.0.0.1`은 테스트용이며 매장 운영 주소를 대체하지 않는다. `npm install`, `npm run dev`, `npm run build`는 사용하지 않는다.

## 4. 주요 기능과 확인 위치

`index.html`에서 다음 이름을 검색하면 구현 시작점을 찾을 수 있다.

- 월간·주간·일간: `renderMonthView()`, `renderWeekView()`, `renderDayView()`
- 추가·수정·삭제: `addReservation()`, `editReservation()`, `deleteReservationFromModal()`
- 검색: `runSearch()`, `renderSearchResults()`
- 홀·룸 좌석맵과 이동: `renderSeatMapContent()`, `moveReservationToTable()`
- 충돌: `isConflict()`, `isTimeConflict()`, 새 예약 팝업 `openNewReservationConflictModal()`
- 복사 예약 불러오기: `previewImport()`, `parseReservationBlock()`, `confirmImport()`
- 중복·기존 예약 반영·취소 의심: `getImportPreviewDuplicateInfo()`, `findMatchingImportedReservation()`, `makeImportMergedReservation()`, `isSameCancelSuspectReservation()`
- 문자·전화: `smsReservationCustomer()`, `callReservationCustomer()` 계열을 실제 코드에서 재검색한다.
- 기본세팅·전체세팅: 예약 카드 설정 관련 `toggleSettingStatusById()`, TV 설정 함수와 화면 문구를 함께 확인한다.
- Firestore/PWA: [9절](#9-firestore-읽기-구조)과 `service-worker.js`.

## 5. 좌석 규칙

- 홀 테이블: **3~19**.
- 1실: **21, 22, 23, 24** / 2실: **31, 32, 33, 34** / 3실: **41, 42, 43, 44** / 4실: **51, 52, 53, 54** / 5실: **61, 62, 63, 64**.
- 코드상 룸 예약에서 `table`이 비어 있으면 `isRoomFullUsage()`가 그 룸의 **전체 사용**으로 판단한다. UI에서 모든 방을 선택한 값 `room: "전체"`과 “1실 전체”(1실을 고르고 세부 테이블을 지정하지 않은 상태)를 혼동하지 않는다.
- 부분 사용은 `table`에 실제 번호를 저장한다. `isConflict()`는 같은 날짜, `isTimeConflict()`로 겹치는 시간, 같은 좌석을 차례로 검사한다. 룸은 같은 방에서 어느 한쪽이 전체 사용이면 충돌하고, 둘 다 부분 사용이면 번호가 겹칠 때 충돌한다.
- `tableReleased === true`인 예약은 `isConflict()`에서 충돌하지 않는다. 예약 기록 자체를 지우는 기능이 아니다.

## 6. 인원 표시 규칙

표시의 기준 함수는 `getPeopleDisplayText()`이고 `getTVPeopleText()`도 이를 호출한다.

1. 직접 입력된 `peopleText`가 있으면 최우선이다(과거 자동 문구는 예외 처리).
2. 성인과 아이가 함께 있으면 `성인4 아이2`처럼 구분한다.
3. 성인만 4명이면 `4명`, 아이만 2명이면 `아이2`이다.
4. 구형 데이터에 `people`만 있으면 그 숫자를 사용한다.

성인 수는 메뉴 수량과 관련된 운영 데이터이고 아이 수는 좌석 수와 관련될 수 있다. 정리 작업이라는 이유로 이 관계나 필드를 임의로 없애지 않는다.

## 7. 테이블 사용 종료

- 필드: 불리언 `tableReleased`, ISO 시각 문자열 또는 `null`인 `releasedAt`.
- `addReservation()`은 기존 예약 수정 때 체크 상태를 읽고, 처음 종료할 때만 `releasedAt`을 만든다. 종료를 풀면 `releasedAt`은 `null`이다. 기존 `status`는 보존하며 예약 문서를 삭제하지 않는다.
- `editReservation()`은 수정창의 종료 체크박스를 기존 값으로 채운다. 새 예약 `openModal()`과 불러오기 편집 `editPreviewItem()`은 이 항목을 숨기거나 초기화한다.
- `isConflict()`와 `findImportReservationConflict()`는 종료된 예약을 충돌 대상에서 제외한다.
- 불러오기 충돌에서 `releaseConflictReservationById()`가 기존 예약에 두 필드를 병합한다.
- 일반 새 예약 충돌 팝업에서는 `releaseNewReservationConflictAndRetry()`가 기존 예약을 종료 처리한 뒤 저장을 다시 시도한다. 중복 클릭 방어 상태도 있으므로 팝업만 따로 바꾸지 않는다.

## 8. 불러오기 주의사항

1. `previewImport()`가 붙여 넣은 텍스트를 날짜 섹션별로 나누고 `parseReservationBlock()`이 블록을 해석한다. 날짜 제목·줄 경계를 임의로 단순화하지 않는다.
2. `extractPeople()` 결과와 직접 범위 표현인 `peopleText`를 보존한다.
3. `extractMenu()`의 메뉴명·수량 처리와 성인 수 관계를 함께 확인한다.
4. `extractFirstLineMemo()`와 광고성 판정 `isAdReservation()`은 체험단·리뷰노트·릴스촬영 같은 메모를 다룬다.
5. 미리보기 앞 항목뿐 아니라 전체 `reservations`와 비교하는 `findMatchingImportedReservation()`, `getImportPreviewDuplicateInfo()`, `findImportReservationConflict()`를 함께 검토한다.
6. 일치한 기존 예약은 `makeImportMergedReservation()`으로 운영 필드를 보존하고, `hasImportReservationChanged()`로 변경 여부를 판정한다.
7. 취소 의심은 `importCancelSuspectList`에 별도로 보여 준다. 자동 삭제하지 않는다. 삭제는 사용자가 확인한 뒤 `cancelImportSuspectReservation()`을 명시적으로 실행하는 흐름이다.

## 9. Firestore 읽기 구조

| 범위 | 상태/함수 | 동작 |
|---|---|---|
| 일반 앱 전체 | `reservations`, `unsubscribeReservations`, `subscribeReservations()`, `stopReservationsListener()` | `reservations` 전체 컬렉션을 `onSnapshot()`으로 실시간 구독하고 클라이언트에서 날짜·시간 정렬 |
| 일간 날짜 | `dayReservations`, `dayReservationsDate`, `dayReservationsReady`, `dayReservationsUnsubscribe`, `subscribeDayReservationsForDate()` | `where("date", "==", dateString)` 날짜별 구독 |
| TV 날짜 | `tvReservations`, `tvReservationsDate`, `tvReservationsReady`, `tvReservationsUnsubscribe`, `subscribeTvReservationsForDate()` | TV 대상 날짜만 구독하고 같은 날짜의 중복 리스너 생성을 방지 |

`getDayReservationsForCurrentDate()`와 `getTvReservationsForCurrentDate()`는 전용 구독이 준비되지 않았으면 `getReservationsForDateFromCache()`를 통해 전체 `reservations`에서 해당 날짜를 찾는 fallback을 사용한다. 이는 브라우저 영구 오프라인 캐시가 아니라 메모리의 전체 배열 fallback이다.

검색, 월·주간 집계, 불러오기 전체 비교, 충돌·저장, 일부 좌석맵/인덱스 기반 클릭 등은 아직 전체 `reservations`에 민감하게 의존한다. `?tv=1` 전용 진입은 전체 구독을 생략하고 TV 날짜 구독을 사용한다. 날짜 변경·화면 전환 시 `stopDayReservationsListener()`와 `stopTvReservationsListener()`의 unsubscribe 수명주기를 보존한다.

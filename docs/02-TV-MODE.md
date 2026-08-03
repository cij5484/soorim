# 수림 예약 TV 모드

- **문서 목적:** 같은 예약 앱 안의 PC TV와 모바일 TV 구조 및 서로 침범하지 않는 수정 기준을 설명한다.
- **대상 저장소:** `cij5484/soorim` (`index.html`)
- **최종 코드 확인일:** 2026-08-01
- **관련 문서:** [전체 목차](README.md) · [예약 앱](01-RESERVATION-APP.md) · [개발·배포](04-DEVELOPMENT-DEPLOYMENT.md) · [안전한 수정](05-SAFE-CHANGE-RULES.md)

> 실제 코드가 문서와 다를 경우 최신 코드가 우선이며 문서를 함께 갱신해야 한다. TV는 독립 저장소가 아니라 예약관리 앱과 같은 저장소와 같은 `index.html` 안의 별도 화면이다.

## 1. 기본 구조

- 루트 화면은 쿼리 `?tv=1`을 `isTvOnlyUrlMode()`로 검사한다. TV 전용 진입 파일 `tv/index.html`과 `manifest-tv.json`의 시작 주소 `/soorim/tv/`도 함께 확인한다.
- 페이지 시작 시 `?tv=1`이면 manifest 링크를 `manifest-tv.json`으로 바꾼다.
- `isMobileTvLayout()`/`isTVMobileScreen()`과 `mobile-tv-layout` body 클래스가 PC·모바일 레이아웃을 구분한다. 별도 데이터베이스나 별도 앱으로 오해하지 않는다.
- `renderTVView()`가 `getTVTargetDateString()`의 날짜를 정하고 `subscribeTvReservationsForDate()`로 Firestore `reservations` 중 해당 날짜만 구독한다.

## 2. PC TV 화면

`renderTVView()`의 PC 분기에는 날짜/시계, 사진, 예약 표(시간·예약자명·인원·좌석·메뉴), 상태 표현, 취소 레이어와 설정/출력 기능이 있다. 취소 내역은 `renderTVCanceledLayer()` 계열로 표시하며 브라우저 `localStorage`도 사용한다. 설정은 글자 크기, 행 높이, 열 너비, 프리셋 저장·불러오기·초기화와 출력을 제공한다.

**운영 원칙:** PC TV에서는 예약 행 클릭으로 상태를 바꾸지 않는다. `isMobileTVRowStatusToggleAllowed()`가 모바일 TV만 허용하는 보호 조건을 유지한다.

## 3. 모바일 TV 화면

- PC 표와 별도 모바일 마크업/스타일을 `renderTVView()`에서 렌더링한다.
- 예약 행에는 `data-tv-status-toggle-row`, `data-reservation-id`, `data-current-status`가 붙는다. `ensureTVRowStatusClickHandler()`가 문서에 이벤트 위임을 한 번만 등록하고 `handleTVRowStatusClick()`이 행 클릭을 처리한다.
- 버튼·링크·입력 요소 클릭은 행 토글에서 제외한다. 행 전체 클릭으로 `예약`과 `도착`을 전환하며 상태 버튼/상태 뱃지를 새로 추가하지 않는다.
- `toggleTVRowStatus(reservationId, currentStatus)`는 문서 ID를 기준으로 `reservations/{reservationId}`에 **`status` 필드만** `{ merge: true }`로 갱신한다.
- 모바일 버튼줄에는 취소, QR, `M` 기능이 있다. 각각의 모달/버튼 이벤트가 행 클릭으로 전파되어 상태까지 바뀌지 않는지 확인한다.

## 4. `M` 버튼: 현재착석테이블확인

- 모바일 TV 전용 좌석맵이며 `openMobileTvSeatMapModal()`에서 연다.
- `ensureMobileTvSeatOccupancySubscription()`은 Firestore 문서 `tableOccupancy/{날짜}`를 구독하고 `occupiedTables` 배열을 읽는다.
- 예약에 매핑된 테이블은 기본적으로 `X`(사용 중)이다. 수동 값은 일반 테이블 번호와 `off:테이블번호` 두 종류다.
- 예약 없는 테이블을 누르면 `toggleMobileTvOccupiedTable()`이 일반 번호를 추가/제거한다. 예약 있는 테이블을 수동으로 비우면 `off:` 키를 사용한다.
- `isMobileTvTableOccupiedForDisplay()`는 예약 여부, 수동 사용, 수동 해제를 합쳐 표시를 판단한다. `renderMobileTvEmptyTables()`의 빈 테이블은 “예약 매핑이 없고 수동 사용도 아닌 테이블”이다. 예약 테이블의 `off:` 표시는 화면 표시를 비우지만 예약 자체를 수정하지 않는다.

## 5. 주요 변수와 함수

작성 시점 `index.html`에서 확인된 이름만 적었다.

- 구독: `tvReservations`, `tvReservationsDate`, `tvReservationsUnsubscribe`, `tvReservationsReady`, `subscribeTvReservationsForDate()`, `stopTvReservationsListener()`
- 화면: `renderTVView()`, `isMobileTvLayout()`, `isTVMobileScreen()`, `syncMobileTvLayoutClass()`
- 모바일 상태: `isMobileTVRowStatusToggleAllowed()`, `toggleTVRowStatus()`, `handleTVRowStatusClick()`, `ensureTVRowStatusClickHandler()`
- M 기능: `mobileTvSeatOccupancyUnsubscribe`, `mobileTvOccupiedTables`, `ensureMobileTvSeatOccupancySubscription()`, `getMobileTvReservedByTable()`, `toggleMobileTvOccupiedTable()`, `openMobileTvSeatMapModal()`, `stopMobileTvSeatOccupancySubscription()`
- 취소/QR: `renderTVCanceledLayer()`, `openTVCanceledModal()`, `renderTVQrModal()`, `openTVQrModal()`

## 6. TV 작업 절대 원칙

1. 모바일 TV 요청으로 PC TV 마크업·동작을 수정하지 않는다. 반대도 같다.
2. 일반 예약 앱 모달·카드에 TV 전용 요소를 섞지 않는다.
3. `renderTVView()`가 반복될 때 새 Firestore 리스너를 계속 만들지 않는다. 기존 날짜·unsubscribe 방어를 유지한다.
4. 날짜 변경, 화면 종료와 레이아웃 전환에서 예약 및 착석 구독의 unsubscribe를 고려한다.
5. 모바일 상태 갱신은 reservation ID와 `status`만 사용한다. 인덱스 기반 전체 문서 덮어쓰기로 바꾸지 않는다.

# 일간 화면 id 기반 전환 조사

## 1. 현재 구조 요약
- 일간 화면 표시 목록은 `renderDayView()`에서 `getDayReservationsForCurrentDate(selectedDate)`를 호출해 구성합니다.
- `getDayReservationsForCurrentDate(dateString)`는 `dayReservationsReady && dayReservationsDate === dateString` 조건이 맞으면 `dayReservations`를 반환하여, 일간 날짜 1일 `onSnapshot` 데이터(일간 전용 구독 결과)를 우선 표시합니다.
- 일간 데이터가 아직 준비되지 않았거나 조건이 맞지 않으면 `getReservationsForDateFromCache(dateString)`로 fallback 하여 전체 `reservations` 캐시 기반 목록을 사용합니다.
- 일간 카드 클릭 기능(행 클릭 수정, 상태 버튼, TV 버튼, 이름 표시 체크)은 `dailyReservations`의 각 항목 `r.id`에 대해 `reservations.findIndex((item) => item?.id === r?.id)`로 `realIndex`를 구한 뒤 기존 index 기반 함수를 호출합니다.
- 이 구조는 현재 운영 동작은 가능하지만, `dayReservations` 표시 순서/구성과 전체 `reservations` 배열 index가 다를 수 있어 장기적으로는 id 기반 함수 병행 전환이 index 불일치 위험을 줄이는 방향입니다.
- 다만 일반 앱 전역의 전체 `reservations` 구독(onSnapshot) 제거는 아직 이르며, 이번 단계 결론에서도 유지가 필요합니다.

## 2. 현재 index/realIndex 의존 기능 목록

### 예약행 클릭 수정
- 관련 함수: `editReservation(index)`
- 현재 호출 방식: 일간 카드에서 `realIndex`를 계산 후 `editReservation(realIndex)`
- 현재 사용하는 값: `reservations[index]` 및 `editingIndex`, `editingReservationId`
- 전체 reservations index 의존 여부: 있음(호출은 realIndex 보정)
- id 기반 전환 가능성: 중간(별도 `editReservationById(id)` 추가 가능)
- 위험도: 높음
- 주의점: 모달 편집 상태/저장 흐름(`editingIndex`, `editingReservationId`, `saveReservation` 계열) 연동 영향이 큼

### 상태 버튼 예약/도착 변경
- 관련 함수: `toggleStatus(index)`
- 현재 호출 방식: 일간 카드에서 `toggleStatus(realIndex)`
- 현재 사용하는 값: `reservations[index]`의 `id`, `status`
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 높음
- 위험도: 낮음~중간
- 주의점: `setDoc(..., { status }, { merge: true })` 단일 필드 갱신이라 `toggleStatusById(id, currentStatus)` 병행 추가가 용이

### TV 버튼 토글
- 관련 함수: `toggleTVDisplay(index)`
- 현재 호출 방식: 일간 카드에서 `toggleTVDisplay(realIndex)`
- 현재 사용하는 값: `reservations[index]`의 `id`, `tvHidden`
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 높음
- 위험도: 낮음~중간
- 주의점: 단일 필드(`tvHidden`) 갱신 구조라 병행 함수 도입이 비교적 안전

### 예약자명 왼쪽 체크박스
- 관련 함수: `toggleNameDisplayMode(index, checked, element)`
- 현재 호출 방식: 일간 카드에서 `toggleNameDisplayMode(realIndex, this.checked, this)`
- 현재 사용하는 값: `reservations[index]`의 `id`, `nameDisplayMode`, UI checkbox element
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 높음
- 위험도: 중간
- 주의점: 실패 시 checkbox 롤백(`checkboxEl.checked = !checked`) 복구 로직 유지 필수

### 예약 삭제
- 관련 함수: `deleteReservation(index)`
- 현재 호출 방식: 일간 카드에서 `deleteReservation(realIndex)`
- 현재 사용하는 값: `reservations[index]` -> `targetId` -> `deleteDoc(doc(db, "reservations", targetId))`
- 전체 reservations index 의존 여부: 있음(삭제 실행은 id 사용)
- id 기반 전환 가능성: 중간
- 위험도: 높음
- 주의점: 실데이터 삭제 기능으로 운영 리스크가 커서 마지막 단계 권장

### 예약 저장/수정
- 관련 함수: `addReservation()` (실질 저장/수정), `editReservation(index)`, `closeModal()`, `deleteReservationFromModal()`
- 현재 호출 방식: 수정 진입 시 `editReservation(realIndex)` 후 `editingReservationId` 중심으로 저장 분기
- 현재 사용하는 값: `editingIndex`, `editingReservationId`, `reservations.find(...)`
- 전체 reservations index 의존 여부: 부분적으로 있음(현재는 id+index 혼합)
- id 기반 전환 가능성: 중간
- 위험도: 높음
- 주의점: 신규/수정 분기, 충돌 체크, 모달 상태 복원까지 연쇄 영향

### 기본세팅 체크박스
- 관련 함수: `toggleSettingStatus(index, field, checked)` (`field='basicSetting'`)
- 현재 호출 방식: 일간 카드에서 `toggleSettingStatus(realIndex, 'basicSetting', this.checked)`
- 현재 사용하는 값: `reservations[index]` + `setDoc(..., { [field]: checked }, { merge: true })`
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 중간~높음
- 위험도: 중간
- 주의점: 이미 안정 동작 중이고 권한/rules 영향 가능성이 있어 당장 전환 우선순위는 낮음

### 전체세팅 체크박스
- 관련 함수: `toggleSettingStatus(index, field, checked)` (`field='fullSetting'`)
- 현재 호출 방식: 일간 카드에서 `toggleSettingStatus(realIndex, 'fullSetting', this.checked)`
- 현재 사용하는 값: `reservations[index]` + `setDoc(..., { [field]: checked }, { merge: true })`
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 중간~높음
- 위험도: 중간
- 주의점: 기본세팅과 동일하게 현 상태 안정성 우선

### 문자 버튼
- 관련 함수: `openSmsTemplatePopup(index)`, `smsReservationCustomer(index, type)`
- 현재 호출 방식: 일간 카드에서 `openSmsTemplatePopup(realIndex)`
- 현재 사용하는 값: `reservations[index]`의 전화번호/예약정보
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 낮음(전환 실익 낮음)
- 위험도: 낮음
- 주의점: 읽기 절감 핵심 경로 아님, 현재 정상 동작 유지가 우선

### 전화 버튼
- 관련 함수: `callReservationCustomer(index)`
- 현재 호출 방식: 일간 카드에서 `callReservationCustomer(realIndex)`
- 현재 사용하는 값: `reservations[index]`의 전화번호
- 전체 reservations index 의존 여부: 있음
- id 기반 전환 가능성: 낮음(전환 실익 낮음)
- 위험도: 낮음
- 주의점: 읽기 절감과 직접 연관 낮아 현 구조 유지 권장

## 3. id 기반 전환 후보 분류표

### A. 비교적 먼저 전환 가능
- 상태 버튼 예약/도착 변경
- TV 버튼 토글
- 예약자명 왼쪽 체크박스

각 항목의 이유:
- 단일 필드 업데이트 성격(`status`, `tvHidden`, `nameDisplayMode`).
- `reservationId`와 현재 값만 있으면 Firestore 문서 업데이트가 가능.
- 기존 index 기반 함수를 유지한 채 병행 함수 추가가 가능.
- 단, 일반 일간/주간/검색 등 기존 동작 보존이 전제.

### B. 조사 후 조심스럽게 전환 가능
- 기본세팅 체크박스
- 전체세팅 체크박스

각 항목의 이유:
- 현재 정상 동작 중이라 즉시 전환 필요성이 낮음.
- 구조상 단일 필드 업데이트라 id 기반 병행 함수는 가능하나, 운영상 우선순위는 낮음.
- 권한/rules 정책과 결합될 수 있어 사전 점검 필요.

### C. 가장 마지막에 전환해야 함
- 예약행 클릭 수정
- 예약 삭제
- 예약 저장/수정

각 항목의 이유:
- `editReservation(index)`, `editingIndex`, `editingReservationId`, 저장 함수 흐름과 깊게 연결.
- 수정 모달 상태 관리가 index/id 혼합이라 전환 시 영향 범위 큼.
- 삭제는 실운영 데이터 직접 변경/삭제로 롤백 비용이 큼.
- 충돌 체크/테이블 관련 로직과 간접 결합되어 단계적 분리 필요.

### D. 전환 대상 아님 또는 현 구조 유지
- 문자 버튼
- 전화 버튼

각 항목의 이유:
- 사용자 액션 중심 기능으로 읽기 절감 효과가 직접적이지 않음.
- 현재 예약 객체 기반 정보 사용 흐름이 안정적.
- 우선순위가 낮아 현 구조 유지가 합리적.

## 4. 함수별 세부 조사

### editReservation(index)
- `reservations[index]`를 직접 참조하며, 수정 모달 진입 시 `editingIndex = index`를 설정합니다.
- 동시에 `editingReservationId = reservation.id`를 저장하여 id 기준 추적도 병행합니다.
- 모달 입력값(날짜/시간/이름/연락처/인원/좌석/메뉴/메모 등) 채움은 해당 reservation 객체를 기준으로 수행됩니다.
- `editReservationById(id)`를 추가하는 구조는 가능하며, 내부에서 `findIndex` 후 기존 함수 재사용하는 브릿지 방식이 안전합니다.
- 위험도: 높음. 이유는 모달 상태 변수와 저장/삭제 루틴 전체에 연결되어 있기 때문입니다.

### saveReservation()
- 실제 코드에서는 저장 함수명이 `addReservation()`이며, 수정 저장 여부는 `editingReservationId` 존재 여부로 구분합니다.
- 수정 시 `setDoc(doc(db, "reservations", editingReservationId), reservationData)`로 저장하고, 로컬 `reservations`도 id로 찾아 즉시 반영합니다.
- 신규 추가는 `addDoc(reservationsCollection, reservationData)` 경로를 사용합니다.
- id 기반 전환 고도화 시 `editingId` 단일 상태로 통일할 수 있으나, 기존 `editingIndex` 의존 지점 전수 점검이 선행되어야 합니다.
- 현 단계 직접 수정 금지 이유: 충돌 체크/모달 상태/후속 렌더까지 영향이 커서 운영 리스크가 높음.

### deleteReservation(index)
- 시작은 `reservations[index]` 참조지만 실제 삭제 실행은 `targetId`를 사용해 `deleteDoc(doc(db, "reservations", targetId))` 형태로 처리합니다.
- 삭제 후에도 배열 제거는 `id` 필터로 수행해 index 변동 문제를 줄이고 있습니다.
- `deleteReservationById(id)` 추가 자체는 가능하며, 내부에서 객체를 id로 조회해 확인 문구/삭제를 수행하면 됩니다.
- 다만 실제 삭제 기능은 운영 데이터 영향이 직접적이므로 가장 늦은 단계 전환이 안전합니다.

### toggleStatus(index)
- `reservations[index]`를 기준으로 현재 상태를 읽고, `도착 ↔ 예약` 토글 후 `status`만 `setDoc(..., { merge: true })`로 업데이트합니다.
- `id/currentStatus` 기반 별도 함수 분리가 용이합니다.
- 함수 내부에 `requireLogin()`은 없지만(호출 경로 제어에 의존), 권한/rules에서 write 권한이 통제될 수 있으므로 테스트 필요합니다.
- 우선 전환 후보가 맞습니다.

### toggleTVDisplay(index)
- `reservations[index]`에서 `tvHidden`만 토글하여 업데이트합니다.
- `id/currentHidden` 기반 별도 함수 분리 가능성이 높습니다.
- 카드의 TV badge(노출/제외 시각 상태)와 직접 연결되어 있어, 실패 시 UI 동기화만 유지하면 됩니다.
- 우선 전환 후보가 맞습니다.

### toggleNameDisplayMode(index, checked, element)
- `nameDisplayMode` 단일 필드 업데이트 함수입니다.
- `id/checked` 기반 별도 함수 분리가 가능합니다.
- 실패 시 `checkboxEl.checked = !checked`로 즉시 UI 복구하는 보호 로직이 이미 존재합니다.
- 우선 전환 후보이며, 복구 로직 보존이 핵심 조건입니다.

### 기본세팅/전체세팅 관련 함수
- 현재는 `toggleSettingStatus(index, field, checked)`로 index 기반 호출 후 내부 `r.id`로 `setDoc` 합니다.
- 즉 “완전 id 기반”은 아니며 “index 입력 + id 저장” 혼합 구조입니다.
- 따라서 “이미 id 기반이라 변경 불필요” 상태는 아니고, 필요 시 id 병행 함수 도입은 가능합니다.
- 다만 현재 정상 동작/우선순위/권한 영향 가능성을 고려하면 당장 변경하지 않는 것이 안전합니다.

## 5. 추천 구현 순서

### 20차 후보: 낮은 위험도 기능부터 id 기반 병행 함수 추가
- `toggleStatusById(reservationId, currentStatus)`
- `toggleTVDisplayById(reservationId, currentTvHidden)`
- `toggleNameDisplayModeById(reservationId, checked, element)`

조건:
- 기존 `toggleStatus(index)`, `toggleTVDisplay(index)`, `toggleNameDisplayMode(index, checked, element)`는 삭제하지 않음.
- 일간 화면에서만 id 기반 새 함수를 선택적으로 호출하는 점진 적용.
- 실패 시 UI 복구 처리(특히 이름 체크박스) 유지.
- Firestore 업데이트 방식은 기존과 동일하게 단일 필드만 수정.
- 일반 앱 전체 `reservations` 구독은 유지.

### 21차 이후 후보: 수정/삭제 id 기반 전환 조사
- `editReservationById(id)`
- `deleteReservationById(id)`
- `addReservation()`(= 저장/수정)에서 `editingId` 중심 상태 정리 가능성 조사

조건:
- 수정/삭제는 위험도가 높으므로 즉시 구현하지 않음.
- `editingIndex`와 모달 저장 흐름 전수 조사 후 단계적 적용.

### 장기 후보
- 전체 `reservations` 구독 축소/제거는 아직 보류.
- 월간/주간/검색/불러오기/충돌체크/테이블맵 연계 의존성 분리 후 별도 설계 필요.

## 6. 위험도 요약
- index 기반 함수는 dayReservations 표시 구조와 결합될 때 index 불일치 위험이 있습니다.
- 현재는 `realIndex` 보정으로 운영 가능하지만, 장기적으로는 id 기반 함수가 더 안전합니다.
- 단, 수정/삭제/저장은 운영 데이터에 직접 영향이 있어 마지막 단계로 미뤄야 합니다.
- 먼저 단일 필드 업데이트 기능(`status`, `tvHidden`, `nameDisplayMode`)부터 id 기반 병행 함수를 추가하는 것이 안전합니다.
- 일반 앱 전체 `reservations` 구독 제거는 아직 이릅니다.

## 7. 결론
- 20차에서는 상태 버튼/TV 버튼/이름 체크박스처럼 단일 필드 업데이트 기능부터 id 기반 병행 함수 전환을 검토할 수 있습니다.
- 예약행 클릭 수정, 예약 삭제, 예약 저장/수정은 아직 index 기반 유지가 안전합니다.
- 일반 앱 전체 `reservations` 구독 제거는 아직 보류해야 합니다.
- 이번 PR은 문서 조사만 수행하며 앱 동작 코드는 변경하지 않습니다.

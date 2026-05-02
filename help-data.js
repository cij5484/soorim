window.HELP_SECTIONS = [
  {
    id: "add-reservation",
    title: "새예약추가",
    titleEn: "Add Reservation",
    description: "새로운 손님 예약을 등록할 때 사용하는 기능입니다.",
    steps: [
      "화면 위쪽의 + 버튼을 누릅니다.",
      "예약 날짜와 시간을 선택합니다.",
      "예약자 이름과 전화번호를 입력합니다.",
      "성인/아이 인원수를 입력합니다.",
      "인원이 아직 정확하지 않으면 직접입력칸에 10~20명처럼 적습니다.",
      "홀 또는 룸을 선택합니다.",
      "메뉴가 정해졌으면 메뉴를 입력합니다.",
      "저장 버튼을 누릅니다."
    ],
    caution: [
      "전화번호를 모르면 비워둘 수 있습니다.",
      "직접입력칸에 값이 있으면 그 값이 인원 표시에서 우선 사용됩니다.",
      "저장 전 날짜와 시간을 꼭 확인하세요."
    ],
    managerNote: "Use this menu when adding a new customer reservation."
  },
  {
    id: "edit-reservation",
    title: "예약변경",
    titleEn: "Edit Reservation",
    description: "이미 등록된 예약 내용을 수정할 때 사용하는 기능입니다.",
    steps: [
      "수정하려는 예약 카드를 누릅니다.",
      "예약 수정 창이 열리면 필요한 내용을 바꿉니다.",
      "날짜, 시간, 인원, 좌석, 메뉴 등을 확인합니다.",
      "저장 버튼을 누릅니다."
    ],
    caution: [
      "시간이나 좌석을 바꾸면 다른 예약과 겹치지 않는지 확인해야 합니다.",
      "삭제 버튼은 예약을 완전히 지울 때만 사용하세요."
    ],
    managerNote: "Use this when changing an existing reservation."
  },
  {
    id: "send-message",
    title: "문자보내기",
    titleEn: "Send Message",
    description: "손님에게 예약 확인 문자를 보낼 때 사용하는 기능입니다.",
    steps: [
      "예약 카드의 문자 버튼을 누릅니다.",
      "오늘 예약 확인 또는 내일 예약 확인 중 하나를 선택합니다.",
      "자동으로 만들어진 문자 내용을 확인합니다.",
      "내용이 맞으면 문자 앱에서 전송합니다."
    ],
    caution: [
      "문자를 보내기 전 예약시간, 예약인원, 예약메뉴, 예약좌석을 꼭 확인하세요.",
      "메뉴가 정해지지 않은 예약은 메뉴 안내 문구가 추가될 수 있습니다."
    ],
    managerNote: "Use this button to send a reservation confirmation message."
  },
  {
    id: "call-customer",
    title: "전화걸기",
    titleEn: "Call Customer",
    description: "손님에게 바로 전화를 걸 때 사용하는 기능입니다.",
    steps: [
      "예약 카드의 전화 버튼을 누릅니다.",
      "전화 연결 확인창이 나오면 확인합니다.",
      "휴대폰 전화 앱으로 연결됩니다."
    ],
    caution: [
      "전화번호가 없는 예약은 전화걸기를 사용할 수 없습니다.",
      "실수로 누르지 않도록 확인창이 뜹니다."
    ],
    managerNote: "Use this button to call the customer."
  },
  {
    id: "search",
    title: "예약검색",
    titleEn: "Search Reservation",
    description: "손님 이름, 전화번호, 메뉴, 좌석 등으로 예약을 찾는 기능입니다.",
    steps: [
      "화면 위쪽 검색창을 누릅니다.",
      "손님 이름이나 전화번호 일부를 입력합니다.",
      "키보드의 Enter를 누릅니다.",
      "검색 결과에서 예약을 확인합니다.",
      "필요하면 바로 수정 또는 해당 날짜 보기 버튼을 누릅니다."
    ],
    caution: [
      "검색어를 너무 짧게 입력하면 결과가 많이 나올 수 있습니다.",
      "전화번호는 일부 숫자만 입력해도 찾을 수 있습니다."
    ],
    managerNote: "Use search to quickly find a reservation."
  },
  {
    id: "view-change",
    title: "월/주/일 보기",
    titleEn: "Month / Week / Day View",
    description: "예약을 월별, 주별, 일별로 나누어 보는 기능입니다.",
    steps: [
      "상단의 월 버튼을 누르면 한 달 예약을 볼 수 있습니다.",
      "상단의 주 버튼을 누르면 한 주 예약을 볼 수 있습니다.",
      "상단의 일 버튼을 누르면 하루 예약을 자세히 볼 수 있습니다.",
      "화살표 버튼으로 이전 날짜나 다음 날짜로 이동할 수 있습니다."
    ],
    caution: [
      "자세한 예약 확인과 수정은 일 보기에서 하는 것이 가장 편합니다.",
      "월 보기는 전체 흐름을 확인할 때 사용하면 좋습니다."
    ],
    managerNote: "Use these buttons to change the calendar view."
  },
  {
    id: "seat-map",
    title: "테이블맵",
    titleEn: "Seat Map",
    description: "홀과 룸의 테이블 예약 상태를 한눈에 확인하는 기능입니다.",
    steps: [
      "일간 화면에서 맵 버튼을 누릅니다.",
      "홀 또는 룸 버튼을 선택합니다.",
      "각 테이블에 표시된 예약 정보를 확인합니다.",
      "필요하면 테이블을 눌러 예약을 수정합니다.",
      "이동 버튼을 사용하면 예약 테이블을 옮길 수 있습니다."
    ],
    caution: [
      "테이블 이동 전 다른 예약과 겹치지 않는지 확인하세요.",
      "룸 전체 예약은 해당 룸의 모든 테이블을 사용하는 예약으로 봅니다."
    ],
    managerNote: "Use the seat map to check table and room reservations."
  }
];

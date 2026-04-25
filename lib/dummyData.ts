export type Expert = {
  id: string;
  name: string;
  nickname: string;
  returnRate: number; // 3개월 수익률 (%)
  followers: number;
  avatarColor: string;
  avatarInitial: string;
  todayTrade: boolean; // 오늘 매매 여부
  specialty: string;
};

export type Trade = {
  id: string;
  expertId: string;
  stockName: string;
  stockCode: string;
  exchange: "코스피" | "코스닥";
  type: "매수" | "매도";
  price: number;
  changeRate: number; // 등락률 (%)
  reason: string;
  indicators: string[];
  date: string;
  chartData: number[]; // 미니 차트용 가격 배열
};

export type ThemeKeyword = {
  id: string;
  label: string;
  changeRate: number;
  hot: boolean;
};

export const experts: Expert[] = [
  {
    id: "expert-1",
    name: "김민준",
    nickname: "반도체킹",
    returnRate: 34.7,
    followers: 12400,
    avatarColor: "#00C073",
    avatarInitial: "김",
    todayTrade: true,
    specialty: "반도체/IT",
  },
  {
    id: "expert-2",
    name: "이서연",
    nickname: "배당여왕",
    returnRate: 22.1,
    followers: 8900,
    avatarColor: "#F5C842",
    avatarInitial: "이",
    todayTrade: true,
    specialty: "배당/가치주",
  },
  {
    id: "expert-3",
    name: "박지훈",
    nickname: "방산마스터",
    returnRate: 41.3,
    followers: 15700,
    avatarColor: "#0A1628",
    avatarInitial: "박",
    todayTrade: false,
    specialty: "방산/우주",
  },
];

export const trades: Trade[] = [
  {
    id: "trade-1",
    expertId: "expert-1",
    stockName: "SK하이닉스",
    stockCode: "000660",
    exchange: "코스피",
    type: "매수",
    price: 178500,
    changeRate: 4.2,
    reason:
      "HBM4 공급 계약 체결 임박 소식이 들어왔어요. AI 서버 수요가 폭발적으로 늘고 있어서 하이닉스는 직접 수혜를 받을 거예요. RSI가 과매도 구간에서 반등하는 타이밍을 잡았습니다.",
    indicators: ["PBR 1.4배", "RSI 38", "HBM4 수혜"],
    date: "2026-04-24",
    chartData: [165000, 168000, 162000, 170000, 175000, 172000, 178500],
  },
  {
    id: "trade-2",
    expertId: "expert-2",
    stockName: "삼성전자",
    stockCode: "005930",
    exchange: "코스피",
    type: "매수",
    price: 74200,
    changeRate: 1.8,
    reason:
      "반기 배당 시즌이 다가오고 있어요. 지금 가격이면 배당수익률이 2.8% 나오는데, 은행 이자보다 훨씬 낫죠. 외국인들이 꾸준히 사들이고 있는 것도 긍정적이에요.",
    indicators: ["배당수익률 2.8%", "PBR 0.9배", "외국인 순매수"],
    date: "2026-04-24",
    chartData: [71000, 72500, 71800, 73000, 74000, 73500, 74200],
  },
  {
    id: "trade-3",
    expertId: "expert-1",
    stockName: "NAVER",
    stockCode: "035420",
    exchange: "코스피",
    type: "매도",
    price: 198000,
    changeRate: -2.1,
    reason:
      "목표가 20만원에 근접해서 일단 절반 매도했어요. AI 검색 경쟁이 심해지고 있어서 단기 조정 가능성이 있어 보여요. 수익 실현 후 재매수 기회를 노릴 계획이에요.",
    indicators: ["목표가 도달", "PER 28배", "단기 과열"],
    date: "2026-04-23",
    chartData: [185000, 190000, 193000, 195000, 200000, 199000, 198000],
  },
  {
    id: "trade-4",
    expertId: "expert-3",
    stockName: "한화에어로스페이스",
    stockCode: "012450",
    exchange: "코스피",
    type: "매수",
    price: 412000,
    changeRate: 6.8,
    reason:
      "NATO 방산 예산 증가 수혜주예요. 유럽 수출 계약이 연속으로 터지고 있고, 우주항공청 설립으로 내수도 탄탄해요. 장기 보유 관점에서 분할 매수 중입니다.",
    indicators: ["수출 계약 급증", "NATO 수혜", "PER 22배"],
    date: "2026-04-24",
    chartData: [370000, 385000, 380000, 395000, 405000, 410000, 412000],
  },
  {
    id: "trade-5",
    expertId: "expert-2",
    stockName: "POSCO홀딩스",
    stockCode: "005490",
    exchange: "코스피",
    type: "매수",
    price: 312000,
    changeRate: 2.4,
    reason:
      "2차전지 소재 부문이 올해부터 본격적으로 실적에 반영돼요. 전통 철강 가치만으로도 저평가인데 리튬·니켈 사업까지 생각하면 지금은 너무 싸요. 배당도 꾸준해서 장기 보유 적합해요.",
    indicators: ["PBR 0.5배", "배당수익률 3.1%", "2차전지 수혜"],
    date: "2026-04-23",
    chartData: [298000, 302000, 299000, 307000, 310000, 309000, 312000],
  },
];

export const themeKeywords: ThemeKeyword[] = [
  { id: "theme-1", label: "AI반도체", changeRate: 5.2, hot: true },
  { id: "theme-2", label: "방산", changeRate: 4.8, hot: true },
  { id: "theme-3", label: "2차전지", changeRate: 2.1, hot: false },
  { id: "theme-4", label: "바이오", changeRate: 3.7, hot: true },
  { id: "theme-5", label: "로봇", changeRate: 6.1, hot: true },
  { id: "theme-6", label: "원전", changeRate: 1.9, hot: false },
  { id: "theme-7", label: "우주항공", changeRate: 4.3, hot: false },
  { id: "theme-8", label: "조선", changeRate: 2.8, hot: false },
];

export const todayHotTrade = trades[0];

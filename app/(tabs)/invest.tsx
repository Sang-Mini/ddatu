import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

// ── 더미 데이터 ───────────────────────────────────────────────

const SEED = 10_000_000;
const CURRENT_TOTAL = 10_432_000;
const TOTAL_RATE = ((CURRENT_TOTAL - SEED) / SEED) * 100;

type Stock = {
  name: string;
  code: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
};

const holdings: Stock[] = [
  { name: "삼성전자", code: "005930", qty: 100, avgPrice: 78_400, currentPrice: 80_200 },
  { name: "SK하이닉스", code: "000660", qty: 50, avgPrice: 178_500, currentPrice: 185_000 },
  { name: "NAVER", code: "035420", qty: 10, avgPrice: 195_000, currentPrice: 188_000 },
];

function calcRate(avg: number, cur: number) {
  return ((cur - avg) / avg) * 100;
}

function calcPnl(avg: number, cur: number, qty: number) {
  return (cur - avg) * qty;
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────

function AssetHeader() {
  const isPositive = TOTAL_RATE >= 0;
  const pnl = CURRENT_TOTAL - SEED;

  return (
    <View style={styles.assetHeader}>
      {/* 뱃지 */}
      <View style={styles.virtualBadge}>
        <Ionicons name="game-controller-outline" size={13} color="rgba(255,255,255,0.7)" />
        <Text style={[styles.virtualBadgeText, { marginLeft: 5 }]}>가상 포트폴리오</Text>
      </View>

      {/* 평가금액 */}
      <Text style={styles.assetLabel}>현재 평가금액</Text>
      <Text style={styles.assetValue}>
        {CURRENT_TOTAL.toLocaleString()}
        <Text style={styles.assetUnit}>원</Text>
      </Text>

      {/* 수익 요약 행 */}
      <View style={styles.assetSummaryRow}>
        <View style={styles.assetSummaryItem}>
          <Text style={styles.assetSummaryLabel}>시작 시드</Text>
          <Text style={styles.assetSummaryValue}>
            {SEED.toLocaleString()}원
          </Text>
        </View>
        <View style={styles.assetDivider} />
        <View style={styles.assetSummaryItem}>
          <Text style={styles.assetSummaryLabel}>평가손익</Text>
          <Text
            style={[
              styles.assetSummaryValue,
              { color: isPositive ? Colors.green : "#FF6B6B" },
            ]}
          >
            {isPositive ? "+" : ""}
            {pnl.toLocaleString()}원
          </Text>
        </View>
        <View style={styles.assetDivider} />
        <View style={styles.assetSummaryItem}>
          <Text style={styles.assetSummaryLabel}>수익률</Text>
          <Text
            style={[
              styles.assetSummaryValue,
              { color: isPositive ? Colors.green : "#FF6B6B" },
            ]}
          >
            {isPositive ? "+" : ""}
            {TOTAL_RATE.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function StockCard({ stock }: { stock: Stock }) {
  const rate = calcRate(stock.avgPrice, stock.currentPrice);
  const pnl = calcPnl(stock.avgPrice, stock.currentPrice, stock.qty);
  const isPositive = rate >= 0;
  const accentColor = isPositive ? Colors.green : "#FF6B6B";
  const evalAmount = stock.currentPrice * stock.qty;

  return (
    <View style={styles.stockCard}>
      {/* 상단: 종목명 + 수익률 */}
      <View style={styles.stockTop}>
        <View style={styles.stockLeft}>
          <Text style={styles.stockName}>{stock.name}</Text>
          <Text style={styles.stockCode}>{stock.qty}주 · {stock.code}</Text>
        </View>
        <View style={styles.stockRight}>
          <Text style={[styles.stockRate, { color: accentColor }]}>
            {isPositive ? "+" : ""}{rate.toFixed(1)}%
          </Text>
          <Text style={[styles.stockPnl, { color: accentColor }]}>
            {isPositive ? "+" : ""}{pnl.toLocaleString()}원
          </Text>
        </View>
      </View>

      {/* 구분선 */}
      <View style={styles.stockDivider} />

      {/* 하단: 가격 정보 */}
      <View style={styles.stockBottom}>
        <View style={styles.stockPriceItem}>
          <Text style={styles.stockPriceLabel}>매수가</Text>
          <Text style={styles.stockPriceValue}>
            {stock.avgPrice.toLocaleString()}원
          </Text>
        </View>
        <View style={styles.stockPriceItem}>
          <Text style={styles.stockPriceLabel}>현재가</Text>
          <Text style={[styles.stockPriceValue, { color: accentColor }]}>
            {stock.currentPrice.toLocaleString()}원
          </Text>
        </View>
        <View style={styles.stockPriceItem}>
          <Text style={styles.stockPriceLabel}>평가금액</Text>
          <Text style={styles.stockPriceValue}>
            {evalAmount.toLocaleString()}원
          </Text>
        </View>
      </View>
    </View>
  );
}

function TipBanner() {
  return (
    <View style={styles.tipBanner}>
      <Ionicons name="chatbubble-ellipses" size={22} color={Colors.gold} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.tipTitle}>쉐도잉 팁</Text>
        <Text style={styles.tipText}>
          NAVER가 -3.6% 손실 중이에요. 고수들의 매매 이유를 확인해보세요!
        </Text>
      </View>
    </View>
  );
}

// ── 메인 화면 ─────────────────────────────────────────────────

export default function InvestScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 내 가상 자산 */}
        <AssetHeader />

        {/* 보유 종목 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>보유 종목</Text>
          <Text style={styles.sectionSub}>{holdings.length}개 종목</Text>
        </View>

        {holdings.map((stock) => (
          <StockCard key={stock.code} stock={stock} />
        ))}

        {/* 쉐도잉 팁 */}
        <TipBanner />

        {/* 투자 현황 요약 */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>투자 현황 요약</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>보유 종목 수</Text>
              <Text style={styles.summaryValue}>{holdings.length}개</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>수익 종목</Text>
              <Text style={[styles.summaryValue, { color: Colors.green }]}>
                {holdings.filter((s) => calcRate(s.avgPrice, s.currentPrice) > 0).length}개
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>손실 종목</Text>
              <Text style={[styles.summaryValue, { color: "#FF6B6B" }]}>
                {holdings.filter((s) => calcRate(s.avgPrice, s.currentPrice) < 0).length}개
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <SafeAreaView edges={["bottom"]} style={styles.ctaArea}>
        <View style={styles.ctaRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.ctaPrimary}
            onPress={() =>
              Alert.alert("📈 매수하기", "모의 매수 기능은 곧 출시돼요!")
            }
          >
            <Text style={styles.ctaPrimaryText}>매수하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.ctaOutline}
            onPress={() =>
              Alert.alert(
                "📊 수익률 분석",
                `총 수익률: +${TOTAL_RATE.toFixed(2)}%\n수익 종목: 2개 / 손실 종목: 1개\n\n분석 기능은 곧 출시돼요!`
              )
            }
          >
            <Text style={styles.ctaOutlineText}>내 수익률 분석</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

// ── 스타일 ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // 자산 헤더
  assetHeader: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  virtualBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  virtualBadgeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
  },
  assetLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginBottom: 6,
  },
  assetValue: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 20,
  },
  assetUnit: {
    fontSize: 20,
    fontWeight: "600",
  },
  assetSummaryRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 16,
  },
  assetSummaryItem: {
    flex: 1,
    alignItems: "center",
  },
  assetSummaryLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginBottom: 4,
  },
  assetSummaryValue: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  assetDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSub: {
    color: Colors.gray500,
    fontSize: 12,
  },

  // 종목 카드
  stockCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stockTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stockLeft: {},
  stockName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  stockCode: {
    color: Colors.gray500,
    fontSize: 12,
  },
  stockRight: {
    alignItems: "flex-end",
  },
  stockRate: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  stockPnl: {
    fontSize: 13,
    fontWeight: "600",
  },
  stockDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginBottom: 12,
  },
  stockBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stockPriceItem: {
    flex: 1,
    alignItems: "center",
  },
  stockPriceLabel: {
    color: Colors.gray500,
    fontSize: 11,
    marginBottom: 4,
  },
  stockPriceValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },

  // 팁 배너
  tipBanner: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
    backgroundColor: Colors.gold + "18",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.gold + "40",
  },
  tipTitle: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },
  tipText: {
    color: Colors.gray700,
    fontSize: 13,
    lineHeight: 20,
  },

  // 요약 카드
  summaryCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    color: Colors.navy,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    color: Colors.gray500,
    fontSize: 11,
    marginBottom: 6,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  // 하단 CTA
  ctaArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 10,
  },
  ctaPrimary: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.green,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPrimaryText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  ctaOutline: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.green,
  },
  ctaOutlineText: {
    color: Colors.green,
    fontWeight: "700",
    fontSize: 15,
  },
});

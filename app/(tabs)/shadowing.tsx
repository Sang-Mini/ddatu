import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trades, experts } from "@/lib/dummyData";
import { Colors } from "@/constants/colors";

// ── 매매 카드 ─────────────────────────────────────────────────

function TradeCard({ trade }: { trade: typeof trades[0] }) {
  const router = useRouter();
  const expert = experts.find((e) => e.id === trade.expertId)!;
  const isBuy = trade.type === "매수";
  const isPositive = trade.changeRate > 0;
  const accentColor = isPositive ? Colors.green : "#FF6B6B";
  const typeColor = isBuy ? Colors.green : "#FF6B6B";

  return (
    <Pressable
      onPress={() => router.push(`/shadowing/${trade.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* 상단: 아바타 + 고수명 + 뱃지 */}
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: expert.avatarColor }]}>
          <Text style={styles.avatarText}>{expert.avatarInitial}</Text>
        </View>
        <View style={styles.expertInfo}>
          <Text style={styles.expertName}>{expert.name}</Text>
          <Text style={styles.expertNick}>@{expert.nickname}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + "18" }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>{trade.type}</Text>
        </View>
      </View>

      {/* 중간: 종목명 + 가격 + 등락률 */}
      <View style={styles.stockRow}>
        <View>
          <Text style={styles.stockName}>{trade.stockName}</Text>
          <Text style={styles.stockMeta}>{trade.exchange} · {trade.stockCode}</Text>
        </View>
        <View style={styles.priceCol}>
          <Text style={[styles.changeRate, { color: accentColor }]}>
            {isPositive ? "+" : ""}{trade.changeRate}%
          </Text>
          <Text style={styles.price}>{trade.price.toLocaleString()}원</Text>
        </View>
      </View>

      {/* 하단: 매매 이유 (좌측 그린 보더) */}
      <View style={styles.reasonWrap}>
        <View style={styles.greenBar} />
        <Text style={styles.reasonText} numberOfLines={2}>
          {trade.reason}
        </Text>
      </View>

      {/* 지표 칩 */}
      <View style={styles.indicatorRow}>
        {trade.indicators.map((ind) => (
          <View key={ind} style={styles.indicatorChip}>
            <Text style={styles.indicatorText}>{ind}</Text>
          </View>
        ))}
        <Text style={styles.dateText}>{trade.date.slice(5)}</Text>
      </View>
    </Pressable>
  );
}

// ── 메인 화면 ─────────────────────────────────────────────────

export default function ShadowingTab() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>쉐도잉 피드</Text>
        <View style={styles.headerBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>실시간</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 오늘의 요약 배너 */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{trades.length}</Text>
            <Text style={styles.summaryLabel}>오늘 매매</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.green }]}>
              {trades.filter((t) => t.type === "매수").length}
            </Text>
            <Text style={styles.summaryLabel}>매수</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: "#FF6B6B" }]}>
              {trades.filter((t) => t.type === "매도").length}
            </Text>
            <Text style={styles.summaryLabel}>매도</Text>
          </View>
        </View>

        {/* 매매 피드 */}
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── 스타일 ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },

  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerTitle: { color: Colors.navy, fontSize: 18, fontWeight: "800" },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.green + "15",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  liveText: { color: Colors.green, fontSize: 12, fontWeight: "600" },

  // 요약 배너
  summaryBanner: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { color: Colors.navy, fontSize: 20, fontWeight: "800", marginBottom: 3 },
  summaryLabel: { color: Colors.gray500, fontSize: 12 },
  summaryDivider: { width: 1, backgroundColor: Colors.gray100 },

  // 스크롤 컨텐츠
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },

  // 매매 카드
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardPressed: { opacity: 0.92 },

  // 카드 상단
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  expertInfo: { flex: 1 },
  expertName: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  expertNick: { color: Colors.gray500, fontSize: 12, marginTop: 1 },
  typeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  typeText: { fontSize: 13, fontWeight: "700" },

  // 종목 행
  stockRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  stockName: { color: Colors.navy, fontSize: 17, fontWeight: "700", marginBottom: 3 },
  stockMeta: { color: Colors.gray500, fontSize: 12 },
  priceCol: { alignItems: "flex-end" },
  changeRate: { fontSize: 18, fontWeight: "800", marginBottom: 2 },
  price: { color: Colors.gray700, fontSize: 13, fontWeight: "500" },

  // 매매 이유
  reasonWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  greenBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.green,
    minHeight: 36,
    marginTop: 2,
  },
  reasonText: {
    flex: 1,
    color: Colors.gray700,
    fontSize: 13,
    lineHeight: 20,
  },

  // 지표 칩
  indicatorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  indicatorChip: {
    backgroundColor: Colors.green + "12",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  indicatorText: { color: Colors.green, fontSize: 11, fontWeight: "600" },
  dateText: { color: Colors.gray300, fontSize: 11, marginLeft: "auto" },
});

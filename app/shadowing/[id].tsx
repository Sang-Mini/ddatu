import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trades, experts } from "@/lib/dummyData";
import Svg, { Polyline, Defs, LinearGradient, Stop, Path } from "react-native-svg";
import { Colors } from "@/constants/colors";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 40;
const CHART_HEIGHT = 80;

// ── 미니 차트 ────────────────────────────────────────────────

function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - ((v - min) / range) * CHART_HEIGHT;
    return `${x},${y}`;
  });

  const linePoints = points.join(" ");
  const areaPoints = `0,${CHART_HEIGHT} ${linePoints} ${CHART_WIDTH},${CHART_HEIGHT}`;
  const color = positive ? Colors.green : "#FF6B6B";
  const gradId = positive ? "greenGrad" : "redGrad";

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 4}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={`M ${areaPoints} Z`} fill={`url(#${gradId})`} />
      <Polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── 메인 화면 ────────────────────────────────────────────────

export default function ShadowingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const trade = trades.find((t) => t.id === id);
  const expert = trade ? experts.find((e) => e.id === trade.expertId) : null;

  if (!trade || !expert) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={{ color: Colors.gray500 }}>매매 정보를 찾을 수 없어요</Text>
      </SafeAreaView>
    );
  }

  const isPositive = trade.changeRate > 0;
  const accentColor = isPositive ? Colors.green : "#FF6B6B";

  const handleFollow = () => {
    Alert.alert("팔로우 완료!", `${expert.name}님을 팔로우했어요 🎉`);
  };

  const handleShadow = () => {
    Alert.alert(
      "따라하기 확인",
      `${trade.stockName}을 ${trade.type}할까요?\n\n체결가: ${trade.price.toLocaleString()}원`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "따라하기",
          onPress: () =>
            Alert.alert("✅ 완료", "쉐도잉 리스트에 추가됐어요!\n매수 시점을 함께 체득해봐요."),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* 내비게이션 바 */}
      <SafeAreaView edges={["top"]} style={styles.navBar}>
        <View style={styles.navInner}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backBtn}
          >
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>쉐도잉 상세</Text>
          <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={{ fontSize: 18 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* 고수 정보 헤더 */}
        <View style={styles.expertHeader}>
          <View style={styles.expertRow}>
            <View style={[styles.expertAvatar, { backgroundColor: expert.avatarColor + "22" }]}>
              <Text style={{ fontSize: 26 }}>{expert.avatarEmoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.expertNameRow}>
                <Text style={styles.expertName}>{expert.name}</Text>
                <Text style={styles.expertNick}>@{expert.nickname}</Text>
              </View>
              <View style={styles.expertMetaRow}>
                <Text style={styles.expertRate}>+{expert.returnRate}%</Text>
                <Text style={styles.expertRateLabel}> 3개월 수익</Text>
                <Text style={styles.dot}> · </Text>
                <Text style={styles.expertFollower}>팔로워 {expert.followers.toLocaleString()}명</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleFollow} activeOpacity={0.8} style={styles.followBtn}>
              <Text style={styles.followText}>팔로우</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 매매 카드 */}
        <View style={styles.section}>
          <View style={styles.card}>
            {/* 종목 헤더 */}
            <View style={styles.tradeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stockName}>{trade.stockName}</Text>
                <Text style={styles.stockMeta}>{trade.exchange} · {trade.stockCode}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <View style={[styles.typeBadge, { backgroundColor: accentColor + "18" }]}>
                  <Text style={[styles.typeText, { color: accentColor }]}>{trade.type}</Text>
                </View>
                <Text style={[styles.changeRate, { color: accentColor }]}>
                  {isPositive ? "+" : ""}{trade.changeRate}%
                </Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{trade.price.toLocaleString()}원</Text>
              <Text style={styles.priceLabel}>체결가</Text>
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 미니 차트 */}
            <View style={styles.chartWrap}>
              <Text style={styles.chartLabel}>최근 7일 흐름</Text>
              <MiniChart data={trade.chartData} positive={isPositive} />
            </View>

            {/* 날짜 */}
            <View style={styles.dateWrap}>
              <Text style={styles.dateText}>{trade.date} · {trade.type}</Text>
            </View>
          </View>
        </View>

        {/* 매매 이유 카드 */}
        <View style={styles.section}>
          <View style={styles.card}>
            {/* 헤더 */}
            <View style={[styles.reasonHeader, { borderBottomColor: Colors.gray100 }]}>
              <View style={styles.greenBar} />
              <Text style={{ fontSize: 16 }}>📝</Text>
              <Text style={styles.reasonTitle}>  매매 이유</Text>
            </View>

            {/* 이유 텍스트 */}
            <View style={styles.reasonBody}>
              <Text style={styles.reasonText}>{trade.reason}</Text>
            </View>

            {/* 관련 지표 */}
            <View style={styles.indicatorWrap}>
              <Text style={styles.indicatorLabel}>관련 지표</Text>
              <View style={styles.indicatorRow}>
                {trade.indicators.map((ind) => (
                  <View key={ind} style={styles.indicatorChip}>
                    <Text style={styles.indicatorText}>{ind}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 같은 고수의 다른 매매 */}
        <View style={styles.otherSection}>
          <Text style={styles.otherTitle}>{expert.nickname}의 다른 매매</Text>
          {trades
            .filter((t) => t.expertId === expert.id && t.id !== trade.id)
            .map((t) => {
              const isBuy = t.type === "매수";
              return (
                <View key={t.id} style={styles.otherCard}>
                  <View>
                    <Text style={styles.otherStock}>{t.stockName}</Text>
                    <Text style={styles.otherDate}>{t.date}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 4 }}>
                    <View style={[styles.typeBadge, { backgroundColor: isBuy ? "#00C07318" : "#FF6B6B18" }]}>
                      <Text style={[styles.typeText, { color: isBuy ? Colors.green : "#FF6B6B" }]}>
                        {t.type}
                      </Text>
                    </View>
                    <Text style={[styles.otherRate, { color: t.changeRate > 0 ? Colors.green : "#FF6B6B" }]}>
                      {t.changeRate > 0 ? "+" : ""}{t.changeRate}%
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>

      {/* 하단 고정 CTA */}
      <SafeAreaView edges={["bottom"]} style={styles.ctaWrap}>
        <TouchableOpacity onPress={handleShadow} activeOpacity={0.85} style={styles.ctaButton}>
          <Text style={styles.ctaText}>✓ 나도 따라하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  notFound: { flex: 1, backgroundColor: Colors.bg, alignItems: "center", justifyContent: "center" },

  // 내비게이션 바
  navBar: { backgroundColor: Colors.white },
  navInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: Colors.bg, marginRight: 8 },
  navTitle: { flex: 1, color: Colors.navy, fontWeight: "700", fontSize: 16 },

  // 고수 헤더
  expertHeader: { backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray100, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  expertRow: { flexDirection: "row", alignItems: "center" },
  expertAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginRight: 16 },
  expertNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  expertName: { color: Colors.navy, fontWeight: "700", fontSize: 18 },
  expertNick: { color: Colors.gray500, fontSize: 14 },
  expertMetaRow: { flexDirection: "row", alignItems: "center" },
  expertRate: { color: Colors.green, fontWeight: "700", fontSize: 14 },
  expertRateLabel: { color: Colors.gray500, fontSize: 12 },
  dot: { color: Colors.gray300 },
  expertFollower: { color: Colors.gray500, fontSize: 12 },
  followBtn: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: Colors.green },
  followText: { color: Colors.green, fontSize: 14, fontWeight: "600" },

  // 공통 섹션/카드
  section: { marginHorizontal: 20, marginTop: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  divider: { height: 1, backgroundColor: Colors.gray100 },

  // 매매 카드 내부
  tradeHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  stockName: { color: Colors.navy, fontSize: 20, fontWeight: "700" },
  stockMeta: { color: Colors.gray500, fontSize: 12, marginTop: 2 },
  typeBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  typeText: { fontSize: 13, fontWeight: "700" },
  changeRate: { fontSize: 20, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8, paddingHorizontal: 20, paddingBottom: 16 },
  price: { color: Colors.navy, fontSize: 24, fontWeight: "700" },
  priceLabel: { color: Colors.gray500, fontSize: 14 },
  chartWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  chartLabel: { color: Colors.gray500, fontSize: 12, marginBottom: 12 },
  dateWrap: { paddingHorizontal: 20, paddingBottom: 16 },
  dateText: { color: Colors.gray500, fontSize: 12 },

  // 매매 이유 카드
  reasonHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1 },
  greenBar: { width: 4, height: 20, borderRadius: 2, backgroundColor: Colors.green, marginRight: 12 },
  reasonTitle: { color: Colors.navy, fontWeight: "700", fontSize: 14 },
  reasonBody: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  reasonText: { color: Colors.gray700, fontSize: 15, lineHeight: 26 },
  indicatorWrap: { paddingHorizontal: 20, paddingBottom: 20 },
  indicatorLabel: { color: Colors.gray500, fontSize: 12, marginBottom: 12 },
  indicatorRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  indicatorChip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#F0FDF8", borderWidth: 1, borderColor: "#D1FAE5" },
  indicatorText: { color: "#065F46", fontSize: 12, fontWeight: "600" },

  // 다른 매매
  otherSection: { marginTop: 24, marginHorizontal: 20 },
  otherTitle: { color: Colors.navy, fontWeight: "700", fontSize: 14, marginBottom: 12 },
  otherCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  otherStock: { color: Colors.navy, fontWeight: "600", fontSize: 14 },
  otherDate: { color: Colors.gray500, fontSize: 12, marginTop: 2 },
  otherRate: { fontWeight: "700", fontSize: 14 },

  // 하단 CTA
  ctaWrap: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray100, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  ctaButton: { height: 56, backgroundColor: Colors.green, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ctaText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
});

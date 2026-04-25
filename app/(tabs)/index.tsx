import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { experts, trades, themeKeywords, todayHotTrade } from "@/lib/dummyData";
import { Colors } from "@/constants/colors";

// ── 헤더 ────────────────────────────────────────────────────

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>따투</Text>
      <TouchableOpacity
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={styles.bellBtn}
      >
        <Ionicons name="notifications-outline" size={22} color={Colors.navy} />
      </TouchableOpacity>
    </View>
  );
}

// ── 오늘의 쉐도잉 배너 ──────────────────────────────────────

function TodayBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.banner}>
      <View style={styles.bannerRow}>
        <Text style={{ fontSize: 18 }}>🔥</Text>
        <Text style={styles.bannerLabel}>오늘 고수들이 주목한 종목</Text>
      </View>

      <View style={styles.bannerStockRow}>
        <View>
          <Text style={styles.bannerStockName}>{todayHotTrade.stockName}</Text>
          <Text style={styles.bannerExchange}>{todayHotTrade.exchange}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.bannerRate}>+{todayHotTrade.changeRate}%</Text>
          <Text style={styles.bannerPrice}>{todayHotTrade.price.toLocaleString()}원</Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        {todayHotTrade.indicators.map((ind) => (
          <View key={ind} style={styles.greenChip}>
            <Text style={styles.greenChipText}>{ind}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.bannerCta}>
        <Text style={styles.bannerCtaText}>따라하기 →</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

// ── 섹션 타이틀 ─────────────────────────────────────────────

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub && <Text style={styles.sectionSub}>{sub}</Text>}
    </View>
  );
}

// ── 고수 카드 ───────────────────────────────────────────────

function ExpertCard({ expert, onPress }: { expert: typeof experts[0]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.expertCard}>
      <View style={styles.expertRow}>
        <View style={[styles.avatar, { backgroundColor: expert.avatarColor + "22" }]}>
          <Text style={{ fontSize: 22 }}>{expert.avatarEmoji}</Text>
        </View>
        <View style={styles.expertInfo}>
          <View style={styles.expertNameRow}>
            <Text style={styles.expertName}>{expert.name}</Text>
            <Text style={styles.expertNick}>@{expert.nickname}</Text>
          </View>
          <Text style={styles.expertSpec}>{expert.specialty}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.expertRate}>+{expert.returnRate}%</Text>
          <Text style={styles.expertPeriod}>3개월</Text>
        </View>
      </View>

      {expert.todayTrade && (
        <View style={styles.todayBadge}>
          <View style={styles.todayDot} />
          <Text style={styles.todayBadgeText}>오늘 매수했어요</Text>
        </View>
      )}
    </Pressable>
  );
}

// ── 테마 칩 ─────────────────────────────────────────────────

function ThemeChip({ label, changeRate, hot }: typeof themeKeywords[0]) {
  return (
    <View style={[styles.themeChip, hot ? styles.themeChipHot : styles.themeChipNormal]}>
      {hot && <Text style={{ fontSize: 11 }}>🔥</Text>}
      <Text style={[styles.themeLabel, { color: hot ? Colors.white : Colors.text }]}>
        {label}
      </Text>
      <Text style={[styles.themeRate, { color: hot ? Colors.green : Colors.gray500 }]}>
        +{changeRate}%
      </Text>
    </View>
  );
}

// ── 메인 화면 ────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

  const goToShadowing = (tradeId: string) => {
    router.push(`/shadowing/${tradeId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* 오늘의 쉐도잉 배너 */}
        <TodayBanner onPress={() => goToShadowing(todayHotTrade.id)} />

        {/* 팔로우한 고수 */}
        <SectionTitle title="팔로우한 고수" sub="3명 팔로우 중" />
        {experts.map((expert) => {
          const firstTrade = trades.find((t) => t.expertId === expert.id);
          return (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onPress={() => firstTrade && goToShadowing(firstTrade.id)}
            />
          );
        })}

        {/* 오늘의 테마 키워드 */}
        <View style={{ marginTop: 24, marginBottom: 8 }}>
          <SectionTitle title="오늘의 테마" sub="실시간" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {themeKeywords.map((theme) => (
              <ThemeChip key={theme.id} {...theme} />
            ))}
          </ScrollView>
        </View>

        {/* 최신 쉐도잉 */}
        <View style={{ marginTop: 24 }}>
          <SectionTitle title="최신 쉐도잉" sub="전체 보기" />
          {trades.slice(0, 3).map((trade) => {
            const expert = experts.find((e) => e.id === trade.expertId)!;
            const isBuy = trade.type === "매수";
            return (
              <Pressable
                key={trade.id}
                onPress={() => goToShadowing(trade.id)}
                style={styles.recentCard}
              >
                <View style={styles.recentTop}>
                  <View style={styles.recentLeft}>
                    <Text style={{ fontSize: 16 }}>{expert.avatarEmoji}</Text>
                    <Text style={styles.recentNick}>@{expert.nickname}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: isBuy ? "#00C07318" : "#FF6B6B18" }]}>
                      <Text style={[styles.typeText, { color: isBuy ? Colors.green : "#FF6B6B" }]}>
                        {trade.type}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.recentDate}>{trade.date.slice(5)}</Text>
                </View>
                <View style={styles.recentBottom}>
                  <Text style={styles.recentStock}>{trade.stockName}</Text>
                  <Text style={[styles.recentRate, { color: trade.changeRate > 0 ? Colors.green : "#FF6B6B" }]}>
                    {trade.changeRate > 0 ? "+" : ""}{trade.changeRate}%
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },

  // 헤더
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16 },
  logo: { color: Colors.green, fontSize: 24, fontWeight: "800" },
  bellBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: Colors.white, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },

  // 배너
  banner: { marginHorizontal: 20, marginBottom: 24, borderRadius: 20, backgroundColor: Colors.navy, padding: 20, overflow: "hidden" },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  bannerLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  bannerStockRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 },
  bannerStockName: { color: Colors.white, fontSize: 22, fontWeight: "700" },
  bannerExchange: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 },
  bannerRate: { color: Colors.green, fontSize: 22, fontWeight: "700" },
  bannerPrice: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  greenChip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "rgba(0,192,115,0.18)" },
  greenChipText: { color: Colors.green, fontSize: 11, fontWeight: "500" },
  bannerCta: { backgroundColor: Colors.green, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingVertical: 12 },
  bannerCtaText: { color: Colors.white, fontWeight: "700", fontSize: 14 },

  // 섹션 타이틀
  sectionTitleRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { color: Colors.navy, fontSize: 16, fontWeight: "700" },
  sectionSub: { color: Colors.gray500, fontSize: 12 },

  // 고수 카드
  expertCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 12, marginHorizontal: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  expertRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginRight: 12 },
  expertInfo: { flex: 1 },
  expertNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  expertName: { color: Colors.navy, fontWeight: "700", fontSize: 14 },
  expertNick: { color: Colors.gray500, fontSize: 12 },
  expertSpec: { color: Colors.gray500, fontSize: 12 },
  expertRate: { color: Colors.green, fontWeight: "700", fontSize: 15 },
  expertPeriod: { color: Colors.gray500, fontSize: 11 },
  todayBadge: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 12, backgroundColor: Colors.green + "12" },
  todayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green, marginRight: 8 },
  todayBadgeText: { color: Colors.green, fontSize: 12, fontWeight: "600" },

  // 테마 칩
  themeChip: { flexDirection: "row", alignItems: "center", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, gap: 6 },
  themeChipHot: { backgroundColor: Colors.navy },
  themeChipNormal: { backgroundColor: Colors.white, borderWidth: 1, borderColor: "#E5E7EB" },
  themeLabel: { fontSize: 13, fontWeight: "600" },
  themeRate: { fontSize: 12, fontWeight: "500" },

  // 최신 쉐도잉 카드
  recentCard: { backgroundColor: Colors.white, marginHorizontal: 20, marginBottom: 12, borderRadius: 20, padding: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  recentTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  recentLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  recentNick: { color: Colors.gray500, fontSize: 12 },
  typeBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 },
  typeText: { fontSize: 11, fontWeight: "700" },
  recentDate: { color: Colors.gray500, fontSize: 11 },
  recentBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  recentStock: { color: Colors.navy, fontWeight: "700", fontSize: 15 },
  recentRate: { fontWeight: "700", fontSize: 15 },
});

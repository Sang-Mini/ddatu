import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { experts, trades, themeKeywords, todayHotTrade } from "@/lib/dummyData";

// ── 컴포넌트 ────────────────────────────────────────────────

function Header() {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <Text style={{ color: "#00C073", fontSize: 24, fontWeight: "800" }}>따투</Text>
      <TouchableOpacity
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        className="w-10 h-10 items-center justify-center rounded-full bg-white"
        style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
      >
        <Text style={{ fontSize: 20 }}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
}

function TodayBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mb-6 rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#0A1628" }}
    >
      <View className="p-5">
        <View className="flex-row items-center gap-x-2 mb-3">
          <Text style={{ fontSize: 18 }}>🔥</Text>
          <Text className="text-white/70 text-xs font-semibold tracking-wide uppercase">
            오늘 고수들이 주목한 종목
          </Text>
        </View>

        <View className="flex-row items-end justify-between mb-4">
          <View>
            <Text className="text-white text-2xl font-bold">
              {todayHotTrade.stockName}
            </Text>
            <Text className="text-white/50 text-sm mt-0.5">
              {todayHotTrade.exchange}
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ color: "#00C073" }} className="text-2xl font-bold">
              +{todayHotTrade.changeRate}%
            </Text>
            <Text className="text-white/50 text-xs mt-0.5">
              {todayHotTrade.price.toLocaleString()}원
            </Text>
          </View>
        </View>

        {/* 관련 지표 칩 */}
        <View className="flex-row flex-wrap gap-2 mb-5">
          {todayHotTrade.indicators.map((ind) => (
            <View
              key={ind}
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: "rgba(0,192,115,0.18)" }}
            >
              <Text style={{ color: "#00C073" }} className="text-xs font-medium">
                {ind}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          className="rounded-xl items-center justify-center py-3"
          style={{ backgroundColor: "#00C073" }}
        >
          <Text className="text-white font-bold text-sm">따라하기 →</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <View className="flex-row items-baseline justify-between px-5 mb-3">
      <Text className="text-ddatu-navy text-base font-bold">{title}</Text>
      {sub && <Text className="text-gray-400 text-xs">{sub}</Text>}
    </View>
  );
}

function ExpertCard({ expert, onPress }: { expert: typeof experts[0]; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 mx-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        {/* 아바타 */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: expert.avatarColor + "22" }}
        >
          <Text style={{ fontSize: 22 }}>{expert.avatarEmoji}</Text>
        </View>

        {/* 정보 */}
        <View className="flex-1">
          <View className="flex-row items-center gap-x-2 mb-0.5">
            <Text className="text-ddatu-navy font-bold text-sm">{expert.name}</Text>
            <Text className="text-gray-400 text-xs">@{expert.nickname}</Text>
          </View>
          <Text className="text-gray-400 text-xs">{expert.specialty}</Text>
        </View>

        {/* 수익률 + 뱃지 */}
        <View className="items-end gap-y-1">
          <Text style={{ color: "#00C073" }} className="font-bold text-base">
            +{expert.returnRate}%
          </Text>
          <Text className="text-gray-400 text-xs">3개월</Text>
        </View>
      </View>

      {/* 오늘 매매 뱃지 */}
      {expert.todayTrade && (
        <View
          className="mt-3 flex-row items-center rounded-xl px-3 py-2"
          style={{ backgroundColor: "#00C073" + "12" }}
        >
          <View
            className="w-1.5 h-1.5 rounded-full mr-2"
            style={{ backgroundColor: "#00C073" }}
          />
          <Text style={{ color: "#00C073" }} className="text-xs font-semibold">
            오늘 매수했어요
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function ThemeChip({ label, changeRate, hot }: typeof themeKeywords[0]) {
  return (
    <View
      className="rounded-full px-4 py-2 mr-2"
      style={{
        backgroundColor: hot ? "#0A1628" : "#FFFFFF",
        borderWidth: hot ? 0 : 1,
        borderColor: "#E5E7EB",
      }}
    >
      <View className="flex-row items-center gap-x-1.5">
        {hot && <Text style={{ fontSize: 11 }}>🔥</Text>}
        <Text
          style={{ color: hot ? "#FFFFFF" : "#374151" }}
          className="text-sm font-semibold"
        >
          {label}
        </Text>
        <Text
          style={{ color: hot ? "#00C073" : "#6B7280" }}
          className="text-xs font-medium"
        >
          +{changeRate}%
        </Text>
      </View>
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
    <SafeAreaView className="flex-1 bg-ddatu-bg" edges={["top"]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* 오늘의 쉐도잉 배너 */}
        <TodayBanner onPress={() => goToShadowing(todayHotTrade.id)} />

        {/* 팔로우한 고수 */}
        <SectionTitle title="팔로우한 고수" sub="3명 팔로우 중" />
        {experts.map((expert) => {
          const todayTrades = trades.filter((t) => t.expertId === expert.id);
          const firstTrade = todayTrades[0];
          return (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onPress={() => firstTrade && goToShadowing(firstTrade.id)}
            />
          );
        })}

        {/* 오늘의 테마 키워드 */}
        <View className="mb-2 mt-6">
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

        {/* 최근 매매 내역 */}
        <View className="mt-6">
          <SectionTitle title="최신 쉐도잉" sub="전체 보기" />
          {trades.slice(0, 3).map((trade) => {
            const expert = experts.find((e) => e.id === trade.expertId)!;
            return (
              <Pressable
                key={trade.id}
                onPress={() => goToShadowing(trade.id)}
                className="bg-white mx-5 mb-3 rounded-2xl p-4"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-x-2">
                    <Text style={{ fontSize: 16 }}>{expert.avatarEmoji}</Text>
                    <Text className="text-gray-500 text-xs">@{expert.nickname}</Text>
                    <View
                      className="rounded-full px-2.5 py-0.5"
                      style={{
                        backgroundColor: trade.type === "매수" ? "#00C073" + "18" : "#FF6B6B18",
                      }}
                    >
                      <Text
                        style={{ color: trade.type === "매수" ? "#00C073" : "#FF6B6B" }}
                        className="text-xs font-bold"
                      >
                        {trade.type}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-400 text-xs">{trade.date.slice(5)}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-ddatu-navy font-bold text-base">{trade.stockName}</Text>
                  <Text
                    style={{ color: trade.changeRate > 0 ? "#00C073" : "#FF6B6B" }}
                    className="font-bold text-base"
                  >
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

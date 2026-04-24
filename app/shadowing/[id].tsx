import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { trades, experts } from "@/lib/dummyData";
import Svg, { Polyline, Defs, LinearGradient, Stop, Path } from "react-native-svg";

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

  const color = positive ? "#00C073" : "#FF6B6B";
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
      <SafeAreaView className="flex-1 bg-ddatu-bg items-center justify-center">
        <Text className="text-gray-400">매매 정보를 찾을 수 없어요</Text>
      </SafeAreaView>
    );
  }

  const isPositive = trade.changeRate > 0;
  const accentColor = isPositive ? "#00C073" : "#FF6B6B";

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
    <View className="flex-1 bg-ddatu-bg">
      <SafeAreaView edges={["top"]} className="bg-white">
        {/* 내비게이션 바 */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-10 h-10 items-center justify-center rounded-full mr-2"
            style={{ backgroundColor: "#F7F8FA" }}
          >
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-ddatu-navy font-bold text-base">
            쉐도잉 상세
          </Text>
          <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={{ fontSize: 18 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 고수 정보 헤더 */}
        <View
          className="bg-white px-5 py-5 border-b border-gray-50"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-14 h-14 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: expert.avatarColor + "22" }}
            >
              <Text style={{ fontSize: 26 }}>{expert.avatarEmoji}</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-x-2 mb-1">
                <Text className="text-ddatu-navy font-bold text-lg">{expert.name}</Text>
                <Text className="text-gray-400 text-sm">@{expert.nickname}</Text>
              </View>
              <View className="flex-row items-center gap-x-3">
                <View className="flex-row items-center gap-x-1">
                  <Text style={{ color: "#00C073" }} className="font-bold text-sm">
                    +{expert.returnRate}%
                  </Text>
                  <Text className="text-gray-400 text-xs">3개월 수익</Text>
                </View>
                <Text className="text-gray-300">·</Text>
                <Text className="text-gray-400 text-xs">
                  팔로워 {expert.followers.toLocaleString()}명
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleFollow}
              activeOpacity={0.8}
              className="rounded-full px-4 py-2 border"
              style={{ borderColor: "#00C073" }}
            >
              <Text style={{ color: "#00C073" }} className="text-sm font-semibold">
                팔로우
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 매매 카드 */}
        <View className="mx-5 mt-4">
          <View
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* 종목 헤더 */}
            <View
              className="px-5 pt-5 pb-4"
              style={{ borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}
            >
              <View className="flex-row items-start justify-between mb-1">
                <View>
                  <Text className="text-ddatu-navy text-xl font-bold">
                    {trade.stockName}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {trade.exchange} · {trade.stockCode}
                  </Text>
                </View>

                <View className="items-end gap-y-1">
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: accentColor + "18" }}
                  >
                    <Text style={{ color: accentColor }} className="text-sm font-bold">
                      {trade.type}
                    </Text>
                  </View>
                  <Text style={{ color: accentColor }} className="text-xl font-bold">
                    {isPositive ? "+" : ""}{trade.changeRate}%
                  </Text>
                </View>
              </View>

              <View className="flex-row items-baseline gap-x-2 mt-2">
                <Text className="text-ddatu-navy text-2xl font-bold">
                  {trade.price.toLocaleString()}원
                </Text>
                <Text className="text-gray-400 text-sm">체결가</Text>
              </View>
            </View>

            {/* 미니 차트 */}
            <View className="px-5 pt-4 pb-3">
              <Text className="text-gray-400 text-xs mb-3">최근 7일 흐름</Text>
              <MiniChart data={trade.chartData} positive={isPositive} />
            </View>

            {/* 날짜 */}
            <View className="px-5 pb-4">
              <Text className="text-gray-400 text-xs">
                {trade.date} · {trade.type}
              </Text>
            </View>
          </View>
        </View>

        {/* 매매 이유 카드 (핵심) */}
        <View className="mx-5 mt-4">
          <View
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* 그린 보더 + 레이블 */}
            <View
              className="flex-row items-center px-5 pt-5 pb-3"
              style={{ borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}
            >
              <View
                className="w-1 h-5 rounded-full mr-3"
                style={{ backgroundColor: "#00C073" }}
              />
              <Text style={{ fontSize: 16 }}>📝</Text>
              <Text className="text-ddatu-navy font-bold text-sm ml-2">
                매매 이유
              </Text>
            </View>

            {/* 이유 텍스트 */}
            <View className="px-5 pt-4 pb-4">
              <Text className="text-gray-700 text-[15px] leading-7">
                {trade.reason}
              </Text>
            </View>

            {/* 관련 지표 칩 */}
            <View className="px-5 pb-5">
              <Text className="text-gray-400 text-xs mb-3">관련 지표</Text>
              <View className="flex-row flex-wrap gap-2">
                {trade.indicators.map((ind) => (
                  <View
                    key={ind}
                    className="rounded-full px-3 py-1.5"
                    style={{ backgroundColor: "#F0FDF8", borderWidth: 1, borderColor: "#D1FAE5" }}
                  >
                    <Text style={{ color: "#065F46" }} className="text-xs font-semibold">
                      {ind}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 같은 고수의 다른 매매 */}
        <View className="mt-6 mx-5">
          <Text className="text-ddatu-navy font-bold text-sm mb-3">
            {expert.nickname}의 다른 매매
          </Text>
          {trades
            .filter((t) => t.expertId === expert.id && t.id !== trade.id)
            .map((t) => (
              <View
                key={t.id}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center justify-between"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 1,
                }}
              >
                <View>
                  <Text className="text-ddatu-navy font-semibold text-sm">{t.stockName}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">{t.date}</Text>
                </View>
                <View className="items-end gap-y-1">
                  <View
                    className="rounded-full px-2.5 py-0.5"
                    style={{
                      backgroundColor: t.type === "매수" ? "#00C073" + "18" : "#FF6B6B18",
                    }}
                  >
                    <Text
                      style={{ color: t.type === "매수" ? "#00C073" : "#FF6B6B" }}
                      className="text-xs font-bold"
                    >
                      {t.type}
                    </Text>
                  </View>
                  <Text
                    style={{ color: t.changeRate > 0 ? "#00C073" : "#FF6B6B" }}
                    className="font-bold text-sm"
                  >
                    {t.changeRate > 0 ? "+" : ""}{t.changeRate}%
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* 하단 고정 CTA */}
      <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <View className="px-5 pt-3 pb-2">
          <TouchableOpacity
            onPress={handleShadow}
            activeOpacity={0.85}
            className="rounded-2xl items-center justify-center flex-row gap-x-2"
            style={{ height: 56, backgroundColor: "#00C073" }}
          >
            <Text className="text-white font-bold text-base">✓ 나도 따라하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

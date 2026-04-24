import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Slide = {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
};

const slides: Slide[] = [
  {
    emoji: "👑",
    title: "고수를 따라하면,\n나도 고수",
    subtitle: "쉐도잉 투자란?",
    description:
      "실제 수익을 낸 투자 고수의 매매를 실시간으로 따라하며 배우는 방법이에요. 보고, 이해하고, 따라하다 보면 어느새 실력이 쌓여요.",
    accent: "#00C073",
  },
  {
    emoji: "📡",
    title: "오늘 고수가 뭘 샀는지\n바로 알 수 있어요",
    subtitle: "실시간 매매 피드",
    description:
      "고수가 매수·매도할 때 이유까지 함께 알려드려요. 왜 샀는지, 어떤 지표를 봤는지 투명하게 공개해서 진짜 학습이 되도록 도와드려요.",
    accent: "#F5C842",
  },
  {
    emoji: "🚀",
    title: "따라하다 보면,\n실력이 됩니다",
    subtitle: "3단계 쉐도잉",
    description:
      "1층: 오늘의 시장 흐름 파악 → 2층: 고수 포트폴리오 분석 → 3층: 실전 따라하기. 이 3단계를 반복하면 시장을 보는 눈이 생겨요.",
    accent: "#00C073",
  },
];

const StepBadge = ({ label, accent }: { label: string; accent: string }) => (
  <View
    style={{ borderColor: accent }}
    className="border rounded-full px-3 py-1 mb-3 self-start"
  >
    <Text style={{ color: accent }} className="text-xs font-semibold">
      {label}
    </Text>
  </View>
);

export default function Onboarding() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const handleStart = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    router.replace("/(tabs)");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    router.replace("/(tabs)");
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true });
    } else {
      handleStart();
    }
  };

  const slide = slides[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-ddatu-navy">
      {/* 건너뛰기 */}
      <View className="flex-row justify-end px-5 pt-2 pb-4">
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text className="text-white/50 text-sm">건너뛰기</Text>
        </TouchableOpacity>
      </View>

      {/* 슬라이드 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {slides.map((s, i) => (
          <View key={i} style={{ width }} className="px-8 justify-center">
            {/* 이모지 배경 원 */}
            <View
              className="w-32 h-32 rounded-full items-center justify-center mb-10 self-center"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <Text style={{ fontSize: 56 }}>{s.emoji}</Text>
            </View>

            <StepBadge label={s.subtitle} accent={s.accent} />

            <Text className="text-white text-3xl font-bold leading-tight mb-5">
              {s.title}
            </Text>

            <Text className="text-white/60 text-base leading-7">
              {s.description}
            </Text>

            {/* 3층 구조 시각화 (마지막 슬라이드) */}
            {i === 2 && (
              <View className="mt-8 gap-y-3">
                {[
                  { num: "1층", text: "오늘의 시장 흐름", color: "#00C073" },
                  { num: "2층", text: "고수 포트폴리오 분석", color: "#F5C842" },
                  { num: "3층", text: "실전 따라하기", color: "#FF6B6B" },
                ].map((item) => (
                  <View
                    key={item.num}
                    className="flex-row items-center gap-x-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                  >
                    <View
                      className="w-9 h-9 rounded-lg items-center justify-center"
                      style={{ backgroundColor: item.color + "33" }}
                    >
                      <Text style={{ color: item.color }} className="text-xs font-bold">
                        {item.num}
                      </Text>
                    </View>
                    <Text className="text-white/80 text-sm font-medium">{item.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 하단 인디케이터 + 버튼 */}
      <View className="px-5 pb-8 gap-y-6">
        {/* 도트 인디케이터 */}
        <View className="flex-row justify-center gap-x-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className="h-2 rounded-full"
              style={{
                width: i === currentIndex ? 24 : 8,
                backgroundColor: i === currentIndex ? "#00C073" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </View>

        {/* CTA 버튼 */}
        <TouchableOpacity
          onPress={goNext}
          activeOpacity={0.85}
          className="rounded-2xl items-center justify-center"
          style={{ height: 56, backgroundColor: "#00C073" }}
        >
          <Text className="text-white text-base font-bold">
            {currentIndex === slides.length - 1 ? "시작하기" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

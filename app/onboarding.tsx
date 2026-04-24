import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

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
    accent: Colors.green,
  },
  {
    emoji: "📡",
    title: "오늘 고수가 뭘 샀는지\n바로 알 수 있어요",
    subtitle: "실시간 매매 피드",
    description:
      "고수가 매수·매도할 때 이유까지 함께 알려드려요. 왜 샀는지, 어떤 지표를 봤는지 투명하게 공개해서 진짜 학습이 되도록 도와드려요.",
    accent: Colors.gold,
  },
  {
    emoji: "🚀",
    title: "따라하다 보면,\n실력이 됩니다",
    subtitle: "3단계 쉐도잉",
    description:
      "1층: 오늘의 시장 흐름 파악 → 2층: 고수 포트폴리오 분석 → 3층: 실전 따라하기. 이 3단계를 반복하면 시장을 보는 눈이 생겨요.",
    accent: Colors.green,
  },
];

const stepLayers = [
  { num: "1층", text: "오늘의 시장 흐름", color: Colors.green },
  { num: "2층", text: "고수 포트폴리오 분석", color: Colors.gold },
  { num: "3층", text: "실전 따라하기", color: "#FF6B6B" },
];

function StepBadge({ label, accent }: { label: string; accent: string }) {
  return (
    <View style={[styles.badge, { borderColor: accent }]}>
      <Text style={[styles.badgeText, { color: accent }]}>{label}</Text>
    </View>
  );
}

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 건너뛰기 */}
      <View style={styles.skipRow}>
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipText}>건너뛰기</Text>
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
        style={styles.scrollView}
      >
        {slides.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            {/* 이모지 배경 원 */}
            <View style={styles.emojiCircle}>
              <Text style={styles.emojiText}>{s.emoji}</Text>
            </View>

            <StepBadge label={s.subtitle} accent={s.accent} />

            <Text style={styles.slideTitle}>{s.title}</Text>
            <Text style={styles.slideDesc}>{s.description}</Text>

            {/* 3층 구조 시각화 (마지막 슬라이드) */}
            {i === 2 && (
              <View style={styles.layerList}>
                {stepLayers.map((item) => (
                  <View key={item.num} style={styles.layerRow}>
                    <View style={[styles.layerNumBox, { backgroundColor: item.color + "33" }]}>
                      <Text style={[styles.layerNum, { color: item.color }]}>{item.num}</Text>
                    </View>
                    <Text style={styles.layerText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 하단 인디케이터 + 버튼 */}
      <View style={styles.footer}>
        {/* 도트 인디케이터 */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === currentIndex ? 24 : 8,
                  backgroundColor:
                    i === currentIndex ? Colors.green : "rgba(255,255,255,0.25)",
                },
              ]}
            />
          ))}
        </View>

        {/* CTA 버튼 */}
        <TouchableOpacity
          onPress={goNext}
          activeOpacity={0.85}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>
            {currentIndex === slides.length - 1 ? "시작하기" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  skipRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skipText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  emojiCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  emojiText: {
    fontSize: 56,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  slideTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 38,
    marginBottom: 20,
  },
  slideDesc: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    lineHeight: 26,
  },
  layerList: {
    marginTop: 32,
    gap: 12,
  },
  layerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  layerNumBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  layerNum: {
    fontSize: 11,
    fontWeight: "700",
  },
  layerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    height: 56,
    backgroundColor: Colors.green,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});

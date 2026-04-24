import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PortfolioTab() {
  return (
    <SafeAreaView className="flex-1 bg-ddatu-bg items-center justify-center">
      <Text className="text-2xl mb-2">📊</Text>
      <Text className="text-ddatu-navy font-semibold text-base">내 포트폴리오</Text>
      <Text className="text-gray-400 text-sm mt-1">준비 중이에요</Text>
    </SafeAreaView>
  );
}

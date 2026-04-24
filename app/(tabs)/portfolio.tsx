import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

export default function PortfolioTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emoji}>📊</Text>
      <Text style={styles.title}>내 포트폴리오</Text>
      <Text style={styles.sub}>준비 중이에요</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 32, marginBottom: 8 },
  title: { color: Colors.navy, fontWeight: "600", fontSize: 16 },
  sub: { color: Colors.gray500, fontSize: 14, marginTop: 4 },
});

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

const menuItems = [
  { icon: "person-outline" as const, label: "프로필 수정" },
  { icon: "notifications-outline" as const, label: "알림 설정" },
  { icon: "shield-checkmark-outline" as const, label: "투자 성향 테스트" },
  { icon: "bar-chart-outline" as const, label: "나의 수익 리포트" },
  { icon: "help-circle-outline" as const, label: "고객센터" },
];

export default function MyTab() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 프로필 헤더 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={36} color={Colors.green} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>투자 초보자</Text>
          <View style={styles.profileBadgeRow}>
            <View style={styles.profileBadge}>
              <Ionicons name="flame" size={12} color="#FF6B35" />
              <Text style={styles.profileBadgeText}>5일 연속</Text>
            </View>
            <View style={[styles.profileBadge, { marginLeft: 8 }]}>
              <Ionicons name="flash" size={12} color={Colors.gold} />
              <Text style={styles.profileBadgeText}>320 XP</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={18} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            style={[
              styles.menuRow,
              i < menuItems.length - 1 && styles.menuRowBorder,
            ]}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={20} color={Colors.navy} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 앱 버전 */}
      <Text style={styles.version}>따투 v1.0.0 MVP</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // 프로필 카드
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.green + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.text, fontSize: 18, fontWeight: "700", marginBottom: 6 },
  profileBadgeRow: { flexDirection: "row", alignItems: "center" },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  profileBadgeText: { color: Colors.gray700, fontSize: 12, fontWeight: "600" },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },

  // 메뉴
  menuCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuLabel: { flex: 1, color: Colors.text, fontSize: 15, fontWeight: "500" },

  version: {
    textAlign: "center",
    color: Colors.gray300,
    fontSize: 12,
    marginTop: 32,
  },
});

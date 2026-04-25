import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/colors";

type TabIconProps = {
  emoji: string;
  label: string;
  focused: boolean;
};

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        style={[
          styles.label,
          {
            color: focused ? Colors.green : Colors.gray500,
            fontWeight: focused ? "700" : "500",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: Platform.OS === "ios" ? 82 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.gray500,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="홈" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" label="학습" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎮" label="모의투자" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shadowing"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👁️" label="쉐도잉" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="마이" focused={focused} />
          ),
        }}
      />
      {/* portfolio 탭은 숨김 처리 (파일은 유지) */}
      <Tabs.Screen
        name="portfolio"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    gap: 2,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontSize: 9,
  },
});

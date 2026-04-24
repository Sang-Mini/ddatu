import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";

type TabIconProps = {
  emoji: string;
  label: string;
  focused: boolean;
};

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-1" style={{ gap: 2 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? "700" : "500",
          color: focused ? "#00C073" : "#9CA3AF",
        }}
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
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: Platform.OS === "ios" ? 82 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#00C073",
        tabBarInactiveTintColor: "#9CA3AF",
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
        name="shadowing"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👁️" label="쉐도잉" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="포트폴리오" focused={focused} />
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
    </Tabs>
  );
}

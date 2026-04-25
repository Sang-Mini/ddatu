import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
};

function TabIcon({ name, label, focused }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? Colors.green : Colors.gray500}
      />
      <Text
        style={[
          styles.label,
          { color: focused ? Colors.green : Colors.gray500,
            fontWeight: focused ? "700" : "500" },
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
            <TabIcon
              name={focused ? "home" : "home-outline"}
              label="홈"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "book" : "book-outline"}
              label="학습"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "trending-up" : "trending-up-outline"}
              label="모의투자"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shadowing"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "eye" : "eye-outline"}
              label="쉐도잉"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              label="마이"
              focused={focused}
            />
          ),
        }}
      />
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
    paddingTop: 2,
    gap: 3,
  },
  label: {
    fontSize: 9,
  },
});

import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Entry() {
  const [target, setTarget] = useState<"onboarding" | "(tabs)" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("onboarding_done").then((val) => {
      setTarget(val === "true" ? "(tabs)" : "onboarding");
    });
  }, []);

  if (!target) {
    return (
      <View className="flex-1 items-center justify-center bg-ddatu-navy">
        <ActivityIndicator color="#00C073" />
      </View>
    );
  }

  return <Redirect href={target === "(tabs)" ? "/(tabs)" : "/onboarding"} />;
}

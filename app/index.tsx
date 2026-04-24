import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export default function Entry() {
  const [target, setTarget] = useState<"onboarding" | "(tabs)" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("onboarding_done").then((val) => {
      setTarget(val === "true" ? "(tabs)" : "onboarding");
    });
  }, []);

  if (!target) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.green} />
      </View>
    );
  }

  return <Redirect href={target === "(tabs)" ? "/(tabs)" : "/onboarding"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.navy,
  },
});

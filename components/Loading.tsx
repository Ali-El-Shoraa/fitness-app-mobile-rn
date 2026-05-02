import { ActivityIndicator, View } from "react-native";

export function LoadingImageIndicator() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#ff2056" />
    </View>
  );
}

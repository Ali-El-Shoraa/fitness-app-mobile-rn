import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BodyParts from "@/components/BodyParts";
import ImageSlider from "@/components/ImageSlider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: 20,
        gap: 20,
      }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: hp(4.5),
              fontWeight: "bold",
              color: "#404040",
              textTransform: "uppercase",
            }}
          >
            Ready To
          </Text>

          <Text
            style={{
              fontSize: hp(4.5),
              fontWeight: "bold",
              color: "#ff2056",
              textTransform: "uppercase",
              letterSpacing: wp(0.5),
            }}
          >
            Workout
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: wp(2),
          }}
        >
          <Image
            source={require("../../assets/images/user-avatar.svg")}
            style={{
              width: hp(6),
              height: hp(6),
              borderRadius: 9999,
            }}
          />

          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#e5e5e5",
              borderRadius: 9999,
              width: hp(5.5),
              height: hp(5.5),
            }}
          >
            <Ionicons name="notifications" size={hp(3)} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      {/* image slider */}
      <View>
        <ImageSlider />
      </View>

      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <BodyParts />
      </View>
    </SafeAreaView>
  );
}

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function WelcomeScreen() {
  const router = useRouter();

  const welcomeImage =
    "https://w0.peakpx.com/wallpaper/63/725/HD-wallpaper-never-stop-bestrong-bodybuilding-dontgiveup-dontstop-fitness-gym-gymmotivation-muscle-stayhungry-staystrong.jpg";

  return (
    <View className="flex-1 bg-black">
      {/* الصورة الخلفية */}
      <Image
        style={StyleSheet.absoluteFill}
        source={{ uri: welcomeImage }}
        contentFit="cover"
        transition={1000}
      />

      {/* التدرج اللوني لضمان وضوح النص */}
      <LinearGradient
        colors={["transparent", "#18181b"]}
        style={{ width: wp(100), height: hp(110), position: "absolute" }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.95 }} // يغطي النهاية تماماً
      />

      {/* المحتوى السفلي */}
      <View
        className="flex-1 justify-end pb-12 items-center space-y-6"
        style={{ gap: hp(1.5) }}
      >
        <Animated.View entering={FadeIn.delay(100).springify()}>
          <Text
            style={{ fontSize: hp(6) }}
            className="text-white font-bold tracking-widest text-center"
          >
            Best <Text className="text-red-500">Work</Text>
          </Text>
          <Text
            style={{ fontSize: hp(2) }}
            className="text-gray-300 font-medium tracking-widest uppercase text-center"
          >
            Make yourself proud
          </Text>
        </Animated.View>

        {/* زر الدخول */}
        <Animated.View entering={FadeInDown.duration(1000).delay(500)}>
          <TouchableOpacity
            onPress={() => router.push("/home")} // سنقوم بإنشاء صفحة home لاحقاً
            style={{ height: hp(7), width: wp(80) }}
            className="bg-red-500 rounded-full items-center justify-center border-[2px] border-neutral-200"
          >
            <Text
              style={{ fontSize: hp(3) }}
              className="text-white font-bold tracking-widest"
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

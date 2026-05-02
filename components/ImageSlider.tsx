import { Image } from "expo-image";
import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// تعريف الأنواع (Types)
interface ParallaxItemProps {
  item: string;
  animationValue: SharedValue<number>;
}
const sliderImages: string[] = [
  "https://w0.peakpx.com/wallpaper/686/51/HD-wallpaper-fitness-gym-workout-healthy.jpg",
  "https://w0.peakpx.com/wallpaper/762/612/HD-wallpaper-bodybuilding-gym-athlete-bodybuilder-biceps-arms-muscles.jpg",
  "https://w0.peakpx.com/wallpaper/609/308/HD-wallpaper-bodybuilding-gym-dumbbells-in-hands-biceps-exercises-dumbbells-fitness.jpg",
];

// استخدام memo لمنع إعادة الرندرة المتكررة لكل عنصر
const ParallaxItem = memo(({ item, animationValue }: ParallaxItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [-SCREEN_WIDTH * 0.18, 0, SCREEN_WIDTH * 0.18],
    );

    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.5, 1, 0.5], // يمكنك تغيير 0.5 إلى أي قيمة تفضلها
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Image
          source={{ uri: item }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
      </Animated.View>
    </View>
  );
});

function ImageSlider() {
  // السر هنا: جعل عرض الـ item أصغر من عرض الشاشة لإظهار الجوانب
  const PAGE_WIDTH = SCREEN_WIDTH * 0.85;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={PAGE_WIDTH} // عرض العنصر الواحد
        height={hp(25)}
        scrollAnimationDuration={1500}
        // 2. التحكم في الفاصل الزمني بين التنقل التلقائي
        autoPlayInterval={3000}
        // // 3. الأهم: إضافة منحنى حركة احترافي (Easing)
        // // سنحتاج لعمل import لـ Easing من react-native-reanimated
        // withAnimation={{
        //   type: "spring", // استخدام نظام الزنبرك يعطي نعومة طبيعية جداً
        //   config: {
        //     damping: 20, // قوة التخميد (كلما زادت قل الاهتزاز)
        //     stiffness: 500, // القسوة (تتحكم في سرعة الانطلاق)
        //   },
        // }}
        style={{
          width: SCREEN_WIDTH, // عرض الحاوية الكلي
          justifyContent: "center",
        }}
        autoPlay={true}
        data={sliderImages}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 40, // المسافة التي يبتعد بها العنصر الجانبي
          //   parallaxAdjacentItemScale: 0.75, // مقياس العنصر الجانبي
        }}
        renderItem={({ item, animationValue }) => (
          <ParallaxItem item={item} animationValue={animationValue} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: SCREEN_WIDTH,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ebebeb",
  },
  image: {
    width: "140%",
    marginLeft: "-20%",
    height: "100%",
  },
});

export default ImageSlider;

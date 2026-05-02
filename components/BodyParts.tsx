import { CategoryBodyParts } from "@/constants/CategoryBodyParts";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
// استيراد Reanimated
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const BodyPartCard = ({
  item,
  router,
  index,
}: {
  item: any;
  router: any;
  index: number;
}) => {
  return (
    // استخدام Animated.View مع تأثير الدخول
    <Animated.View
      entering={FadeInDown.duration(400)
        .delay(index * 200) // تأثير التتابع (Staggered)
        .springify() // تحويل الحركة لنظام Spring
        .damping(7) // قوة الارتداد (رقم قليل = ارتداد أكثر)
        .mass(1) // وزن العنصر
        .stiffness(100)} // صلابة الحركة
    >
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/exercise", params: item })}
        style={{
          width: wp(44),
          height: wp(52),
          justifyContent: "flex-end",
          marginBottom: wp(4),
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: wp(44),
            height: wp(52),
            borderRadius: 35,
            position: "absolute",
          }}
          recyclingKey={item?.id}
          priority="high"
          contentFit="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={{
            width: wp(44),
            height: hp(15),
            position: "absolute",
            bottom: 0,
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
            justifyContent: "flex-end",
            paddingBottom: hp(2),
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: hp(2.3),
              letterSpacing: 1,
            }}
          >
            {item?.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function BodyParts() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: hp(3),
          fontWeight: "bold",
          color: "#333",
          marginTop: 10,
        }}
      >
        Exercises
      </Text>

      <FlatList
        data={CategoryBodyParts}
        numColumns={2}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) => (
          <BodyPartCard item={item} router={router} index={index} />
        )}
      />
    </View>
  );
}

// import { CategoryBodyParts } from "@/constants/CategoryBodyParts";
// import { Image } from "expo-image";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { FlatList, Text, TouchableOpacity, View } from "react-native";
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from "react-native-responsive-screen";

// export const BodyPartCard = ({
//   item,
//   router,
//   index,
// }: {
//   item: any;
//   router: any;
//   index: number;
// }) => {
//   return (
//     <TouchableOpacity
//       onPress={() => router.push({ pathname: "/exercise", params: item })}
//       style={{
//         width: wp(44),
//         height: wp(52),
//         justifyContent: "flex-end",
//         marginBottom: wp(4),
//       }}
//     >
//       <Image
//         source={{ uri: item.image }}
//         style={{
//           width: wp(44),
//           height: wp(52),
//           borderRadius: 35,
//           position: "absolute",
//         }}
//         recyclingKey={item?.id} // مفتاح فريد يساعد في إعادة التدوير
//         priority="high" // الصور التي تظهر أمام المستخدم لها الأولوية
//         contentFit="cover"
//       />

//       <LinearGradient
//         colors={["transparent", "rgba(0,0,0,0.9)"]}
//         style={{
//           width: wp(44),
//           height: hp(15),
//           position: "absolute",
//           bottom: 0,
//           borderBottomLeftRadius: 35,
//           borderBottomRightRadius: 35,
//           justifyContent: "flex-end", // ليدفع النص للأسفل
//           paddingBottom: hp(2), // مسافة للنص من الحافة
//         }}
//         start={{ x: 0.5, y: 0 }}
//         end={{ x: 0.5, y: 1 }}
//       >
//         <Text
//           style={{
//             color: "#fff",
//             fontWeight: "bold",
//             textAlign: "center",
//             fontSize: hp(2.3),
//             letterSpacing: 1,
//           }}
//         >
//           {item?.name}
//         </Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// };

// export default function BodyParts() {
//   const router = useRouter();

//   return (
//     // flex: 1 هو السر الذي سيجعلك تصل لنهاية القائمة وتمررها
//     <View>
//       <Text style={{ fontSize: hp(3), fontWeight: "bold", color: "#333" }}>
//         Exercises
//       </Text>

//       <FlatList
//         data={CategoryBodyParts}
//         numColumns={2}
//         keyExtractor={(item) => item.name}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
//         columnWrapperStyle={{ justifyContent: "space-between" }}
//         renderItem={({ item, index }) => (
//           <BodyPartCard item={item} router={router} index={index} />
//         )}
//       />
//     </View>
//   );
// }

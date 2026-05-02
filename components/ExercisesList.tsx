import { FlashList } from "@shopify/flash-list"; // تأكد من التثبيت أولاً
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function ExercisesList({
  exercises,
  headerData,
}: {
  exercises: any[];
  headerData: any;
}) {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();

  return (
    <View style={{ flex: 1, minHeight: 2 }}>
      <FlashList
        data={exercises}
        numColumns={2}
        //estimatedItemSize هو الارتفاع التقريبي للكارت الواحد (الصورة + النص + الهوامش)
        // @ts-ignore
        estimatedItemSize={hp(30)}
        keyExtractor={(ex) => ex.id || ex.name}
        ListHeaderComponent={
          <View style={{ marginBottom: 10, gap: 15 }}>
            <Image
              source={
                headerData.image || "https://example.com/default-image.png"
              }
              style={{
                width: wp(100),
                height: wp(100),
                borderBottomLeftRadius: 40,
                borderBottomRightRadius: 40,
              }}
            />
            <Text
              style={{
                fontSize: hp(3),
                fontWeight: "bold",
                textTransform: "capitalize",
                paddingHorizontal: 20,
              }}
            >
              {headerData.name} Exercises
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 50,
          // paddingHorizontal: 15, // إضافة البادنج الجانبي للقائمة هنا
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: exercise }) => (
          <ExerciseCard exercise={exercise} baseUrl={baseUrl} router={router} />
        )}
      />
    </View>
  );
}

const ExerciseCard = memo(
  ({
    exercise,
    baseUrl,
    router,
  }: {
    exercise: any;
    baseUrl: string | undefined;
    router: any;
  }) => {
    return (
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <TouchableOpacity
          style={{ marginBottom: 20, flex: 1, marginHorizontal: 5 }}
          onPress={() =>
            router.push({
              pathname: "/exerciseDetails",
              params: {
                ...exercise,
                instruction_steps: JSON.stringify(exercise.instruction_steps),
                secondary_muscles: JSON.stringify(exercise.secondary_muscles),
              },
            })
          }
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              overflow: "hidden",
              // إضافة ظل خفيف لإعطاء جمالية للكارت
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              // elevation: 2,
            }}
          >
            <Image
              source={{ uri: `${baseUrl}/${exercise.gif_url}` }}
              style={{ width: "100%", height: wp(52) }} // العرض 100% ليملأ نصف الشاشة (column)
              recyclingKey={exercise.id}
              priority="high"
              placeholder={"L6PZf9n$00_q.wV@9F9v00%Mutt7"}
              transition={500}
              contentFit="cover"
            />
          </View>
          <Text
            style={{
              fontSize: hp(1.7),
              fontWeight: "600",
              color: "#404040",
              marginTop: 8,
              paddingHorizontal: 4,
            }}
            numberOfLines={1} // لمنع كسر السطر وتشويه المحاذاة
          >
            {exercise.name.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

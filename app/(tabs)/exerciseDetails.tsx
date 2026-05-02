import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function ExerciseDetails() {
  const item = useLocalSearchParams();
  const router = useRouter();
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  // دالة ذكية لمعالجة البيانات القادمة
  const parseData = (data: any) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (e) {
      return data;
    }
  };

  // فك ضغط البيانات
  const instructionStepsObj = parseData(item.instruction_steps);

  // الآن يمكنك الوصول لـ "en" بأمان
  const instructions = instructionStepsObj?.en || [];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* صورة التمرين (GIF) */}
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Image
          source={{ uri: `${baseUrl}/${item.gif_url}` }}
          contentFit="cover"
          style={{
            width: wp(100),
            height: wp(100),
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        />
      </View>

      {/* زر الإغلاق */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: hp(5),
          right: wp(5),
          // backgroundColor: "#ff2056",
          borderRadius: 999,
          padding: 8,
        }}
      >
        <Ionicons name="close-circle" size={hp(5)} color="#ff2056" />
      </TouchableOpacity>

      {/* التفاصيل */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 20 }}
      >
        <View style={{ paddingHorizontal: wp(5), gap: 15 }}>
          {/* اسم التمرين */}
          <Text
            style={{
              fontSize: hp(3.5),
              fontWeight: "bold",
              color: "#404040",
              textTransform: "capitalize",
            }}
          >
            {item.name}
          </Text>

          {/* معلومات العضلات والأدوات */}
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <Badge
              label="Equipment"
              value={item.equipment as string}
              color="#3b82f6"
            />
            <Badge
              label="Target"
              value={item.target as string}
              color="#10b981"
            />
            <Badge
              label="Muscle"
              value={item.muscle_group as string}
              color="#f59e0b"
            />
          </View>

          <View
            style={{ height: 1, backgroundColor: "#e5e5e5", marginVertical: 5 }}
          />

          {/* التعليمات */}
          <Text
            style={{ fontSize: hp(2.5), fontWeight: "bold", color: "#404040" }}
          >
            Instructions
          </Text>

          {instructions.map((step: string, index: number) => (
            <View key={index} style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  backgroundColor: "#404040",
                  width: hp(3),
                  height: hp(3),
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: hp(1.5),
                  }}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: hp(2),
                  color: "#666",
                  flex: 1,
                  lineHeight: hp(2.8),
                }}
              >
                {step.trim()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// مكون فرعي صغير للبطاقات التعريفية (Badges)
const Badge = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View
    style={{
      backgroundColor: color + "20",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      borderLeftWidth: 4,
      borderLeftColor: color,
    }}
  >
    <Text style={{ fontSize: hp(1.4), color: "#666" }}>{label}</Text>
    <Text
      style={{
        fontSize: hp(1.6),
        fontWeight: "bold",
        color: "#333",
        textTransform: "capitalize",
      }}
    >
      {value}
    </Text>
  </View>
);

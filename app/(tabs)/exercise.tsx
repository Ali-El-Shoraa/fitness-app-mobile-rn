import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

// استيراد البيانات (تأكد من المسار الصحيح للملف)
import ExercisesList from "@/components/ExercisesList";
import { AntDesign } from "@expo/vector-icons";
import allExercises from "../../assets/data/exercises.json";

export default function Exercises() {
  const router = useRouter();
  const item = useLocalSearchParams(); // نأخذ الـ Params (مثل back, chest, إلخ)
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    if (item && item.name) {
      getExercises(item.name as string);
    }
  }, [item.name]);
  console.log("watch re-render");

  const getExercises = (bodyPartName: string) => {
    // عملية الـ Filter: نبحث عن التمارين التي تطابق الجزء المختار
    const filtered = allExercises.filter(
      (ex: any) => ex.category.toLowerCase() === bodyPartName.toLowerCase(),
    );
    setExercises(filtered);
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      // edges={["top"]}
    >
      {/* زر العودة نتركه خارج القائمة ليبقى ثابتاً في الأعلى (Sticky) */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          backgroundColor: "#ff2056",
          position: "absolute",
          top: hp(3.5),
          left: hp(0),
          marginLeft: 20,
          marginTop: 10,
          width: hp(5),
          height: hp(5),
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1, // لضمان ظهوره فوق الصور
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          <AntDesign name="caret-left" size={hp(3)} color="white" />
        </Text>
      </TouchableOpacity>

      {/* مرر بيانات الـ Header إلى المكون */}
      <ExercisesList
        exercises={exercises}
        headerData={{ name: item.name, image: item.image }}
      />
    </View>
  );
}

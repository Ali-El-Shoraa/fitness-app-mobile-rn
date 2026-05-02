import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

const { SplashModule } = NativeModules;

export const useSplash = () => {
  const hideSplash = async () => {
    try {
      // طريقة 1: استخدام AsyncStorage (يعمل عبر SharedPreferences)
      await AsyncStorage.setItem("AppPrefs_app_loaded", "true");

      // طريقة 2: إذا كان لديك native module مسجل
      if (SplashModule?.dismissSplash) {
        SplashModule.dismissSplash();
      }
    } catch (error) {
      console.warn("[v0] Error hiding splash:", error);
    }
  };

  return { hideSplash };
};

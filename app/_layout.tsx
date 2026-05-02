import { useColorScheme } from "@/components/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { NativeModules, StyleSheet, TurboModuleRegistry } from "react-native";
import "../global.css";

// منع الإخفاء التلقائي للشاشة الثابتة
SplashScreen.preventAutoHideAsync();

const AppReady = TurboModuleRegistry.get("AppReady") ?? NativeModules.AppReady;

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // const [isAppReady, setIsAppReady] = useState(false);

  // useEffect(() => {
  //   async function prepareApp() {
  //     try {
  //       // هنا تضع أي شيء يحتاجه تطبيقك للتحميل
  //       // (مثل جلب بيانات من الـ API، التأكد من تسجيل دخول المستخدم، تحميل خطوط، إلخ)

  //       // * هذا السطر فقط لمحاكاة وقت التحميل، يمكنك حذفه واستبداله بالكود الحقيقي الخاص بك *
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // 2. بمجرد انتهاء تحميل بيانات التطبيق، نخبر النظام أن التطبيق جاهز
  //       setIsAppReady(true);
  //     }
  //   }

  //   prepareApp();
  // }, []);

  // 3. هذه الدالة تعمل بمجرد أن يتم رسم شاشة الـ Lottie على الشاشة
  // const onLayoutRootView = async () => {
  //   // بمجرد ظهور الأنيميشن، نخفي الشاشة الثابتة الأصلية الخاصة بالنظام
  //   await SplashScreen.hideAsync();
  // };

  // 4. إذا لم يكن التطبيق جاهزاً، اعرض الأنيميشن
  // if (!isAppReady) {
  //   return (
  //     <View
  //       style={styles.splashContainer}
  //       onLayout={onLayoutRootView} // استدعاء دالة الإخفاء هنا
  //     >
  //       <LottieView
  //         source={require("../assets/animation/splash.json")} // تأكد من مسار ملف Lottie الخاص بك
  //         autoPlay
  //         loop // سيستمر في العمل بشكل دائري حتى يجهز التطبيق
  //         style={{ width: "100%", height: "100%" }}
  //         resizeMode="cover"
  //       />
  //     </View>
  //   );
  // }
  console.log("befor useEffect => ");
  useEffect(() => {
    console.log("in useEffect => ");

    async function prepareAndHide() {
      if (loaded) {
        console.log("=== start app initialization ===");
        // 1. الانتظار لمدة 5 ثوانٍ (5000 مللي ثانية)
        // await new Promise((resolve) => setTimeout(resolve, 15000));

        // 2. إخفاء شاشة الـ Splash
        await SplashScreen.hideAsync();
        console.log("after await SplashScreen => ");

        console.log("=== Splash hidden after 5 seconds delay ===");

        // 3. إذا كنت تستخدم الموديل المخصص الخاص بك (الـ Plugin)
        if (NativeModules.AppReady) {
          NativeModules.AppReady.notifyReady();
        }
      }
    }

    prepareAndHide();
  }, [loaded]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //     console.log("=== calling notifyReady, AppReady:", NativeModules.AppReady);
  //     // NativeModules.AppReady?.notifyReady();
  //   }
  // }, [loaded]);

  // إذا لم يتم تحميل الخطوط، لا نعرض شيئاً (يظل الـ Splash الثابت ظاهراً)
  if (!loaded) {
    return null;
  }

  // // إذا انتهى تحميل الخطوط ولكن الأنميشن لم ينتهِ بعد، نعرض الـ Lottie
  // if (!isAnimationFinished) {
  //   return (
  //     <View style={styles.container}>
  //       <LottieView
  //         autoPlay
  //         loop={false} // مهم جداً: التشغيل لمرة واحدة فقط
  //         source={require("../assets/animation/splash.json")} // تأكد من المسار
  //         onAnimationFinish={() => setIsAnimationFinished(true)} // هنا السحر: الانتقال عند الانتهاء
  //         style={styles.animation}
  //         resizeMode="contain"
  //       />
  //     </View>
  //   );
  // }

  // const { hideSplash } = useSplash();

  // useEffect(() => {
  //   // قم بعمليات التحميل الفعلية هنا
  //   const loadApp = async () => {
  //     try {
  //       // ملاحظة مهمة: لا تضع delay أو timeout هنا
  //       // فقط قم بالعمليات الفعلية

  //       // مثال 1: تحميل البيانات من API
  //       // const response = await fetch("https://your-api.com/init");
  //       // const data = await response.json();

  //       // مثال 2: تحميل الإعدادات من AsyncStorage
  //       // const settings = await AsyncStorage.getItem('settings');

  //       // مثال 3: تحميل صور أو assets
  //       // await Image.prefetch('...');

  //       // مثال 4: عمليات مزامنة
  //       // await SyncService.sync();

  //       // عند انتهاء جميع عمليات التحميل الفعلية
  //       console.log("[v0] App loaded, dismissing splash");
  //       await hideSplash(); // ✅ انتقل فوراً بدون توقيت
  //     } catch (error) {
  //       console.error("[v0] Error loading app:", error);
  //       // اختفي حتى عند حدوث خطأ
  //       await hideSplash();
  //     }
  //   };

  //   loadApp().then(async () => {
  //     await hideSplash(); // انتقل فوراً عند انتهاء التحميل الفعلي
  //   });
  // }, [hideSplash]);

  // أخيراً، الدخول للتطبيق بعد انتهاء الأنميشن
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#000000", // لون خلفية شاشة البداية
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#000000", // نفس لون الخلفية في app.json لضمان الانسيابية
//   },
//   animation: {
//     width: "80%",
//     height: "80%",
//   },
// });

// import { useColorScheme } from "@/components/useColorScheme";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import "react-native-reanimated";
// import "../global.css";

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(tabs)",
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return <RootLayoutNav />;
// }

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <StatusBar style="dark" />
//       <Stack>
//         {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: "modal" }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }

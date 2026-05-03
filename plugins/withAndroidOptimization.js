const { withAppBuildGradle } = require("@expo/config-plugins");

/**
 * Expo Config Plugin لتحسين حجم تطبيق أندرويد
 * 1. تفعيل تقسيم الـ APK حسب المعالج (Architectures)
 * 2. إنتاج نسخة Universal APK تعمل على جميع الأجهزة
 * 3. تفعيل Proguard/R8 لحذف الكود غير المستخدم وتصغير الحجم
 */
const withAndroidOptimization = (config) => {
  return withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    // 1. تفعيل تقسيم الـ APK (سيعطينا ملفات صغيرة لكل معالج)
    if (contents.includes("enableSeparateBuildPerCPUArchitecture = false")) {
      contents = contents.replace(
        "enableSeparateBuildPerCPUArchitecture = false",
        "enableSeparateBuildPerCPUArchitecture = true",
      );
    }

    // 2. تفعيل إنتاج النسخة الشاملة (Universal APK) لضمان عمل التطبيق عند الجميع
    // نبحث عن مكان إضافة الإعداد داخل بلوك الـ splits
    if (contents.includes("universalApk false")) {
      contents = contents.replace("universalApk false", "universalApk true");
    } else if (contents.includes("reset()")) {
      // في بعض نسخ Expo، قد نحتاج لإضافتها يدوياً داخل بلوك الـ splits
      contents = contents.replace(
        "reset()",
        "reset()\n            universalApk true",
      );
    }

    // 3. تفعيل Proguard/R8 (لتنظيف وتصغير حجم الكود البرمجي)
    if (contents.includes("enableProguardInReleaseBuilds = false")) {
      contents = contents.replace(
        "enableProguardInReleaseBuilds = false",
        "enableProguardInReleaseBuilds = true",
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });
};

module.exports = withAndroidOptimization;

// const { withAppBuildGradle } = require("@expo/config-plugins");

// const withAndroidOptimization = (config) => {
//   return withAppBuildGradle(config, (mod) => {
//     let contents = mod.modResults.contents;

//     // 1. تفعيل تقسيم الـ APK لتقليل الحجم (Separate APKs per CPU)
//     if (
//       contents.includes("def enableSeparateBuildPerCPUArchitecture = false")
//     ) {
//       contents = contents.replace(
//         "def enableSeparateBuildPerCPUArchitecture = false",
//         "def enableSeparateBuildPerCPUArchitecture = true",
//       );
//     }

//     // 2. تفعيل Proguard لتنظيف الكود (Shrink Code)
//     if (contents.includes("def enableProguardInReleaseBuilds = false")) {
//       contents = contents.replace(
//         "def enableProguardInReleaseBuilds = false",
//         "def enableProguardInReleaseBuilds = true",
//       );
//     }

//     mod.modResults.contents = contents;
//     return mod;
//   });
// };

// module.exports = withAndroidOptimization;

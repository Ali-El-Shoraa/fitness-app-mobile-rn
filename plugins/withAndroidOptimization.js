const { withAppBuildGradle } = require("@expo/config-plugins");

const withAndroidOptimization = (config) => {
  return withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    // ✅ Separate APKs - أحدث صيغة
    contents = contents
      .replace(
        /enableSeparateBuildPerCPUArchitecture\s*=\s*false/g,
        "enableSeparateBuildPerCPUArchitecture = true",
      )
      // ✅ Proguard
      .replace(
        /enableProguardInReleaseBuilds\s*=\s*false/g,
        "enableProguardInReleaseBuilds = true",
      )
      // ✅ Universal APK
      .replace(/universalApk\s+false/g, "universalApk true");

    // ✅ لو universalApk غير موجودة أصلاً — أضفها
    if (!contents.includes("universalApk")) {
      contents = contents.replace(
        /abi\s*\{/,
        `abi {\n            universalApk true`,
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

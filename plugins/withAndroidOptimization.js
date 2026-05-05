const {
  withAppBuildGradle,
  withGradleProperties,
  withDangerousMod,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withAndroidOptimization = (config) => {
  // 1. نسخ ملف الـ keystore برمجياً من الجذر إلى داخل مجلد android الجديد
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const keystoreSource = path.join(
        config.modRequest.projectRoot,
        "release.keystore",
      );
      const keystoreDest = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "release.keystore",
      );

      if (fs.existsSync(keystoreSource)) {
        fs.copyFileSync(keystoreSource, keystoreDest);
        console.log("✅ Keystore copied to native directory");
      } else {
        console.warn("⚠️ Warning: release.keystore not found in project root!");
      }
      return config;
    },
  ]);

  // 2. إضافة الخصائص لملف gradle.properties
  config = withGradleProperties(config, (mod) => {
    const properties = [
      {
        type: "property",
        key: "MYAPP_UPLOAD_STORE_FILE",
        value: "release.keystore",
      },
      {
        type: "property",
        key: "MYAPP_UPLOAD_KEY_ALIAS",
        value: "my-key-alias",
      },
      {
        type: "property",
        key: "MYAPP_UPLOAD_STORE_PASSWORD",
        value: "F!tness@2026Secure#",
      },
      {
        type: "property",
        key: "MYAPP_UPLOAD_KEY_PASSWORD",
        value: "F!tness@2026Secure#",
      },
    ];

    properties.forEach((prop) => {
      if (!mod.modResults.find((p) => p.key === prop.key)) {
        mod.modResults.push(prop);
      }
    });
    return mod;
  });

  // 3. تعديل build.gradle (نفس الكود السابق)
  return withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;
    if (!contents.includes("MYAPP_UPLOAD_STORE_FILE")) {
      contents = contents.replace(
        /signingConfigs\s*\{[\s\S]*?debug\s*\{[\s\S]*?\}\s*\}/,
        `signingConfigs {
            debug {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
            release {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }`,
      );
      contents = contents.replace(
        /release\s*\{[\s\S]*?signingConfig signingConfigs\.debug/,
        (match) =>
          match.replace("signingConfigs.debug", "signingConfigs.release"),
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

//     // ✅ استخدم signing config صحيح في release
//     if (!contents.includes("MYAPP_UPLOAD_STORE_FILE")) {
//       contents = contents.replace(
//         /signingConfigs\s*\{[\s\S]*?debug\s*\{[\s\S]*?\}\s*\}/,
//         `signingConfigs {
//         debug {
//             storeFile file('debug.keystore')
//             storePassword 'android'
//             keyAlias 'androiddebugkey'
//             keyPassword 'android'
//         }
//         release {
//             storeFile file(MYAPP_UPLOAD_STORE_FILE)
//             storePassword MYAPP_UPLOAD_STORE_PASSWORD
//             keyAlias MYAPP_UPLOAD_KEY_ALIAS
//             keyPassword MYAPP_UPLOAD_KEY_PASSWORD
//         }
//     }`,
//       );

//       // ✅ استخدم release signing في buildTypes
//       contents = contents.replace(
//         /release\s*\{[\s\S]*?signingConfig signingConfigs\.debug/,
//         (match) =>
//           match.replace("signingConfigs.debug", "signingConfigs.release"),
//       );
//     }

//     mod.modResults.contents = contents;
//     return mod;
//   });
// };

// module.exports = withAndroidOptimization;

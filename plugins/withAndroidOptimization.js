// plugins/withAndroidOptimization.js
const {
  withGradleProperties,
  withDangerousMod,
  withAppBuildGradle,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const loadLocalEnv = (projectRoot) => {
  const envPath = path.join(projectRoot, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  const env = {};
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (key) env[key] = value;
  });
  return env;
};

const withAndroidOptimization = (config) => {
  // 1. نسخ release.keystore
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const src = path.join(config.modRequest.projectRoot, "release.keystore");
      const dest = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "release.keystore",
      );
      if (fs.existsSync(src)) {
        if (fs.existsSync(dest)) {
          try {
            fs.unlinkSync(dest);
          } catch (e) {}
        }
        fs.copyFileSync(src, dest);
        console.log("✅ release.keystore copied");
      }
      return config;
    },
  ]);

  // 2. gradle.properties - كل الإعدادات هنا
  config = withGradleProperties(config, (mod) => {
    const localEnv = loadLocalEnv(mod.modRequest.projectRoot);

    const properties = [
      // Signing
      {
        type: "property",
        key: "MYAPP_UPLOAD_STORE_FILE",
        value: "release.keystore",
      },
      {
        type: "property",
        key: "MYAPP_UPLOAD_KEY_ALIAS",
        value: localEnv.MYAPP_UPLOAD_KEY_ALIAS || "placeholder",
      },
      {
        type: "property",
        key: "MYAPP_UPLOAD_STORE_PASSWORD",
        value: localEnv.MYAPP_UPLOAD_STORE_PASSWORD || "placeholder",
      },
      {
        type: "property",
        key: "MYAPP_UPLOAD_KEY_PASSWORD",
        value: localEnv.MYAPP_UPLOAD_KEY_PASSWORD || "placeholder",
      },

      // ✅ تحسينات الحجم - تُقرأ مباشرة من build.gradle
      {
        type: "property",
        key: "android.enableMinifyInReleaseBuilds",
        value: "true",
      },
      {
        type: "property",
        key: "android.enableShrinkResourcesInReleaseBuilds",
        value: "true",
      },
      {
        type: "property",
        key: "android.enablePngCrunchInReleaseBuilds",
        value: "true",
      },
      {
        type: "property",
        key: "android.enableBundleCompression",
        value: "true",
      },
      { type: "property", key: "android.enableR8.fullMode", value: "true" },
    ];

    properties.forEach((prop) => {
      const existingIndex = mod.modResults.findIndex((p) => p.key === prop.key);
      if (existingIndex === -1) {
        mod.modResults.push(prop);
      } else {
        // ✅ حدّث القيمة إذا موجودة بـ false
        mod.modResults[existingIndex].value = prop.value;
      }
    });
    return mod;
  });

  // 3. build.gradle - فقط signing config، لا تلمس minify/shrink
  config = withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    if (!contents.includes("MYAPP_UPLOAD_STORE_FILE")) {
      contents = contents.replace(
        /signingConfigs\s*\{([\s\S]*?debug\s*\{[\s\S]*?\})\s*\}/,
        `signingConfigs {$1
            release {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }`,
      );

      contents = contents.replace(
        /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?signingConfig\s+)signingConfigs\.debug/,
        "$1signingConfigs.release",
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });

  return config;
};

module.exports = withAndroidOptimization;

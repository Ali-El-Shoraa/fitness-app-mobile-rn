// plugins/withAndroidOptimization.js
const {
  withAppBuildGradle,
  withGradleProperties,
  withDangerousMod,
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
  // ✅ نسخ release.keystore
  // في withDangerousMod - استبدل جزء نسخ الـ keystore
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
        // ✅ إذا الملف موجود مسبقاً احذفه أولاً قبل النسخ
        if (fs.existsSync(keystoreDest)) {
          try {
            fs.unlinkSync(keystoreDest);
          } catch (e) {
            console.warn("⚠️ Could not delete existing keystore:", e.message);
          }
        }
        fs.copyFileSync(keystoreSource, keystoreDest);
        console.log("✅ release.keystore copied");
      } else {
        console.log("ℹ️ release.keystore not found - OK for CI");
      }
      return config;
    },
  ]);

  // ✅ gradle.properties - القيم من .env.local محلياً
  config = withGradleProperties(config, (mod) => {
    const localEnv = loadLocalEnv(mod.modRequest.projectRoot);

    const properties = [
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
    ];

    properties.forEach((prop) => {
      if (!mod.modResults.find((p) => p.key === prop.key)) {
        mod.modResults.push(prop);
      }
    });
    return mod;
  });

  // ✅ build.gradle - الإصلاح الحقيقي
  config = withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    if (!contents.includes("MYAPP_UPLOAD_STORE_FILE")) {
      // الخطوة 1: أضف release signing config فقط (لا تلمس debug)
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

      // الخطوة 2: ✅ فقط في buildTypes.release - غيّر الـ signingConfig
      // هذا الـ regex يستهدف buildTypes.release فقط وليس debug
      contents = contents.replace(
        /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?signingConfig\s+)signingConfigs\.debug/,
        "$1signingConfigs.release",
      );
    }

    // ✅ تحسينات الحجم في release فقط
    if (!contents.includes("crunchPngs")) {
      contents = contents.replace(
        /(buildTypes\s*\{[\s\S]*?release\s*\{)/,
        `$1
            minifyEnabled true
            shrinkResources true
            crunchPngs true`,
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });

  return config;
};

module.exports = withAndroidOptimization;

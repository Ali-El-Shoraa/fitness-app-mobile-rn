const { withAppBuildGradle } = require("@expo/config-plugins");

const withAndroidOptimization = (config) => {
  return withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    // ✅ استخدم signing config صحيح في release
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

      // ✅ استخدم release signing في buildTypes
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

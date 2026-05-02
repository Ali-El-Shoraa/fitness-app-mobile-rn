const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 1. إخبار Metro بانتظار استقرار الملفات (Watch Options)
config.watcher.additionalExts = ["css", "js", "jsx", "ts", "tsx"];
config.watcher.watchman = false; // تعطيل واجمان على ويندوز لزيادة الاستقرار

// 2. زيادة وقت الانتظار قبل الاستجابة للتعديل
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

// 3. منع Metro من مراقبة المجلدات المؤقتة التي تتغير بسرعة وتسبب الانهيار
config.resolver.blacklistRE =
  /node_modules\/.*\/node_modules\/react-native\/.*/;

module.exports = withNativeWind(config, { input: "./global.css" });

// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });

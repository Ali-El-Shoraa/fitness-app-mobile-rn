// plugins/withLottieSplash.js

const {
  withAndroidManifest,
  withDangerousMod,
  withAppBuildGradle,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// في withLottieSplash.js أضف هذا

const withAppReadyModule = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName =
        mod.android?.package || config.android?.package || "com.yourapp";
      const packagePath = packageName.replace(/\./g, "/");
      const dir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
      );

      fs.mkdirSync(dir, { recursive: true });

      const moduleContent = `package ${packageName}

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppReadyModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "AppReady"

    @ReactMethod
    fun notifyReady() {
        // ✅ applicationContext وليس reactApplicationContext
        reactApplicationContext.applicationContext
            .getSharedPreferences("AppState", Context.MODE_PRIVATE)
            .edit()
            .putBoolean("isReady", true)
            .apply()
        
        android.util.Log.d("AppReadyModule", "notifyReady called - isReady set to true")
    }
}`;

      // ✅ Package: تسجيل الـ Module
      const packageContent = `package ${packageName}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AppReadyPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
        listOf(AppReadyModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
        emptyList()
}`;

      fs.writeFileSync(path.join(dir, "AppReadyModule.kt"), moduleContent);
      fs.writeFileSync(path.join(dir, "AppReadyPackage.kt"), packageContent);

      return mod;
    },
  ]);
};

const withMainApplication = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName =
        mod.android?.package || config.android?.package || "com.yourapp";
      const packagePath = packageName.replace(/\./g, "/");
      const mainAppPath = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
        "MainApplication.kt",
      );

      if (fs.existsSync(mainAppPath)) {
        let content = fs.readFileSync(mainAppPath, "utf8");

        if (!content.includes("AppReadyPackage")) {
          // ✅ أضف import
          content = content.replace(
            /^package .+$/m,
            `$&\nimport ${packageName}.AppReadyPackage`,
          );

          // ✅ أضف داخل .apply { } بالضبط
          content = content.replace(
            /\/\/ Packages that cannot be autolinked yet can be added manually here, for example:\n\s*\/\/ add\(MyReactNativePackage\(\)\)/,
            `// Packages that cannot be autolinked yet can be added manually here, for example:\n          // add(MyReactNativePackage())\n          add(AppReadyPackage())`,
          );
        }

        fs.writeFileSync(mainAppPath, content);
      }

      return mod;
    },
  ]);
};

// ✅ 1. Lottie + LocalBroadcastManager في build.gradle
const withLottieGradle = (config) => {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes("com.airbnb.android:lottie")) {
      mod.modResults.contents = mod.modResults.contents.replace(
        /dependencies\s*\{/,
        `dependencies {\n    implementation "com.airbnb.android:lottie:6.1.0"\n    implementation "androidx.localbroadcastmanager:localbroadcastmanager:1.1.0"`,
      );
    }
    return mod;
  });
};

// ✅ 2. أنشئ SplashActivity.kt
const withSplashActivity = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName =
        mod.android?.package || config.android?.package || "com.yourapp";
      const packagePath = packageName.replace(/\./g, "/");
      const activityDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
      );

      fs.mkdirSync(activityDir, { recursive: true });

      const activityContent = `package ${packageName}

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieDrawable

class SplashActivity : AppCompatActivity() {
    private var isAppReady = false
    private var isAnimationCycleComplete = false
    private var hasNavigated = false
    private val handler = Handler(Looper.getMainLooper())
    private lateinit var lottieView: LottieAnimationView

    private val pollingRunnable = object : Runnable {
        override fun run() {
            // ✅ applicationContext نفس الـ context المستخدم في AppReadyModule
            val prefs = applicationContext
                .getSharedPreferences("AppState", Context.MODE_PRIVATE)
            val isReady = prefs.getBoolean("isReady", false)
            
            android.util.Log.d("SplashActivity", "Polling - isReady: \$isReady, animComplete: \$isAnimationCycleComplete")
            
            if (isReady) {
                isAppReady = true
                prefs.edit().putBoolean("isReady", false).apply()
                checkAndNavigate()
            } else {
                handler.postDelayed(this, 100)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // ✅ امسح flag قديم
        applicationContext
            .getSharedPreferences("AppState", Context.MODE_PRIVATE)
            .edit().putBoolean("isReady", false).apply()

        setContentView(R.layout.activity_splash)

        lottieView = findViewById(R.id.lottieView)
        lottieView.repeatCount = LottieDrawable.INFINITE
        lottieView.playAnimation()

        lottieView.addAnimatorUpdateListener { animation ->
            val progress = animation.animatedFraction
            if (progress > 0.95f && !isAnimationCycleComplete) {
                isAnimationCycleComplete = true
                checkAndNavigate()
            } else if (progress < 0.05f) {
                isAnimationCycleComplete = false
            }
        }

        handler.post(pollingRunnable)
    }

    private fun checkAndNavigate() {
        if (isAppReady && isAnimationCycleComplete && !hasNavigated) {
            hasNavigated = true
            handler.removeCallbacks(pollingRunnable)
            lottieView.cancelAnimation()
            startActivity(Intent(this@SplashActivity, MainActivity::class.java))
            finish()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(pollingRunnable)
    }
}`;

      fs.writeFileSync(
        path.join(activityDir, "SplashActivity.kt"),
        activityContent,
      );
      return mod;
    },
  ]);
};

// ✅ 3. عدّل MainActivity.kt بعد إنشائه من prebuild
const withMainActivity = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName =
        mod.android?.package || config.android?.package || "com.yourapp";
      const packagePath = packageName.replace(/\./g, "/");
      const mainActivityPath = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
        "MainActivity.kt",
      );

      // ✅ انتظر حتى يُنشئ prebuild الملف أولاً
      if (fs.existsSync(mainActivityPath)) {
        let content = fs.readFileSync(mainActivityPath, "utf8");

        // ✅ أضف imports إذا لم تكن موجودة
        if (!content.includes("LocalBroadcastManager")) {
          content = content.replace(
            /^package .+$/m,
            `$&\n\nimport androidx.localbroadcastmanager.content.LocalBroadcastManager\nimport android.content.Intent`,
          );
        }

        // ✅ أضف onContentChanged إذا لم يكن موجوداً
        if (!content.includes("onContentChanged")) {
          content = content.replace(
            /class MainActivity[^{]*\{/,
            `$&\n  override fun onContentChanged() {\n    super.onContentChanged()\n    LocalBroadcastManager.getInstance(this)\n      .sendBroadcast(Intent("APP_READY"))\n  }\n`,
          );
        }

        fs.writeFileSync(mainActivityPath, content);
      }

      return mod;
    },
  ]);
};

// ✅ 4. Layout XML
const withSplashLayout = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const layoutDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/res/layout",
      );

      fs.mkdirSync(layoutDir, { recursive: true });

      const layoutContent = `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000">

    <com.airbnb.lottie.LottieAnimationView
        android:id="@+id/lottieView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:lottie_fileName="splash.json"
        app:lottie_autoPlay="true"
        app:lottie_loop="true"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"/>

</androidx.constraintlayout.widget.ConstraintLayout>`;

      fs.writeFileSync(
        path.join(layoutDir, "activity_splash.xml"),
        layoutContent,
      );
      return mod;
    },
  ]);
};

// ✅ 5. انسخ splash.json لـ assets
const withSplashAsset = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const assetsDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/assets",
      );

      fs.mkdirSync(assetsDir, { recursive: true });

      const source = path.join(
        mod.modRequest.projectRoot,
        "assets/animation/splash.json",
      );
      const dest = path.join(assetsDir, "splash.json");

      if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest);
      }
      return mod;
    },
  ]);
};

// ✅ 6. Placeholder للـ splashscreen_logo
const withSplashDrawable = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const drawableDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/res/drawable",
      );

      fs.mkdirSync(drawableDir, { recursive: true });

      const transparentPng = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      );

      fs.writeFileSync(
        path.join(drawableDir, "splashscreen_logo.png"),
        transparentPng,
      );
      return mod;
    },
  ]);
};

// ✅ 7. AndroidManifest
const withSplashManifest = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const application = manifest.application[0];

    application.activity = application.activity.map((activity) => {
      if (activity.$["android:name"] === ".MainActivity") {
        activity["intent-filter"] = activity["intent-filter"]?.filter(
          (filter) =>
            !filter.category?.some(
              (cat) =>
                cat.$["android:name"] === "android.intent.category.LAUNCHER",
            ),
        );
      }
      return activity;
    });

    const hasSplash = application.activity.some(
      (a) => a.$["android:name"] === ".SplashActivity",
    );

    if (!hasSplash) {
      application.activity.unshift({
        $: {
          "android:name": ".SplashActivity",
          "android:theme": "@style/Theme.AppCompat.NoActionBar",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
            category: [
              {
                $: {
                  "android:name": "android.intent.category.LAUNCHER",
                },
              },
            ],
          },
        ],
      });
    }

    return mod;
  });
};

module.exports = (config) => {
  config = withLottieGradle(config);
  config = withSplashDrawable(config);
  config = withSplashActivity(config);
  config = withSplashLayout(config);
  config = withSplashAsset(config);
  config = withSplashManifest(config);
  config = withAppReadyModule(config); // ✅
  config = withMainApplication(config); // ✅
  config = withMainActivity(config); // ✅ يجب أن يكون آخراً
  return config;
};

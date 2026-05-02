// plugins/withLottieSplash.js

const {
  withAndroidManifest,
  withDangerousMod,
  withAppBuildGradle,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// ✅ أضف في أعلى الملف
const withSplashDrawable = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const drawableDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/res/drawable",
      );

      fs.mkdirSync(drawableDir, { recursive: true });

      // ✅ صورة شفافة 1x1 كـ placeholder لـ expo-splash-screen
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

// ✅ 1. أضف Lottie dependency في build.gradle
const withLottieGradle = (config) => {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes("com.airbnb.android:lottie")) {
      mod.modResults.contents = mod.modResults.contents.replace(
        /dependencies\s*\{/,
        `dependencies {\n    implementation "com.airbnb.android:lottie:6.1.0"`,
      );
    }
    return mod;
  });
};

// ✅ 2. أنشئ SplashActivity.kt تلقائياً
const withSplashActivity = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName = mod.android?.package || "com.yourapp";
      const packagePath = packageName.replace(/\./g, "/");
      const activityDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
      );

      fs.mkdirSync(activityDir, { recursive: true });

      const activityContent = `package ${packageName}

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.airbnb.lottie.LottieAnimationView
import kotlin.concurrent.thread

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val lottieView = findViewById<LottieAnimationView>(R.id.lottieView)
        
        // الرسم المتحرك يعمل في حلقة مستمرة
        // عملية التحميل تعمل في thread منفصلة
        thread {
            try {
                // حاكِ عملية التحميل الفعلية للتطبيق
                // يمكنك استبدال هذا بعملية حقيقية مثل تحميل البيانات
                Thread.sleep(2000) // وقت التحميل الفعلي
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
            
            // عند انتهاء التحميل، انتقل فوراً دون انتظار انتهاء الرسم
            runOnUiThread {
                startActivity(Intent(this@SplashActivity, MainActivity::class.java))
                finish()
            }
        }
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

// ✅ 3. أنشئ Layout XML تلقائياً
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

// ✅ 4. أنشئ assets وانسخ splash.json تلقائياً
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
        "assets/animation/splash.json", // ✅ مسار ملفك
      );
      const dest = path.join(assetsDir, "splash.json");

      if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest);
      }
      return mod;
    },
  ]);
};

// ✅ 5. عدّل AndroidManifest
const withSplashManifest = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const application = manifest.application[0];

    // أزل LAUNCHER من MainActivity
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

    // أضف SplashActivity إذا لم تكن موجودة
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

// ✅ دمج كل الـ plugins
module.exports = (config) => {
  config = withLottieGradle(config);
  config = withSplashDrawable(config);
  config = withSplashActivity(config);
  config = withSplashLayout(config);
  config = withSplashAsset(config);
  config = withSplashManifest(config);
  return config;
};

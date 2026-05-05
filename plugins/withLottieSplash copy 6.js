// plugins/withLottieSplash.js

const {
  withAndroidManifest,
  withDangerousMod,
  withAppBuildGradle,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

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

const withSplashActivity = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName =
        mod.android?.package ||
        config.android?.package ||
        "com.ali.elshoraa.fitnessapp";
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
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieDrawable

class SplashActivity : AppCompatActivity() {
    private var isAppReady = false
    private var isAnimationCycleComplete = false
    private var hasNavigated = false
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        val lottieView = findViewById<LottieAnimationView>(R.id.lottieView)
        lottieView.repeatCount = LottieDrawable.INFINITE
        lottieView.playAnimation()

        // ✅ راقب نهاية كل دورة
        lottieView.addAnimatorUpdateListener { animation ->
            val progress = animation.animatedFraction
            if (progress > 0.95f && !isAnimationCycleComplete) {
                isAnimationCycleComplete = true
                checkAndNavigate(lottieView)
            } else if (progress < 0.05f) {
                isAnimationCycleComplete = false
            }
        }

        // ✅ ابدأ MainActivity في الخلفية مباشرة
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
        startActivity(intent)

        // ✅ استمع لإشارة الجهوزية
        AppState.onReady = {
            mainHandler.post {
                isAppReady = true
                checkAndNavigate(lottieView)
            }
        }
    }

    private fun checkAndNavigate(lottieView: LottieAnimationView) {
        if (isAppReady && isAnimationCycleComplete && !hasNavigated) {
            hasNavigated = true
            lottieView.cancelAnimation()
            // ✅ أحضر MainActivity للمقدمة بدلاً من فتحها من جديد
            val intent = Intent(this, MainActivity::class.java)
            intent.addFlags(
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or
                Intent.FLAG_ACTIVITY_NO_ANIMATION
            )
            startActivity(intent)
            finish()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        AppState.onReady = null
    }
}`;

      const appStateContent = `package ${packageName}

object AppState {
    var onReady: (() -> Unit)? = null
}`;

      fs.writeFileSync(
        path.join(activityDir, "SplashActivity.kt"),
        activityContent,
      );
      fs.writeFileSync(path.join(activityDir, "AppState.kt"), appStateContent);
      return mod;
    },
  ]);
};

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

const withSplashManifest = (config) => {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const application = manifest.application[0];

    // ✅ أزل LAUNCHER من MainActivity وأضف launchMode
    application.activity = application.activity.map((activity) => {
      if (activity.$["android:name"] === ".MainActivity") {
        activity.$["android:launchMode"] = "singleTask";
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
          "android:launchMode": "singleTop",
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

const withMainActivity = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName =
        mod.android?.package ||
        config.android?.package ||
        "com.ali.elshoraa.fitnessapp";
      const packagePath = packageName.replace(/\./g, "/");
      const activityDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
      );
      const mainActivityPath = path.join(activityDir, "MainActivity.kt");

      if (fs.existsSync(mainActivityPath)) {
        let content = fs.readFileSync(mainActivityPath, "utf8");

        if (!content.includes("AppState")) {
          content = content.replace(
            /class MainActivity[^{]*\{/,
            `$&
  private var hasNotified = false

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus && !hasNotified) {
      hasNotified = true
      android.util.Log.d("MainActivity", "=== APP READY ===")
      AppState.onReady?.invoke()
    }
  }
`,
          );
        }

        fs.writeFileSync(mainActivityPath, content);
      }
      return mod;
    },
  ]);
};

module.exports = (config) => {
  config = withLottieGradle(config);
  config = withSplashDrawable(config);
  config = withSplashActivity(config);
  config = withSplashLayout(config);
  config = withSplashAsset(config);
  config = withSplashManifest(config);
  config = withMainActivity(config);
  return config;
};

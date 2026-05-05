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

const withSplashActivity = (config) => {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const packageName = config.android?.package || "com.yourapp";
      const packagePath = packageName.replace(/\./g, "/");
      const activityDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath,
      );
      fs.mkdirSync(activityDir, { recursive: true });

      const activityContent = `package ${packageName}

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // ✅ اكتشف الوضع الحالي
        val isDarkMode = (resources.configuration.uiMode and
            Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES

        // ✅ ألوان الخلفية
        val bgColor = if (isDarkMode) Color.parseColor("#1B5E20") else Color.parseColor("#4A148C")
        val textColor = Color.argb(120, 255, 255, 255)

        // ✅ Root Layout
        val root = FrameLayout(this).apply {
            setBackgroundColor(bgColor)
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        // ✅ اللوجو (دائرة بيضاء شفافة مع حرف)
        val logoSize = dpToPx(80)
        val logo = TextView(this).apply {
            text = "F"
            textSize = 32f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            background = createCircleDrawable()
            alpha = 0f
            layoutParams = FrameLayout.LayoutParams(logoSize, logoSize).apply {
                gravity = Gravity.CENTER
            }
        }

        // ✅ نص "Made by Ali El-Shoraa"
        val madeBy = TextView(this).apply {
            text = "Made by Ali El-Shoraa"
            textSize = 12f
            setTextColor(textColor)
            gravity = Gravity.CENTER
            alpha = 0f
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                bottomMargin = dpToPx(32)
            }
        }

        root.addView(logo)
        root.addView(madeBy)
        setContentView(root)

        // ✅ Fade in للوجو
        val logoFade = ObjectAnimator.ofFloat(logo, View.ALPHA, 0f, 1f).apply {
            duration = 900
            startDelay = 300
        }

        // ✅ Fade in للنص بعد اللوجو
        val textFade = ObjectAnimator.ofFloat(madeBy, View.ALPHA, 0f, 1f).apply {
            duration = 700
            startDelay = 1000
        }

        val set = AnimatorSet()
        set.playTogether(logoFade, textFade)
        set.start()

        // ✅ انتقل للتطبيق بعد انتهاء الأنيميشن
        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }, 2200)
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * resources.displayMetrics.density).toInt()
    }

    private fun createCircleDrawable(): android.graphics.drawable.ShapeDrawable {
        return android.graphics.drawable.ShapeDrawable(
            android.graphics.drawable.shapes.OvalShape()
        ).apply {
            paint.color = Color.argb(40, 255, 255, 255)
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
          "android:screenOrientation": "portrait",
        },
        "intent-filter": [
          {
            action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
            category: [
              { $: { "android:name": "android.intent.category.LAUNCHER" } },
            ],
          },
        ],
      });
    }

    return mod;
  });
};

module.exports = (config) => {
  config = withSplashDrawable(config);
  config = withSplashActivity(config);
  config = withSplashManifest(config);
  return config;
};

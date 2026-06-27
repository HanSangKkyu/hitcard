const { EXPO_PUBLIC_API_URL } = process.env;

const apiUrl = EXPO_PUBLIC_API_URL || "https://hitcard.jiyulsangkyu.pics";

export default {
  expo: {
    name: "hitcard",
    slug: "hitcard",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: { supportsTablet: true },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.han.hitcard",
      versionCode: 7,
    },
    extra: { apiUrl },
    web: {
      favicon: "./assets/favicon.png",
      meta: {
        viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
    },
  },
};

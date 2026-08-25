import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Shadow Play",
  slug: "shadow-play",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  scheme: "shadowplay",
  ios: { supportsTablet: true, bundleIdentifier: "com.shadowplay.mobile" },
  android: { package: "com.shadowplay.mobile" },
  extra: {
    tmdbApiUrl: process.env.EXPO_PUBLIC_TMDB_API_URL ?? "https://api.themoviedb.org/3",
    streamApiUrl: process.env.EXPO_PUBLIC_STREAM_API_URL ?? "",
  },
};

export default config;

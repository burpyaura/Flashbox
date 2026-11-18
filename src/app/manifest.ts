import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shadow Play",
    short_name: "Shadow Play",
    description: "Stream movies, series, anime, and more with ShadowPlay.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#090a0a",
    theme_color: "#090a0a",
    categories: ["entertainment", "video"],
    icons: [
      {
        src: "/icons/shadow-play-icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

import type { MetadataRoute } from "next";

import { masterclass } from "@/lib/masterclass";
import { seoDescription, getSiteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: masterclass.name,
    short_name: masterclass.shortName,
    description: seoDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0a0505",
    theme_color: "#0a0505",
    lang: "en-GH",
    categories: ["education", "design"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    id: getSiteUrl(),
  };
}

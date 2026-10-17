import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", "/about", "/resume", "/contact"].map(path => ({
    url: `https://masonwang.dev${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : .7,
  }));
}

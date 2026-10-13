import { readdir, stat } from "node:fs/promises";
import { extname, join, parse, relative, resolve } from "node:path";
import { cacheLife } from "next/cache";
import sharp from "sharp";
import { photoDetails } from "./portfolio";

export type Photo = {
  id: string;
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export async function getPhotos(): Promise<Photo[]> {
  "use cache";
  cacheLife("max");

  const publicDirectory = join(process.cwd(), "public");
  let filenames: string[] = [];

  try {
    const entries = await readdir(join(publicDirectory, "memories"), {
      withFileTypes: true,
    });
    filenames = entries
      .filter((entry) => entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const photos = await Promise.all(photoDetails.map(async (photo): Promise<Photo | null> => {
    const filename = filenames.find((name) => parse(name).name.toLowerCase() === photo.id.toLowerCase());
    const source = photo.src ?? (filename ? `/memories/${encodeURIComponent(filename)}` : null);
    if (!source || !source.startsWith("/")) return null;

    const segments = source.split("/").filter(Boolean).map(decodeURIComponent);
    const filePath = resolve(publicDirectory, ...segments);
    const relativePath = relative(publicDirectory, filePath);
    if (relativePath.startsWith("..") || !imageExtensions.has(extname(filePath).toLowerCase())) return null;

    try {
      const file = await stat(filePath);
      if (!file.isFile()) return null;
      const metadata = await sharp(filePath).metadata();
      const { width, height } = metadata.autoOrient;
      if (!width || !height) return null;

      return {
        ...photo,
        src: `/${segments.map(encodeURIComponent).join("/")}`,
        width,
        height,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }));

  return photos.filter((photo): photo is Photo => photo !== null);
}

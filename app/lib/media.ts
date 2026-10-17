import { stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { cacheLife } from "next/cache";
import sharp from "sharp";
import type { Photo } from "./photos";
import type { Experience, MediaLink, VideoDetail } from "./portfolio";

export type ImageAsset = { src: string; width: number; height: number };
export type ResolvedVideo = VideoDetail & { mimeType: string };
export type ExperienceMediaAssets = {
  photos: Photo[];
  videos: ResolvedVideo[];
  links: MediaLink[];
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoTypes: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".ogv": "video/ogg",
};

function resolvePublicAsset(src: string): { filePath: string; src: string } | null {
  if (!src.startsWith("/") || src.startsWith("//")) return null;

  try {
    const segments = src.split("/").filter(Boolean).map(decodeURIComponent);
    const publicDirectory = join(process.cwd(), "public");
    const filePath = resolve(publicDirectory, ...segments);
    const relativePath = relative(publicDirectory, filePath);
    if (!relativePath || relativePath.startsWith("..") || isAbsolute(relativePath)) return null;

    return { filePath, src: `/${segments.map(encodeURIComponent).join("/")}` };
  } catch {
    return null;
  }
}

async function getFileAsset(src: string, extensions: string[]) {
  const asset = resolvePublicAsset(src);
  if (!asset || !extensions.includes(extname(asset.filePath).toLowerCase())) return null;

  try {
    const file = await stat(asset.filePath);
    return file.isFile() ? asset : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getImageAsset(src: string): Promise<ImageAsset | null> {
  "use cache";
  cacheLife("max");

  const asset = await getFileAsset(src, [...imageExtensions]);
  if (!asset) return null;

  try {
    const metadata = await sharp(asset.filePath).metadata();
    const { width, height } = metadata.autoOrient;
    return width && height ? { src: asset.src, width, height } : null;
  } catch {
    // Invalid image files are omitted rather than rendered as broken images.
    return null;
  }
}

function validLink(link: MediaLink | undefined): MediaLink | undefined {
  if (!link) return undefined;
  try {
    const url = new URL(link.href);
    return url.protocol === "https:" || url.protocol === "http:" ? link : undefined;
  } catch {
    return undefined;
  }
}

export async function getExperienceMedia(entry: Experience): Promise<ExperienceMediaAssets> {
  "use cache";
  cacheLife("max");

  const photos = await Promise.all((entry.photos ?? []).map(async (photo): Promise<Photo | null> => {
    if (!photo.src) return null;
    const image = await getImageAsset(photo.src);
    return image ? { ...photo, ...image } : null;
  }));

  const videos = await Promise.all((entry.videos ?? []).map(async (video): Promise<ResolvedVideo | null> => {
    const file = await getFileAsset(video.src, Object.keys(videoTypes));
    if (!file) return null;
    const poster = video.poster ? await getImageAsset(video.poster) : null;
    const captions = video.captionsSrc ? await getFileAsset(video.captionsSrc, [".vtt"]) : null;
    return {
      ...video,
      src: file.src,
      mimeType: videoTypes[extname(file.filePath).toLowerCase()],
      poster: poster?.src,
      captionsSrc: captions?.src,
      externalLink: validLink(video.externalLink),
    };
  }));

  return {
    photos: photos.filter((photo): photo is Photo => photo !== null),
    videos: videos.filter((video): video is ResolvedVideo => video !== null),
    links: (entry.mediaLinks ?? []).map(validLink).filter((link): link is MediaLink => link !== undefined),
  };
}

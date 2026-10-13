import { stat } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { resumePath } from "./portfolio";

export async function getResumePath(): Promise<string | null> {
  "use cache";
  cacheLife("max");

  try {
    const resume = await stat(join(process.cwd(), "public", resumePath));
    return resume.isFile() && resumePath.toLowerCase().endsWith(".pdf") ? resumePath : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

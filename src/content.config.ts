import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

// 記事原稿は外部リポジトリ (shsw228/hume.com) を兄弟ディレクトリとして参照する。
// CI でも兄弟関係を保つようにチェックアウトしている。ARTICLES_DIR で上書き可能。
export const BLOG_PATH =
  process.env.ARTICLES_DIR ?? "../hume.com/articles";

// 旧スキーマ (pubDate / updatedDate) と AstroPaper スキーマ (pubDatetime / modDatetime)
// のどちらの記事も受け入れられるようにする。
const preprocessFrontmatter = (raw: unknown) => {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    if (r.pubDate && !r.pubDatetime) r.pubDatetime = r.pubDate;
    if (r.updatedDate && !r.modDatetime) r.modDatetime = r.updatedDate;
  }
  return raw;
};

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: BLOG_PATH }),
  schema: ({ image }) =>
    z.preprocess(
      preprocessFrontmatter,
      z.object({
        author: z.string().default(config.site.author),
        pubDatetime: z.coerce.date(),
        modDatetime: z.coerce.date().optional().nullable(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).default(["others"]),
        ogImage: image().or(z.string()).optional(),
        description: z.string().optional().default(""),
        canonicalURL: z.string().optional(),
        hideEditPost: z.boolean().optional(),
        timezone: z.string().optional(),
      })
    ),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };

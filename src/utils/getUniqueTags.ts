import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
  count: number;
};

/**
 * Builds a de-duplicated, sorted tag list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - `count` is how many posts carry the tag
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]) {
  const byTag = new Map<string, Tag>();
  for (const post of posts.filter(postFilter)) {
    for (const raw of post.data.tags) {
      const tag = slugifyStr(raw);
      const existing = byTag.get(tag);
      if (existing) existing.count++;
      else byTag.set(tag, { tag, tagName: raw, count: 1 });
    }
  }
  return [...byTag.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}

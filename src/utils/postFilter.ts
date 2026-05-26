import type { CollectionEntry } from "astro:content";

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - In production, excludes drafts. 予約投稿機能は使わないため pubDatetime のチェックは行わない。
 *   YAML bare date が UTC 解釈されて CI (UTC) で「未来の投稿」とみなされる事故も避けられる。
 * - In dev, shows everything to make authoring/reviewing easier.
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  if (import.meta.env.DEV) return true;
  return !data.draft;
}

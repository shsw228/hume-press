import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostSlug } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { postFilter } from "@/utils/postFilter";
import config from "@/config";

// llms.txt — a plain-text site map for LLMs/agents (https://llmstxt.org).
// Links point at the raw `.md` twins so agents get clean source, not HTML.
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(config.site.url);
  const abs = (path: string) => new URL(path.replace(/^\//, ""), base).href;

  const posts = getSortedPosts(await getCollection("posts", postFilter));

  const lines: string[] = [
    `# ${config.site.title}`,
    "",
    `> ${config.site.description}`,
    "",
    `Author: ${config.site.author}. Written in Japanese.`,
    "",
    "## Posts",
    "",
    ...posts.map(post => {
      const mdUrl = abs(`posts${getPostSlug(post.id, post.filePath)}.md`);
      const desc = post.data.description ? `: ${post.data.description}` : "";
      return `- [${post.data.title}](${mdUrl})${desc}`;
    }),
    "",
    "## Pages",
    "",
    `- [About](${abs("about")})`,
    `- [Works](${abs("works")})`,
    `- [Tags](${abs("tags")})`,
    `- [Archives](${abs("archives")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { getPostSlug, getPostUrl } from "@/utils/getPostPaths";
import { postFilter } from "@/utils/postFilter";

// Raw-markdown twin of each article, served at `/posts/{slug}.md`.
// Lets LLMs and other agents read the source without HTML boilerplate.
export const getStaticPaths = (async () => {
  const posts = await getCollection("posts", postFilter);
  return posts.map(post => ({
    // Strip the leading slash so the rest param maps to `posts/{slug}.md`.
    params: { slug: getPostSlug(post.id, post.filePath).replace(/^\//, "") },
    props: post,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) => {
  const post = props as Awaited<
    ReturnType<typeof getCollection<"posts">>
  >[number];
  const { title, pubDatetime, modDatetime, tags, description } = post.data;

  const canonical = site
    ? new URL(getPostUrl(post.id, post.filePath), site).href
    : getPostUrl(post.id, post.filePath);

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `pubDatetime: ${new Date(pubDatetime).toISOString()}`,
    ...(modDatetime
      ? [`modDatetime: ${new Date(modDatetime).toISOString()}`]
      : []),
    ...(description ? [`description: ${JSON.stringify(description)}`] : []),
    `tags: [${tags.join(", ")}]`,
    `canonical: ${canonical}`,
    "---",
  ].join("\n");

  const body = `${frontmatter}\n\n${post.body ?? ""}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const base = import.meta.env.BASE_URL;
  return rss({
    title: 'hume.com',
    description: "shsw228's tech blog",
    site: context.site ?? 'https://example.com',
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: `${base}articles/${article.id}/`,
    })),
  });
}

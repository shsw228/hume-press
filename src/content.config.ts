import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articlesDir = process.env.ARTICLES_DIR ?? '../hume.com/articles';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: articlesDir }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };

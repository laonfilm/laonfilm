import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(), // Accept date objects directly (no quotes needed in frontmatter)
    ref: z.union([z.string(), z.array(z.string())]),
    image: z.string(),
    location: z.string().optional(),
    website: z.string().optional(),
  }),
});

export const collections = { posts };

import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().transform((str) => new Date(str)),
    categories: z.array(z.string()),
    image: z.string(),
    location: z.string().optional(),
  }),
});

export const collections = { posts };

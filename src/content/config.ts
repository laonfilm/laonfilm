import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(
      z.enum(['food', 'drink', 'culture', 'views', 'dispatches'])
    ).default([]),
    address: z.string().optional(),
    hours: z.string().optional(),
    website: z.string().url().optional(),
    map_google: z.string().url().optional(),
    map_apple: z.string().url().optional(),
    hero: z.string(),                 // e.g. "/images/foo-polaroid.jpg"
    gallery: z.array(z.string()).default([]),
    excerpt: z.string().optional()
  })
});

export const collections = {
  posts
};

import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),   // accepts "2025-08-25" or an actual Date
    tags: z.array(z.enum(["food","drink","culture","views","dispatches"])).default([]),
    hero: z.string(),
    gallery: z.array(z.string()).default([]),
    excerpt: z.string().optional()
  })
});

export const collections = { posts };

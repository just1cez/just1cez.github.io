import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const tech = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tech" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.literal("tech"),
    description: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const life = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/life" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    category: z.literal("life"),
    description: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { tech, life };

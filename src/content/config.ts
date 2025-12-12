import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        author: z.string().default('Lic. Consultora'),
        image: z.string().optional(),
        tags: z.array(z.string()),
        category: z.string()
    })
});

const servicesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        price: z.string().optional(),
        features: z.array(z.string()).optional()
    })
});

export const collections = {
    'blog': blogCollection,
    'services': servicesCollection,
};

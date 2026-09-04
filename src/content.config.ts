import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // 系列：同名 series 自动聚合、自动排上下篇
    series: z.object({
      name: z.string(),
      order: z.number(),
    }).optional(),
    // 本篇 BGM：歌名 —— 艺术家，点击联动唱片机
    bgm: z.object({
      mid: z.string(),
      name: z.string(),
      artist: z.string(),
    }).optional(),
    draft: z.boolean().default(false),
  }),
});

const trips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trips' }),
  schema: z.object({
    title: z.string(),
    place: z.string(),
    // WGS-84 坐标（GPS 原始值），前端展示时转 GCJ-02 对齐高德瓦片
    coords: z.object({ lng: z.number(), lat: z.number() }),
    date: z.coerce.date(),
    photo: z.string().optional(),
    song: z.object({
      mid: z.string(),
      name: z.string(),
      artist: z.string(),
    }).optional(),
    excerpt: z.string().optional(),
  }),
});

// 观影：票根式极简 frontmatter——字少，一目了然
const movies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/movies' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    rating: z.number().min(0).max(5),
    quote: z.string().max(80),
    // 票根底色（中国传统色），缺省随机
    color: z.string().optional(),
    watchedDate: z.coerce.date().optional(),
  }),
});

// 便签：灵感墙的最小单元
const memos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/memos' }),
  schema: z.object({
    text: z.string(),
    color: z.string().default('#D9A441'),
    date: z.coerce.date(),
  }),
});

export const collections = { posts, trips, movies, memos };

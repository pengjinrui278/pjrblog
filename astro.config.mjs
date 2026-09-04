import { defineConfig } from 'astro/config';
import rss from '@astrojs/rss';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://xixi-blog.vercel.app',
  // Astro 5：static 输出 + 适配器即"旧的 hybrid"——
  // 带 prerender=false 的端点（如 api/qqmusic）会成为 Vercel Serverless Function
  adapter: vercel(),
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
    },
  },
});

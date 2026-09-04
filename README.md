# 曦曦的博客 · 书房 × 工坊 × 旅程

Astro 5 静态站，暖纸日景 / 墨色夜景，内置唱片机（QQ 音乐源）与旅程地图（高德瓦片）。

## 快速开始

```bash
npm install        # 已配项目级 npmmirror 镜像，无需代理
npm run dev        # http://localhost:4321
npm run build      # 构建 + Pagefind 全文索引（自动同步进 .vercel/output）
```

## 写作

- **文章**：`src/content/posts/*.md`，frontmatter 支持 `series: {name, order}`（自动聚合+上下篇）、
  `bgm: {mid, name, artist}`（文章头部出现唱片机芯片）、`tags`、`draft: true`（不发布）。
- **旅程**：`src/content/trips/*.md`，`coords` 用 WGS-84（GPS 原值，前端自动转 GCJ-02 对齐高德瓦片）。
- 代码块第一行写 `// file: xxx.py` 会变成文件名标签；```mermaid 与 `$LaTeX$` 开箱即用。

## 配置（src/consts.ts）

| 项 | 说明 |
|---|---|
| `SITE.url` | 买了域名后改这里 + `astro.config.mjs` 的 `site` |
| `PLAYLIST` | 唱片机歌单，mid 用 `/api/qqmusic/search?q=歌名` 查 |
| `GISCUS` | 填 repo/repoId/categoryId 后评论区自动启用（giscus.app 生成） |

## 部署到 Vercel（免费）

1. 把项目推到 GitHub 私有/公开仓库；
2. [vercel.com/new](https://vercel.com/new) 导入该仓库，零额外配置（Astro 自动识别）；
3. 部署完得到 `xxx.vercel.app` 二级域名，之后可随时绑定自有域名。

**让唱片机真正能放歌**：Vercel → Settings → Environment Variables →
新增 `QQ_MUSIC_COOKIE`（浏览器登录 y.qq.com，F12 → Network → 任一请求 → 复制完整 Cookie 值）。
不配置也不影响使用：播放器会诚实降级为「去 QQ 音乐听 ↗」。

## 结构速览

```
src/
  consts.ts            站点名/导航/歌单/Giscus
  content.config.ts    posts + trips 两个集合的 schema
  content/posts/       文章（Markdown）
  content/trips/       旅行日志（坐标+照片+那首歌）
  pages/api/qqmusic/   QQ 音乐代理（Vercel Serverless）
  components/VinylPlayer.astro  全局唱片机
```

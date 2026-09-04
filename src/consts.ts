// 站点级配置：名字、导航、唱片机歌单
export const SITE = {
  name: '曦曦',
  title: '曦曦的博客',
  description: '做 AI 应用的工程师。白天写 Agent 和相机，晚上写复盘与随笔；假期在路上，耳机里永远有歌。',
  // 后续买了域名改这里 + astro.config.mjs 的 site
  url: 'https://xixi-blog.vercel.app',
};

export const NAV = [
  { href: '/', label: '首页' },
  { href: '/posts/', label: '文章' },
  { href: '/lab/', label: '实验室' },
  { href: '/travel/', label: '旅程' },
  { href: '/archive/', label: '归档' },
  { href: '/about/', label: '关于' },
];

// 唱片机歌单：QQ 音乐源，mid 均为搜索接口核验过的真实值。
// 播放说明：QQ 已关闭匿名播放地址。在 Vercel 配置环境变量 QQ_MUSIC_COOKIE
//（浏览器登录 y.qq.com 后从开发者工具复制 Cookie）即可完整播放；
// 未配置时播放器诚实降级为「去 QQ 音乐听」。
export const PLAYLIST = [
  { mid: '003ryaYw2nWz55', name: '山丘', artist: '李宗盛' },
  { mid: '0039MnYb0qxYhV', name: '晴天', artist: '周杰伦' },
  { mid: '003TLWoN0gQnP5', name: '成都', artist: '赵雷' },
  { mid: '002NQLBN3zC2wV', name: '去大理', artist: '郝云' },
];

// Giscus 评论区：填入你的 GitHub 仓库与 Discussion 分类后自动启用。
// 在 https://giscus.app 生成，替换下面两项即可。
export const GISCUS = {
  repo: '',           // 形如 'xixi/blog-comments'
  repoId: '',         // 形如 'R_kgDO...'
  category: 'General',
  categoryId: '',     // 形如 'DIC_kwDO...'
};

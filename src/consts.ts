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
  { href: '/movies/', label: '观影' },
  { href: '/travel/', label: '旅程' },
  { href: '/board/', label: '灵感墙' },
  { href: '/archive/', label: '归档' },
  { href: '/about/', label: '关于' },
];

// 唱片机歌单。
//
// 播放优先级（三条路，至少通一条就能放）：
// 1. file —— 本地音乐文件（public/music/ 下），最可靠，永不过期。
//    ⚠ ogg 格式在 Safari 不支持（Chrome/Edge/Firefox 正常）。
// 2. mid —— QQ 音乐在线播放，需在 Vercel 配置 QQ_MUSIC_COOKIE。
// 3. 都失败 —— 诚实降级为「去 QQ 音乐听 ↗」。
//
// QQ_PLAYLIST_ID：你的 QQ 音乐歌单（8665716804），配置 Cookie 后整单并入。
export const QQ_PLAYLIST_ID = '8665716804';

export const PLAYLIST = [
  { mid: '', name: 'Forever Right Now', artist: 'Conor Matthews', file: '/music/Conor Matthews - Forever Right Now.ogg' },
  { mid: '', name: '24/7, 365', artist: 'Elijah Woods', file: '/music/Elijah Woods - 24_7, 365.ogg' },
  { mid: '', name: "where we're going", artist: 'Elijah Woods', file: "/music/Elijah Woods - where we're going.ogg" },
  { mid: '', name: 'Travel（极致氛围版）', artist: '卡司', file: '/music/卡司 - Travel (极致氛围版).ogg' },
  // QQ 在线曲目：配置 QQ_MUSIC_COOKIE 后可播放
  { mid: '003ryaYw2nWz55', name: '山丘', artist: '李宗盛', file: '' },
  { mid: '0039MnYb0qxYhV', name: '晴天', artist: '周杰伦', file: '' },
  { mid: '003TLWoN0gQnP5', name: '成都', artist: '赵雷', file: '' },
  { mid: '002NQLBN3zC2wV', name: '去大理', artist: '郝云', file: '' },
];

// Giscus 评论区：填入你的 GitHub 仓库与 Discussion 分类后自动启用。
// 在 https://giscus.app 生成，替换下面两项即可。
export const GISCUS = {
  repo: '',           // 形如 'xixi/blog-comments'
  repoId: '',         // 形如 'R_kgDO...'
  category: 'General',
  categoryId: '',     // 形如 'DIC_kwDO...'
};

// QQ 音乐轻代理：部署到 Vercel 后由本站的 Serverless Function 执行，
// 隐藏请求细节并绕开浏览器跨域。仅转发 QQ 公开接口，不存储任何凭据。
//
// GET /api/qqmusic/search?q=山丘             → { list }  搜索（已验证可用）
// GET /api/qqmusic/url?mid=003ryaYw2nWz55   → { url }   取播放地址
//
// 播放地址说明：QQ 已对未登录请求关闭免费播放（vkey 返回 104003）。
// 在 Vercel → Settings → Environment Variables 配置 QQ_MUSIC_COOKIE
//（浏览器登录 y.qq.com，F12 → Network → 任意请求 → 复制完整的 Cookie 值），
// 配置后本代理会携带该 Cookie 请求 vkey，绝大部分歌曲即可播放。
// 未配置时返回 502 {code:'restricted'}，前端降级为「去 QQ 音乐听」。

export const prerender = false;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function qqHeaders() {
  const cookie = process.env.QQ_MUSIC_COOKIE ?? '';
  return {
    'User-Agent': UA,
    Referer: 'https://y.qq.com',
    Origin: 'https://y.qq.com',
    ...(cookie ? { Cookie: cookie } : {}),
  };
}

async function search(q: string) {
  const u = `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?w=${encodeURIComponent(q)}&format=json&n=10&p=1&t=0`;
  const r = await fetch(u, { headers: qqHeaders() });
  const j = await r.json();
  return (j.data?.song?.list ?? []).map((s: any) => ({
    mid: s.songmid,
    name: s.songname,
    artist: (s.singer ?? []).map((x: any) => x.name).join('/'),
    album: s.albumname ?? '',
  }));
}

async function playlist(id: string) {
  // 歌单详情也要登录态：先走经典 fcg_ucc 接口，失败再试 musicu musichallPlaylist。
  // 两者都会在配置了 QQ_MUSIC_COOKIE 后正常工作。
  try {
    const u = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?id=${encodeURIComponent(id)}&format=json&newsong=1&outCharset=utf-8`;
    const r = await fetch(u, { headers: qqHeaders() });
    const j = await r.json();
    const songs = j.data?.[0]?.songlist ?? [];
    if (songs.length) return songs.map((s: any) => ({
      mid: s.songmid, name: s.songname, artist: (s.singer ?? []).map((x: any) => x.name).join('/'),
    }));
  } catch { /* 继续试下一条通道 */ }

  const body = {
    comm: { ct: 11, cv: '12080008', format: 'json', inCharset: 'utf-8', outCharset: 'utf-8', notice: 0, platform: 'yqq', needNewCode: 0, uin: 0 },
    req_1: {
      module: 'music.musichallPlaylist.PlayListTrackList',
      method: 'GetTrackList',
      param: { playlist_id: String(id), dirid: '0', show_no: 100 },
    },
  };
  const r2 = await fetch('https://u.y.qq.com/cgi-bin/musicu.fcg', {
    method: 'POST',
    headers: { ...qqHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j2 = await r2.json();
  const tracks = j2.req_1?.data?.tracks ?? [];
  if (!tracks.length) throw new Error('歌单详情需要 QQ_MUSIC_COOKIE（匿名已被 QQ 关闭）');
  return tracks.map((s: any) => ({ mid: s.mid, name: s.name, artist: (s.singer ?? []).map((x: any) => x.name).join('/') }));
}

async function songUrl(mid: string) {
  const guid = Math.floor(Math.random() * 1e9).toString();
  const body = {
    req: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        guid,
        songmid: [mid],
        songtype: [0],
        uin: '0',
        loginflag: 1,
        platform: '20',
      },
    },
  };
  const r = await fetch('https://u.y.qq.com/cgi-bin/musicu.fcg', {
    method: 'POST',
    headers: { ...qqHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  const info = j.req?.data?.midurlinfo?.[0];
  if (info?.purl) {
    return { url: `https://isure.stream.qqmusic.qq.com/${info.purl}` };
  }
  const hasCookie = Boolean(process.env.QQ_MUSIC_COOKIE);
  return {
    restricted: true,
    hint: hasCookie
      ? '已配置 Cookie 但仍未取到播放地址，歌曲可能为 VIP 专属'
      : '未配置 QQ_MUSIC_COOKIE，匿名播放已被 QQ 关闭',
  };
}

export async function GET({ url, params }: { url: URL; params: { path?: string } }) {
  const action = params.path ?? '';
  const mid = url.searchParams.get('mid');
  const q = url.searchParams.get('q');
  const id = url.searchParams.get('id');
  try {
    if (action === 'search' && q) return Response.json({ list: await search(q) });
    if (action === 'playlist' && id) return Response.json({ list: await playlist(id) });
    if (action === 'url' && mid) {
      const r = await songUrl(mid);
      if ('url' in r && r.url) return Response.json({ url: r.url });
      return Response.json({ code: 'restricted', ...r }, { status: 502 });
    }
    return Response.json({ error: 'usage: search?q= | playlist?id= | url?mid=' }, { status: 400 });
  } catch (e: any) {
    return Response.json({ error: String(e?.message ?? e) }, { status: 502 });
  }
}

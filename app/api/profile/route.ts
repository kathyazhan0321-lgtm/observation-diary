import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { normalizeNickname } from '@/lib/profile';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'请先登录。'}, {status:401});
  if (req.headers.get('origin') !== new URL(req.url).origin) return Response.json({error:'请求来源不匹配。'}, {status:403});
  let nickname: string;
  try { nickname = normalizeNickname((await req.json() as {nickname:unknown}).nickname); }
  catch { return Response.json({error:'昵称请填写 1–20 个字符，不含换行。'}, {status:400}); }
  try {
    if (!env.DB) throw new Error("Storage unavailable");
    await env.DB.prepare('INSERT INTO profiles (user_id,nickname) VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET nickname=excluded.nickname').bind(user.userId,nickname).run();
    return Response.json({nickname}, {headers:{'Cache-Control':'no-store'}});
  } catch { return Response.json({error:'昵称保存失败，请重试。'}, {status:503}); }
}

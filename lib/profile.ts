export function normalizeNickname(value: unknown): string {
  if (typeof value !== 'string' || /[\u0000-\u001f\u007f]/u.test(value)) throw new Error('昵称请填写 1–20 个字符');
  const name = value.trim();
  if (!name || [...name].length > 20) throw new Error('昵称请填写 1–20 个字符');
  return name;
}
export function draftKey(userId: string, date: string): string {
  if (!userId) throw new Error('请先登录');
  return `diary-draft:v2:${encodeURIComponent(userId)}:${date}`;
}

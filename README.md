# 观察日记

奶油粉风格的个人日记网站：写下今天，随时补充，从日历补记，自动查看每周状态图片。

## 功能

- 每位用户独立的日记、昵称、浏览器草稿和周报。
- 在「我的」修改昵称，首页和周报同步更新；昵称不是登录凭据。
- 心情、精力、睡眠、咖啡、专注可选记录，缺失数据不会当成零。
- 周报在打开时自动生成 PNG，补记后更新，不包含日记原文。
- 乐观锁避免多个页面覆盖同一天的记录。

## 本地运行

需要 Node.js 22.13+ 和 npm。

```sh
npm ci
npm run build
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0000_shocking_beast.sql
npx wrangler d1 execute DB --local --persist-to .wrangler/state --config dist/server/wrangler.json --file drizzle/0001_happy_bruce_banner.sql
npm run dev -- --host 127.0.0.1
```

打开终端显示的本地地址，点击登录。开发模式使用单个虚拟账号，只能用于本机测试。数据库迁移在新数据库上按顺序执行一次；已有数据库不要重复执行建表 SQL。

```sh
node --experimental-strip-types --test tests/*.test.mjs
npx tsc --noEmit
npm run build
```

## 部署

当前生产版本针对 OpenAI Sites 的 Cloudflare Workers + D1 运行环境，使用 Sites 提供的 ChatGPT 登录。通过 Sites 插件为自己的副本注册站点，保留 `.openai/hosting.json` 的 `d1: "DB"`，由工具写入新站点的 `project_id`，再构建并发布。迁移随部署包提交。

不要复用他人的站点 ID、数据库、凭证或 `.wrangler` 目录。公开网站入口不等于公开日记：所有日记和昵称查询都使用服务端认证的用户 ID。

其他托管平台需要替换 `app/chatgpt-auth.ts` 的身份验证实现并配置 D1。当前代码**不能直接作为通用 Cloudflare / Vercel 一键部署模板**：认证头必须由可信网关清理并注入，不能直接相信公网请求中的同名头。

## 数据与边界

- 数据库保存用户 ID、昵称、日记和可选指标；浏览器本地保存按账号隔离的未保存草稿。
- 本项目没有分享日记功能。站点管理员可管理底层数据库，未实现端到端加密。
- 没有后台定时生成或 AI 文本总结；周图在打开页面时生成。
- 不包含作者的日记数据、账号凭证或旧聊天记录。
- 在共享设备上使用后退出账号；日记草稿仍可能保留在该浏览器存储中。

## 许可

项目原创代码采用 MIT 许可证，见 LICENSE。第三方代码保留原许可，见 `build/sites-vite-plugin.LICENSE` 与 `vendor/`。`public/bun-mascot.png` 为 AI 生成插画，作为项目素材提供，不代表对其可版权性或排他权利的保证。

## 福星AI算命

这是一个基于 `Next.js 16 + TypeScript + Tailwind CSS` 的 Web 端八字测算项目。
首版特性：

- 首页输入出生信息并提交测算
- 后端先完成四柱排盘，再生成结构化结果
- 结果页按卡片模块展示摘要、事业、财运、婚姻、健康等内容
- 默认不做长期数据库保存，只使用本地短时缓存
- 若配置 `OpenRouter`，会在规则引擎基础上进一步润色结果

## 本地启动

1. 复制环境变量：

```bash
cp .env.example .env.local
```

2. 如果你已经有 `OpenRouter API Key`，把它填进 `.env.local`；没有也能先本地跑通。

3. 启动开发服务：

```bash
npm run dev
```

4. 打开 `http://localhost:3000`

## 关键接口

- `POST /api/reading/create`：提交出生信息并创建测算 session
- `GET /api/reading/full/[sessionId]`：读取完整测算结果
- `GET /api/health`：健康检查

## 当前实现说明

- 缓存策略：当前使用 Node 进程内存缓存，服务重启后结果会失效
- 历法输入：前端已支持公历 / 农历切换
- 输出来源：
  - 没配 `OPENROUTER_API_KEY`：规则引擎输出
  - 已配置 `OPENROUTER_API_KEY`：规则引擎 + OpenRouter 润色

## 后续部署到火山云

当前代码先写在本地。后续部署到火山云时，重点处理这几件事：

1. 在服务器安装 Node.js 20+
2. 上传代码并执行 `npm install`
3. 配置 `.env.local` 或系统环境变量
4. 执行 `npm run build && npm run start`
5. 用 `Nginx` 反向代理到 `3000` 端口
6. 把你的火山云域名解析到服务器并配置 HTTPS

## 合规提醒

本项目对外定位为传统文化娱乐参考工具，不提供医疗、投资、法律等专业建议。

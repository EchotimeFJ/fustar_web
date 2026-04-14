## 福星AI命理

这是一个基于 `Next.js 16 + TypeScript + Tailwind CSS` 的 Web 端四柱命理解读项目，面向正式商用场景，强调沉稳视觉、即时生成和短时缓存。

## 最近更新

### 2026-04-15

- 出生年月日、出生时间、出生地区全部改成滚轮选择器
- 日期、时间、地区统一使用深色高光底部滚轮面板，交互更适合移动端与桌面端
- 出生地区支持省市联动滚轮，并保留“暂不填写”选项
- README 按本次开发同步更新

### 2026-04-14

- 首页补充当前会话隐私说明，并将“隐私说明 / 免责声明”入口直接置于主界面下方
- 结果页改为默认只显示大标题，点击后展开详细内容
- 新增长图导出与分享，支持完整版与隐私处理版
- 新增 `deploy.sh` 和 `edit-env.sh`，用于服务器一键更新和编辑环境变量

## 核心特性

- 首页提交出生信息并创建测算
- 后端先完成四柱排盘，再生成结构化结果
- 结果页支持折叠章节浏览，更适合先看目录再展开阅读
- 支持导出完整长图，或导出经过隐私处理的分享长图
- 默认不做长期数据库保存，只使用本地短时缓存
- 若配置 `OpenRouter`，会在规则引擎基础上进一步润色结果

## 本地启动

1. 在项目根目录新建 `.env.local`：

```env
OPENROUTER_API_KEY=你的OpenRouterKey
OPENROUTER_MODEL=z-ai/glm-4.7-flash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. 安装依赖：

```bash
npm ci
```

3. 启动开发服务：

```bash
npm run dev
```

4. 打开 `http://localhost:3000`

## 本地测试建议

- 首页检查滚轮选择器是否能正常打开、滚动、确认
- 检查公历 / 农历切换后，日期范围是否会自动校正
- 检查出生地区滚轮是否能完成省市联动，并支持“暂不填写”
- 测算后检查结果页是否默认折叠，仅展示大标题
- 测试“导出完整长图 / 导出隐私长图 / 分享完整长图 / 分享隐私长图”
- 如果关闭结果页，再次访问同一个 `sessionId`，应在宽限期后自动释放缓存

## 关键接口

- `POST /api/reading/create`：提交出生信息并创建测算 session
- `GET /api/reading/full/[sessionId]`：读取完整测算结果
- `POST /api/reading/release/[sessionId]`：标记当前会话结果进入释放流程
- `GET /api/health`：健康检查

## 当前实现说明

- 缓存策略：当前使用 Node 进程内存缓存，服务重启后结果会失效
- 页面关闭后会触发结果释放标记，并在短暂宽限期后自动清理
- 历法输入：前端支持公历 / 农历切换
- 输出来源：
  - 没配 `OPENROUTER_API_KEY`：规则引擎输出
  - 已配置 `OPENROUTER_API_KEY`：规则引擎 + OpenRouter 润色

## 服务器更新

服务器已支持以下脚本：

```bash
bash edit-env.sh
bash deploy.sh
```

- `edit-env.sh`：编辑 `.env.local`，并自动保留备份
- `deploy.sh`：自动执行 `git pull`、`npm ci`、`npm run build`、重启服务、健康检查

## 部署说明

推荐使用 `Next.js + systemd + Nginx + HTTPS`：

1. 在服务器安装 Node.js 20+
2. 拉取 GitHub 仓库代码
3. 配置 `.env.local`
4. 执行 `npm run build`
5. 使用 `systemd` 托管 `next start`
6. 通过 `Nginx` 反向代理到 `3000`
7. 域名解析到服务器并配置 HTTPS

## 合规提醒

本项目对外定位为传统文化娱乐参考工具，不提供医疗、投资、法律等专业建议。

# 福星 AI 命理

基于 `Next.js 16 + TypeScript + Tailwind CSS` 的四柱命理测算 Web 项目，面向正式商用场景，强调沉稳视觉、即时生成和短时缓存。

## 最近更新

### 2026-04-15

- 出生地区滚轮数据升级为完整省级与地级行政区列表，补充直辖市区县、自治州、地区、港澳和台湾县市
- 地区滚轮单项排版增强，长名称可保持更稳定的阅读与选择体验
- 太极图重绘为标准太极图 SVG，不再使用错误的近似拼装图形
- README 按本次开发同步更新

### 2026-04-14

- 出生年月日、出生时间、出生地区全部改为滚轮选择
- 日期、时间、地区统一使用深色金属质感底部面板
- 首页补充隐私说明、免责声明入口
- 结果页默认只显示大标题，支持逐段展开
- 新增长图导出与分享，支持完整内容和隐私处理版本
- 新增 `deploy.sh` 和 `edit-env.sh`，便于服务器更新与环境变量维护

## 核心功能

- 首页提交出生信息并创建测算
- 后端先完成排盘，再生成结构化长文结果
- 结果页支持折叠章节浏览，更适合先看目录再展开阅读
- 支持导出完整长图或隐私处理后的分享长图
- 默认不做长期数据库保存，仅使用进程内短时缓存
- 若配置 `OpenRouter`，会在规则结果基础上进一步生成更完整的分析文本

## 本地启动

1. 在项目根目录创建 `.env.local`

```env
OPENROUTER_API_KEY=你的OpenRouterKey
OPENROUTER_MODEL=z-ai/glm-4.7-flash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. 安装依赖

```bash
npm ci
```

3. 启动开发服务

```bash
npm run dev
```

4. 打开 [http://localhost:3000](http://localhost:3000)

## 本地测试建议

- 检查出生日期、出生时间、出生地区三个滚轮面板是否能正常打开、滚动与确认
- 检查出生地区是否覆盖完整省级与地级行政区名称
- 检查长名称地区在滚轮与卡片中是否仍然清晰可读
- 检查公历 / 农历切换后日期范围是否能自动校正
- 测算后检查结果页是否默认折叠，仅展示一级标题
- 测试“导出完整长图 / 导出隐私长图 / 分享完整长图 / 分享隐私长图”
- 关闭结果页后再次访问同一 `sessionId`，确认缓存会在宽限期后释放

## 关键接口

- `POST /api/reading/create`：提交出生信息并创建测算 session
- `GET /api/reading/full/[sessionId]`：读取完整测算结果
- `POST /api/reading/release/[sessionId]`：标记当前会话结果进入释放流程
- `GET /api/health`：健康检查

## 当前实现说明

- 缓存策略：当前使用 Node 进程内存缓存，服务重启后结果会失效
- 页面关闭后会触发结果释放标记，并在短暂宽限期后自动清理
- 地区数据：当前仓库内置完整省级与地级行政区列表，不依赖运行时远程请求
- 历法输入：前端支持公历 / 农历切换
- 输出来源：
  - 未配 `OPENROUTER_API_KEY`：规则引擎输出
  - 已配 `OPENROUTER_API_KEY`：规则引擎 + OpenRouter 生成

## 服务器维护

服务器已支持以下脚本：

```bash
bash edit-env.sh
bash deploy.sh
```

- `edit-env.sh`：编辑 `.env.local`，并自动保留备份
- `deploy.sh`：自动执行 `git pull`、`npm ci`、`npm run build`、重启服务和健康检查

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

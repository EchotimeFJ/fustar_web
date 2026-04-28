# 快速部署命令参考

## 在本地开发后更新到服务器的步骤

### 步骤 1: 本地开发完成并测试通过

```bash
# 确保代码在本地正常运行
cd /Users/frankjia/project/fustar_web
npm run dev
```

### 步骤 2: 提交代码到 GitHub

```bash
# 添加所有更改
git add .

# 提交更改（记得写清楚提交信息）
git commit -m "你的更改描述"

# 推送到 GitHub
git push origin main
```

### 步骤 3: 在服务器上更新代码

SSH 连接到服务器：
```bash
ssh 用户名@服务器IP
```

进入项目目录并更新：
```bash
# 进入项目目录
cd /var/www/fustar_web

# 拉取最新代码
git pull origin main

# 安装依赖
npm ci

# 构建项目
npm run build

# 重启服务
sudo systemctl restart fustar-web

# 检查状态
sudo systemctl status fustar-web
```

### 步骤 4: 验证部署成功

```bash
# 检查服务是否正常运行
curl http://127.0.0.1:3000

# 检查网站是否可访问
curl -I https://www.fustar.top
```

## 一行命令更新（推荐）

在服务器上执行完整更新流程：
```bash
cd /var/www/fustar_web && git pull origin main && npm ci && npm run build && sudo systemctl restart fustar-web && sudo systemctl status fustar-web
```

## 查看日志和调试

```bash
# 实时查看应用日志
sudo journalctl -u fustar-web -f

# 查看最近的错误
sudo journalctl -u fustar-web --since "5 minutes ago"

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

## 如果部署失败

```bash
# 1. 检查服务状态
sudo systemctl status fustar-web

# 2. 查看错误日志
sudo journalctl -u fustar-web -n 50

# 3. 检查端口占用
sudo lsof -i :3000

# 4. 检查环境变量
cat /var/www/fustar_web/.env.local

# 5. 手动测试构建
cd /var/www/fustar_web
npm run build

# 6. 检查 Node 版本
node -v
npm -v

# 7. 清理缓存重新构建
rm -rf .next
npm run build
```

## 回滚到之前版本

```bash
# 查看提交历史
cd /var/www/fustar_web
git log --oneline

# 回滚到指定版本（用实际 commit hash 替换）
git revert <commit-hash>

# 或者强制回滚（谨慎使用）
git reset --hard <commit-hash>
git push --force

# 重启服务
sudo systemctl restart fustar-web
```

## 使用 PM2 部署（可选）

如果你想使用 PM2 来管理进程：

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd /var/www/fustar_web
pm2 start npm --name "fustar-web" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup

# 查看状态
pm2 status

# 查看日志
pm2 logs fustar-web

# 重启应用
pm2 restart fustar-web
```

更新时：
```bash
cd /var/www/fustar_web
git pull origin main
npm ci
npm run build
pm2 restart fustar-web
```

## 常用服务管理命令

```bash
# 启动服务
sudo systemctl start fustar-web

# 停止服务
sudo systemctl stop fustar-web

# 重启服务
sudo systemctl restart fustar-web

# 查看状态
sudo systemctl status fustar-web

# 查看详细日志
sudo journalctl -u fustar-web -f

# 检查 Nginx 状态
sudo systemctl status nginx

# 重载 Nginx 配置
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx
```

## 健康检查

```bash
# 检查应用健康状态
curl http://127.0.0.1:3000/api/health

# 检查 HTTPS 是否正常
curl -I https://www.fustar.top

# 检查 DNS 解析
nslookup www.fustar.top

# 检查 SSL 证书
sudo certbot certificates -d www.fustar.top
```

## 定时任务建议

建议设置定时任务自动更新代码和清理日志：

```bash
# 编辑 crontab
sudo crontab -e

# 添加以下行（每天凌晨2点自动更新）
0 2 * * * cd /var/www/fustar_web && git pull origin main >> /var/log/git-pull.log 2>&1
```

## 备份重要文件

```bash
# 备份环境变量
cp /var/www/fustar_web/.env.local ~/backup/.env.local.$(date +%Y%m%d)

# 备份整个项目
tar -czf ~/backup/fustar_web_$(date +%Y%m%d).tar.gz /var/www/fustar_web
```

## 常用快捷命令总结

```bash
# 完整部署流程（一行）
cd /var/www/fustar_web && git pull && npm ci && npm run build && sudo systemctl restart fustar-web

# 查看状态
sudo systemctl status fustar-web

# 查看日志
sudo journalctl -u fustar-web -f

# 测试构建
npm run build

# 测试应用
curl http://127.0.0.1:3000
```

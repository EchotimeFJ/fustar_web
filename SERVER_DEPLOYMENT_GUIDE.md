# 服务器部署指南

本指南将帮助你了解如何在服务器上部署和更新福星 AI 命理网站。

## 前提条件

- 服务器已安装 Node.js (建议 v18+)
- 服务器已安装 Git
- 服务器已配置 Nginx (用于反向代理)
- 服务器已设置 systemd 服务管理

## 首次部署步骤

### 1. 连接服务器

```bash
ssh 用户名@服务器IP
```

### 2. 创建项目目录并克隆代码

```bash
# 创建项目目录
sudo mkdir -p /var/www/fustar_web
sudo chown -R $USER:$USER /var/www/fustar_web

# 进入目录
cd /var/www/fustar_web

# 克隆 GitHub 仓库
git clone https://github.com/EchotimeFJ/fustar_web .

# 切换到 main 分支
git checkout main
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
nano .env.local
# 或使用 vi/vim
vi .env.local
```

添加必要的环境变量：
```env
NEXT_PUBLIC_SITE_URL=https://www.fustar.top
# 根据需要添加其他变量
```

### 4. 安装依赖

```bash
npm ci
```

### 5. 构建项目

```bash
npm run build
```

### 6. 创建 systemd 服务

创建服务文件：
```bash
sudo nano /etc/systemd/system/fustar-web.service
```

添加以下内容：
```ini
[Unit]
Description=Fustar Web Service
After=network.target

[Service]
Type=simple
User=你的用户名
WorkingDirectory=/var/www/fustar_web
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start fustar-web

# 设置开机自启
sudo systemctl enable fustar-web

# 检查服务状态
sudo systemctl status fustar-web
```

### 7. 配置 Nginx 反向代理

创建 Nginx 配置文件：
```bash
sudo nano /etc/nginx/sites-available/fustar_web
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name www.fustar.top fustar.top;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点：
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/fustar_web /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 8. 配置 SSL 证书（推荐）

使用 Let's Encrypt 免费证书：
```bash
# 安装 certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d www.fustar.top -d fustar.top
```

## 更新代码步骤

### 方法一：使用部署脚本

在服务器的项目目录中运行：
```bash
cd /var/www/fustar_web

# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
sudo bash deploy.sh
```

这个脚本会自动：
1. 检查环境变量
2. 拉取最新代码
3. 安装依赖
4. 构建项目
5. 重启服务
6. 检查健康状态

### 方法二：手动更新

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

### 方法三：通过 GitHub Actions 自动部署

如果配置了 GitHub Actions，每次推送到 main 分支都会自动部署。

## 常用命令

```bash
# 查看服务状态
sudo systemctl status fustar-web

# 重启服务
sudo systemctl restart fustar-web

# 停止服务
sudo systemctl stop fustar-web

# 查看日志
sudo journalctl -u fustar-web -f

# 查看错误日志
sudo journalctl -u fustar-web --since "1 hour ago"
```

## 故障排查

### 1. 服务启动失败

```bash
# 查看详细错误
sudo journalctl -u fustar-web -n 50

# 检查端口占用
sudo lsof -i :3000

# 检查环境变量
cat /var/www/fustar_web/.env.local
```

### 2. Nginx 配置问题

```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. 构建失败

```bash
# 清理并重新安装
rm -rf node_modules
npm cache clean --force
npm ci

# 查看构建错误
npm run build
```

## 安全建议

1. **定期更新系统包**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **设置防火墙**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

3. **定期备份**
   ```bash
   # 备份项目文件
   tar -czf backup_$(date +%Y%m%d).tar.gz /var/www/fustar_web
   
   # 备份环境变量
   cp /var/www/fustar_web/.env.local ~/backup_env
   ```

4. **监控服务**
   ```bash
   # 使用 systemd 查看资源使用
   sudo systemctl show fustar-web | grep -E "Memory|CPU"
   ```

## 性能优化

1. **使用 PM2 替代 npm start（可选）**
   ```bash
   npm install -g pm2
   pm2 start npm --name "fustar-web" -- start
   pm2 save
   pm2 startup
   ```

2. **配置 Nginx 缓存**
   ```nginx
   location /_next/static {
       proxy_pass http://127.0.0.1:3000;
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## 联系支持

如果在部署过程中遇到问题，可以：
1. 查看日志：`sudo journalctl -u fustar-web -n 100`
2. 检查 GitHub Issues
3. 查看项目文档

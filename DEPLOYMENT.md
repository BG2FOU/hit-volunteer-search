# 前端部署到GitHub Pages完整指南

## 📋 前置准备

1. **确认配置**：已将API地址设置为 `http://*.*.*.*:5033/api`
2. **GitHub账号**：确保您有GitHub账号且已登录
3. **Git工具**：确保本地已安装Git

## 🚀 部署步骤

### 步骤1: 创建新的GitHub仓库

1. 登录GitHub，点击右上角的 "+" 号
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `hit-volunteer-search` (或您喜欢的名字)
   - **Description**: `HIT志愿时长查询系统前端页面`
   - **Public**: 选择Public（GitHub Pages需要）
   - **Add README**: 不勾选（我们已经准备好了）

### 步骤2: 初始化并上传前端代码

在命令行中进入 `frontend` 文件夹，执行以下命令：

```bash
# 进入frontend目录
cd frontend

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: HIT志愿时长查询系统前端"

# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/BG2FOU/hit-volunteer-search.git

# 推送到GitHub
git push -u origin main
```

### 步骤3: 启用GitHub Pages

1. 在GitHub仓库页面，点击 **Settings** 标签
2. 向下滚动找到 **Pages** 部分
3. 在 **Source** 下拉菜单中选择 **Deploy from a branch**
4. 在 **Branch** 中选择 **main**
5. 文件夹选择 **/ (root)**
6. 点击 **Save**

### 步骤4: 等待部署完成

- GitHub会自动构建和部署您的网站
- 通常需要几分钟时间
- 部署完成后，您的网站地址将是：
  `https://bg2fou.github.io/hit-volunteer-search`

## 🔧 配置验证

### API连接测试

部署完成后，访问您的GitHub Pages网址：

1. **打开主页**：应该能看到查询界面
2. **测试查询**：输入一个已知的学号或姓名
3. **检查控制台**：按F12打开开发者工具，查看Network标签
4. **确认API调用**：应该能看到对 `http://*.*.*.*:5033/api/search` 的请求

### 常见问题排查

**问题1: 跨域错误 (CORS)**
- 确保后端已启用CORS支持
- 检查 `app.py` 中是否有 `CORS(app)` 配置

**问题2: API地址错误**
- 检查 `js/config.js` 中的生产环境配置
- 确认服务器地址是否正确

**问题3: 404错误**
- 确认后端API服务正在运行
- 检查后端路由是否正确设置

## 🔄 更新部署

当您需要更新前端时：

```bash
# 在frontend目录下
git add .
git commit -m "更新：描述您的更改"
git push origin main
```

GitHub Pages会自动重新部署。

## 📱 移动端优化

我们已经添加了响应式设计，但您可以进一步优化：

1. **添加PWA支持**（可选）
2. **优化移动端交互**
3. **添加离线缓存**

## 🛡️ 安全注意事项

1. **API安全**：
   - 考虑为API添加访问频率限制
   - 考虑添加简单的认证机制

2. **数据保护**：
   - 确保API不会泄露敏感信息
   - 考虑添加数据脱敏

## 🎯 最终检查清单

- [ ] 前端仓库已创建并上传
- [ ] GitHub Pages已启用
- [ ] 网站可以正常访问
- [ ] API连接正常
- [ ] 查询功能正常工作
- [ ] 批量查询功能正常
- [ ] 移动端显示正常

## 📞 获取帮助

如果遇到问题：

1. **检查浏览器控制台**：F12 → Console
2. **检查网络请求**：F12 → Network
3. **查看GitHub Actions**：仓库的Actions标签
4. **联系开发者**：通过主仓库Issue

---

🎉 **恭喜！您的前端现在可以独立运行在GitHub Pages上，完全免费！**
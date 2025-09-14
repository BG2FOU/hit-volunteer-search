# HIT-Volunteer志愿时长查询系统 - 前端

这是HIT-Volunteer志愿时长查询系统的前端静态页面，使用纯HTML/CSS/JavaScript实现，可以独立部署到GitHub Pages。

## 🌟 在线访问

**GitHub Pages地址**: [https://bg2fou.github.io/hit-volunteer-search](https://bg2fou.github.io/hit-volunteer-search)

## ✨ 功能特性

- 🔍 **单个查询**: 支持按姓名或学号查询志愿服务记录
- 📊 **批量查询**: 支持批量导入查询列表，快速统计多人志愿时长
- 📋 **结果复制**: 一键复制查询结果，便于粘贴到Excel或Word
- 📱 **响应式设计**: 支持手机、平板、电脑等各种设备
- ⚡ **快速加载**: 纯静态文件，加载速度快
- 🔧 **自动配置**: 根据部署环境自动选择API地址

## 🚀 本地开发

1. 确保后端API服务正在运行（默认 `http://localhost:50331`）
2. 直接在浏览器中打开 `index.html` 即可

```bash
# 如果需要本地服务器预览
python -m http.server 8080
# 然后访问 http://localhost:8080
```

## 🔧 配置说明

API地址配置在 `js/config.js` 文件中：

```javascript
const CONFIG = {
    development: {
        API_BASE_URL: 'http://localhost:50331/api'  // 本地开发
    },
    production: {
        API_BASE_URL: 'http://*.*.*.*:50331/api'   // 生产环境
    }
};
```

- **本地开发时**: 自动使用localhost地址
- **GitHub Pages部署时**: 自动使用生产环境地址

## 📱 页面说明

### 主页 (`index.html`)
- 单个志愿者查询
- 支持按姓名或学号搜索
- 显示详细的志愿服务记录

### 批量查询 (`batch.html`)
- 批量导入查询列表
- 支持格式：学号、姓名、或"姓名 学号"
- 统计总时长和个人时长
- 支持查看每个人的详细记录

## 🛠️ 技术栈

- **HTML5**: 语义化标签，支持现代浏览器
- **CSS3**: Flexbox布局，响应式设计
- **Vanilla JavaScript**: 原生JS，无第三方依赖
- **Fetch API**: 现代HTTP请求方式

## 🌐 API接口

本前端对接以下API端点：

- `GET /api/search`: 单个查询
- `POST /api/batch`: 批量查询  
- `GET /api/details`: 获取详细信息

## 📞 支持

如有问题或建议，请：
- 提交Issue到主仓库：[HIT-Volunteer](https://github.com/BG2FOU/HIT-Volunteer)
- 联系开发者：BG2FOU(BG2FOU@outlook.com)
- 或联系：volunteer@hit.edu.cn

## 📄 许可证

本项目遵循主项目的许可证协议。

---

> 🎯 **提示**: 本前端页面与后端API完全分离，可以独立部署和维护。后端代码请参见主仓库。
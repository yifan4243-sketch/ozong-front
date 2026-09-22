# AI 智能通话分析 SaaS 产品主页 — 中文版源码包

这是从 Figma Make 项目整理并完成中文本地化的本地开发包。

## 放到 Windows 桌面

1. 下载 ZIP。
2. 解压到：
   `C:\Users\yifan\Desktop\AI-Call-Analytics-SaaS-Landing-Page-Figma-CHINESE`

## 本地运行

在 PowerShell 中执行：

```powershell
cd "C:\Users\yifan\Desktop\AI-Call-Analytics-SaaS-Landing-Page-Figma-CHINESE"
npm install
npm run dev
```

终端会显示本地地址，通常是：
`http://localhost:5173`

## 中文化说明

- 顶部导航、首屏、功能、优势、客户评价、价格、常见问题和页脚均已转换为中文。
- 页面标题、图片替代文字、常用无障碍提示等也已做中文化处理。
- 为保证项目正常运行，代码变量名、依赖包名、框架 API、CSS 类名等技术内容保持原样。
- `src/app/`：Figma Make 原项目页面与组件。
- `src/styles/`：Figma Make 原项目样式。
- `package.original.json`：Figma Make 返回的原始 package.json 备份。
- `package.json`：可直接用于本地安装与运行。
- `index.html`、`src/main.tsx`：本地 Vite 启动入口。

后续可以直接以此中文版为母版，把智能通话分析内容替换成 OzonG 官网内容，而不影响现有 ERP 生产项目。

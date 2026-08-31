# 《影蚀天穹》网页小说项目

这是一个以 Vinext、React 与分章 Markdown 构建的本地网页小说站。五卷三十章与尾声分别存放，网页提供卷册目录、前后章导航、夜间阅读、字号调整与设备本地阅读进度。

## 本地查看

```powershell
npm install
npm run dev
```

启动后打开终端给出的本地地址。默认会使用 `http://localhost:3000`；如果端口已占用，会自动选择下一个可用端口。

## 内容位置

- `content/chapters/`：三十章与尾声，每章一个 Markdown 文件。
- `content/source/`：导入时使用的连续叙事版完整详纲存档。
- `scripts/split-source.mjs`：从完整详纲重新生成分章文件的工具。
- `app/read/[slug]/page.tsx`：章节阅读页。
- `components/reader-shell.tsx`：目录、进度、主题、字号和前后章导航。

平时修改章节时，直接编辑 `content/chapters/` 中对应的 Markdown 即可。只有需要从完整详纲重新覆盖生成全部章节时，才运行：

```powershell
npm run content:split
```

## 构建

```powershell
npm run build
```

## 手动部署到 Vercel

1. 在 Vercel 控制台选择 **Add New → Project**。
2. 导入 GitHub 仓库 `mosuzi/ying-shi-tian-qiong`。
3. 保持项目根目录为 `./`，直接点击 **Deploy**。

`vercel.json` 已指定 Vercel 构建命令，构建结果会由 Nitro 输出为 Vercel Build Output API 所需的 `.vercel/output`，无需手动填写输出目录。以后向 `main` 分支推送更新时，Vercel 会自动重新部署。

社交分享封面位于 `public/og.png`。Vercel 默认会自动使用生产域名；如绑定自定义域名，可通过 `NEXT_PUBLIC_SITE_URL` 指定正式地址（例如 `https://example.com`）。

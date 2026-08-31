# zed-loves-syndra

这是《影蚀天穹》的网页小说项目，以 Vinext、React 与分章 Markdown 构建。五卷三十章与尾声分别存放，网页提供卷册目录、前后章导航、夜间阅读、字号调整与设备本地阅读进度。

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

社交分享封面位于 `public/og.png`。

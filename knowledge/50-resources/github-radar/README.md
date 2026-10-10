# GitHub 热门项目雷达

这里保存 GitHub 星级项目增长扫描数据，用来观察快速增长、热门技术和 AI/Agent 方向的新项目。

## 当前入口

- 最新报告：reports/2026-10-10.md
- 最新原始数据：latest.json
- 当日归档：history/2026-10-10.json

## 当前 Top 5

1. 🤖 [morluto/rea](https://github.com/morluto/rea)：Reverse engineer anything with agents, from app behavior down to native binaries.（+14,927 stars today）
2. 🧰 [boykopovar/AnyPS5](https://github.com/boykopovar/AnyPS5)：Tool for automatic PS5 executables porting to Linux and Windows（+5,868 stars today）
3. 🧠 [storytold/artcraft](https://github.com/storytold/artcraft)：ArtCraft is an intentional crafting engine for artists, designers, and filmmakers（+3,752 stars today）
4. 🤖 [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)：Editorial diagram design for Claude Code, Codex, GitHub Copilot, Factory Droid, and Pi. 44 diagram types. Self-contai...（+1,739 stars today）
5. 🤖 [mattpocock/skills](https://github.com/mattpocock/skills)：Skills for Real Engineers. Straight from my .agents directory.（+1,687 stars today）

## 运行方式

```bash
cd tools/github-radar
npm run scan
```

扫描会覆盖 `latest.json`，并按日期写入 `history/` 和 `reports/`。

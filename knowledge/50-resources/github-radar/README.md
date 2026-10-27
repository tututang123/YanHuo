# GitHub 热门项目雷达

这里保存 GitHub 星级项目增长扫描数据，用来观察快速增长、热门技术和 AI/Agent 方向的新项目。

## 当前入口

- 最新报告：reports/2026-10-26.md
- 最新原始数据：latest.json
- 当日归档：history/2026-10-26.json

## 当前 Top 5

1. 🧠 [debpalash/VoiceStudio](https://github.com/debpalash/VoiceStudio)：VoiceStudio is the open-source, fully-local ElevenLabs alternative — voice cloning, voice design, video dubbing, dict...（+2,292 stars today）
2. 🤖 [Nutlope/hallmark](https://github.com/Nutlope/hallmark)：Anti-AI-slop design skill for Claude Code, Cursor, and Codex.（+2,235 stars today）
3. 🤖 [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)：A coding-agent skill for multi-phase security audits with independently verified, machine-readable findings（+2,069 stars today）
4. 🧠 [pbakaus/impeccable](https://github.com/pbakaus/impeccable)：The design language that makes your AI harness better at design.（+1,551 stars today）
5. 🤖 [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)：Universal SEO skill for Claude Code. 26 sub-skills + 19 sub-agents covering technical SEO, E-E-A-T, schema, GEO/AEO, ...（+1,539 stars today）

## 运行方式

```bash
cd tools/github-radar
npm run scan
```

扫描会覆盖 `latest.json`，并按日期写入 `history/` 和 `reports/`。

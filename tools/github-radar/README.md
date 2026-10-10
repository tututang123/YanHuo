# YanHuo GitHub Radar

扫描 GitHub 近期 star 增长快的热门项目，并把记录写入 YanHuo 知识体系。

## 运行

```bash
npm run scan
```

## 输出

默认写入：

- `knowledge/50-resources/github-radar/latest.json`
- `knowledge/50-resources/github-radar/history/YYYY-MM-DD.json`
- `knowledge/50-resources/github-radar/reports/YYYY-MM-DD.md`

## 配置

修改 `config.json`：

- `sourceUrl`：趋势数据源
- `knowledgeOutputDir`：知识体系输出目录
- `minStarsToday`：最低今日新增 star 阈值
- `topLimit`：Markdown 报告展示条数
- `categories`：扫描分类

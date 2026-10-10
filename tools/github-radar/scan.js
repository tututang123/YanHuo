const fs = require("fs");
const path = require("path");
const https = require("https");

const CONFIG_PATH = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const outputRoot = path.resolve(__dirname, config.knowledgeOutputDir);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      "User-Agent": "yanhuo-github-radar",
      Accept: "application/vnd.github+json"
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    https
      .get(url, { headers }, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          res.resume();
          return;
        }

        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Invalid JSON from ${url}: ${error.message}`));
          }
        });
      })
      .on("error", reject);
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function daysSince(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

function normalizeRepo(repo, category) {
  return {
    category,
    full_name: repo.full_name || `${repo.owner || ""}/${repo.name || ""}`,
    owner: repo.owner || "",
    name: repo.name || "",
    url: repo.url || "",
    language: repo.language || "",
    description: repo.description || "",
    stars_today: toNumber(repo.stars_today),
    total_stars: toNumber(repo.total_stars),
    total_forks: toNumber(repo.total_forks),
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    homepage: "",
    license: "",
    open_issues: null,
    pushed_at: null,
    created_at: null,
    enriched: false
  };
}

function collectRepos(catalog) {
  const categories = catalog.categories || {};
  const selectedCategories = config.categories.length ? config.categories : Object.keys(categories);
  const byRepo = new Map();

  for (const category of selectedCategories) {
    const repos = categories[category];
    if (!Array.isArray(repos)) continue;

    for (const repo of repos) {
      const normalized = normalizeRepo(repo, category);
      if (!normalized.full_name || normalized.full_name === "/") continue;
      if (normalized.stars_today < config.minStarsToday) continue;

      const existing = byRepo.get(normalized.full_name);
      if (!existing || normalized.stars_today > existing.stars_today) {
        byRepo.set(normalized.full_name, normalized);
      }
    }
  }

  return Array.from(byRepo.values()).sort((a, b) => {
    if (b.stars_today !== a.stars_today) return b.stars_today - a.stars_today;
    return b.total_stars - a.total_stars;
  });
}

async function enrichRepos(repos) {
  const limit = Math.min(config.enrichLimit || 0, repos.length);
  for (let index = 0; index < limit; index += 1) {
    const repo = repos[index];
    try {
      const data = await fetchJson(`https://api.github.com/repos/${repo.full_name}`);
      repo.description = data.description || repo.description;
      repo.language = data.language || repo.language;
      repo.total_stars = data.stargazers_count || repo.total_stars;
      repo.total_forks = data.forks_count || repo.total_forks;
      repo.open_issues = data.open_issues_count;
      repo.pushed_at = data.pushed_at;
      repo.created_at = data.created_at;
      repo.homepage = data.homepage || "";
      repo.license = data.license && data.license.spdx_id ? data.license.spdx_id : "";
      repo.topics = Array.isArray(data.topics) && data.topics.length ? data.topics : repo.topics;
      repo.enriched = true;
    } catch (error) {
      repo.enrich_error = error.message;
    }
  }
  return repos;
}

function iconForRepo(repo) {
  const text = `${repo.full_name} ${repo.description} ${repo.topics.join(" ")}`.toLowerCase();
  if (/agent|claude|codex|copilot|mcp|skill/.test(text)) return "🤖";
  if (/llm|ai|rag|model|diffusion|video|image/.test(text)) return "🧠";
  if (/security|audit|policy|isolation/.test(text)) return "🛡️";
  if (/docker|gateway|api|server|runtime|cloud/.test(text)) return "⚙️";
  if (/ui|design|diagram|frontend|html|css/.test(text)) return "🎨";
  if (/game|ps5|linux|windows|desktop/.test(text)) return "🧰";
  return "📌";
}

function languageIcon(language) {
  const lang = (language || "").toLowerCase();
  if (lang === "typescript") return "🔷";
  if (lang === "javascript") return "🟨";
  if (lang === "python") return "🐍";
  if (lang === "go") return "🐹";
  if (lang === "rust") return "🦀";
  if (lang === "c++") return "🔧";
  return "▫️";
}

function momentumLabel(repo) {
  if (repo.stars_today >= 5000) return "爆发";
  if (repo.stars_today >= 1000) return "强势";
  if (repo.stars_today >= 300) return "升温";
  if (repo.stars_today >= 100) return "观察";
  return "轻量";
}

function activityLabel(repo) {
  const days = daysSince(repo.pushed_at);
  if (days === null) return "未知";
  if (days <= 7) return "活跃";
  if (days <= 30) return "正常";
  if (days <= 120) return "偏慢";
  return "沉寂";
}

function maturityLabel(repo) {
  const age = daysSince(repo.created_at);
  if (age === null) return "未知";
  if (age <= 30) return "新项目";
  if (age <= 180) return "早期";
  if (repo.total_stars >= 50000) return "成熟高关注";
  return "已存在一段时间";
}

function oneLineIntro(repo) {
  const description = (repo.description || "暂无项目描述").replace(/\s+/g, " ").trim();
  if (description.length <= 120) return description;
  return `${description.slice(0, 117)}...`;
}

function whyWatch(repo) {
  const reasons = [];
  const searchText = `${repo.description} ${repo.topics.join(" ")}`;
  if (repo.stars_today >= 1000) reasons.push(`今日新增 ${repo.stars_today.toLocaleString("en-US")} star，传播速度很快`);
  if (/agent|mcp|codex|claude|skill/i.test(searchText)) {
    reasons.push("命中 AI Agent / MCP / Coding Agent 方向");
  }
  if (activityLabel(repo) === "活跃") reasons.push("最近 7 天内仍有代码更新");
  if (repo.open_issues !== null && repo.open_issues > 200) reasons.push(`issue 较多：${repo.open_issues}，需要看维护质量`);
  if (!repo.license) reasons.push("未识别 license，落地前需要确认授权");
  return reasons.length ? reasons.join("；") : "热度达到阈值，适合加入观察池";
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  return dateValue.slice(0, 10);
}

function markdownTable(repos) {
  const rows = [
    "| # | 图标 | Repository | 用途一句话 | Language | Stars Today | Total Stars | 活跃 | 观察理由 |",
    "|---:|---|---|---|---|---:|---:|---|---|"
  ];

  repos.forEach((repo, index) => {
    const intro = oneLineIntro(repo).replace(/\|/g, "\\|");
    const reason = whyWatch(repo).replace(/\|/g, "\\|");
    rows.push(
      `| ${index + 1} | ${iconForRepo(repo)} | [${repo.full_name}](${repo.url}) | ${intro} | ${languageIcon(repo.language)} ${repo.language || "-"} | +${repo.stars_today.toLocaleString("en-US")} | ${repo.total_stars.toLocaleString("en-US")} | ${activityLabel(repo)} | ${reason} |`
    );
  });

  return rows.join("\n");
}

function buildSpotlight(repo, index) {
  const topics = repo.topics.length ? repo.topics.map((topic) => `\`${topic}\``).join(" ") : "-";
  return `### ${index + 1}. ${iconForRepo(repo)} [${repo.full_name}](${repo.url})

- 用途：${oneLineIntro(repo)}
- 热度：${momentumLabel(repo)}，今日 +${repo.stars_today.toLocaleString("en-US")} star，总 star ${repo.total_stars.toLocaleString("en-US")}
- 技术：${languageIcon(repo.language)} ${repo.language || "-"}，topics：${topics}
- 活跃：${activityLabel(repo)}，最近更新 ${formatDate(repo.pushed_at)}，创建 ${formatDate(repo.created_at)}
- 成熟度：${maturityLabel(repo)}，fork ${repo.total_forks.toLocaleString("en-US")}，open issues ${repo.open_issues === null ? "-" : repo.open_issues}
- 授权/主页：${repo.license || "-"} ${repo.homepage ? `，${repo.homepage}` : ""}
- 观察点：${whyWatch(repo)}
`;
}

function buildRadarSummary(repos) {
  const hot = repos.filter((repo) => repo.stars_today >= 1000).length;
  const ai = repos.filter((repo) => /agent|mcp|ai|llm|codex|claude|skill/i.test(`${repo.description} ${repo.topics.join(" ")}`)).length;
  const active = repos.filter((repo) => activityLabel(repo) === "活跃").length;
  const languages = new Map();

  for (const repo of repos) {
    const language = repo.language || "Unknown";
    languages.set(language, (languages.get(language) || 0) + 1);
  }

  const topLanguages = Array.from(languages.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => `${language} ${count}`)
    .join("，");

  return `- 🔥 爆发/强势项目：${hot} 个
- 🤖 AI / Agent 相关：${ai} 个
- ⚡ 最近 7 天仍有更新：${active} 个
- 🧭 主要语言分布：${topLanguages || "-"}
- 🎯 今日优先看：${repos.slice(0, 3).map((repo) => repo.full_name).join("，")}`;
}

function buildReport(catalog, repos) {
  const date = catalog.date || new Date().toISOString().slice(0, 10);
  const updatedAt = catalog.updated_at || new Date().toISOString();
  const top = repos.slice(0, config.topLimit);
  const spotlight = repos.slice(0, config.spotlightLimit || 10);
  const aiRelated = repos
    .filter((repo) => /ai|agent|llm|mcp|coding|claude|codex|local-ai|skill/i.test(`${repo.full_name} ${repo.description} ${repo.topics.join(" ")}`))
    .slice(0, 15);

  return `# GitHub 热门项目雷达 - ${date}

数据源：${config.sourceUrl}

更新时间：${updatedAt}

## 雷达摘要

${buildRadarSummary(repos)}

## 本次扫描范围

- 收录阈值：今日新增 star >= ${config.minStarsToday}
- 记录项目数：${repos.length}
- 报告展示 Top ${top.length}
- 重点项目卡片：Top ${spotlight.length}
- 原始快照：\`history/${date}.json\`

## 重点观察项目

${spotlight.map(buildSpotlight).join("\n")}

## 增长最快完整榜

${markdownTable(top)}

## AI / Agent 相关

${aiRelated.length ? markdownTable(aiRelated) : "暂无匹配项目。"}

## 怎么看这个雷达

- 🔥 先看今日新增 star，它代表传播速度，不代表项目质量。
- ⚡ 再看最近更新时间，长期不更新但突然暴涨的项目要谨慎。
- 🧪 看 issue、license、README、release 和示例，判断能不能真的落地。
- 📌 对“高热度但用途不清”的项目先加入观察池，隔天再看是否继续增长。
`;
}

function writeKnowledgeIndex(catalog, repos) {
  const date = catalog.date || new Date().toISOString().slice(0, 10);
  const topFive = repos.slice(0, 5);
  const lines = [
    "# GitHub 热门项目雷达",
    "",
    "这里保存 GitHub 星级项目增长扫描数据，用来观察快速增长、热门技术和 AI/Agent 方向的新项目。",
    "",
    "## 当前入口",
    "",
    `- 最新报告：reports/${date}.md`,
    "- 最新原始数据：latest.json",
    `- 当日归档：history/${date}.json`,
    "",
    "## 当前 Top 5",
    "",
    ...topFive.map((repo, index) => {
      return `${index + 1}. ${iconForRepo(repo)} [${repo.full_name}](${repo.url})：${oneLineIntro(repo)}（+${repo.stars_today.toLocaleString("en-US")} stars today）`;
    }),
    "",
    "## 运行方式",
    "",
    "```bash",
    "cd tools/github-radar",
    "npm run scan",
    "```",
    "",
    "扫描会覆盖 `latest.json`，并按日期写入 `history/` 和 `reports/`。"
  ];

  fs.writeFileSync(path.join(outputRoot, "README.md"), `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  ensureDir(outputRoot);
  ensureDir(path.join(outputRoot, "history"));
  ensureDir(path.join(outputRoot, "reports"));

  const catalog = await fetchJson(config.sourceUrl);
  const repos = await enrichRepos(collectRepos(catalog));
  const date = catalog.date || new Date().toISOString().slice(0, 10);
  const snapshot = {
    source_url: config.sourceUrl,
    scanned_at: new Date().toISOString(),
    source_updated_at: catalog.updated_at || null,
    date,
    min_stars_today: config.minStarsToday,
    repos
  };

  fs.writeFileSync(path.join(outputRoot, "latest.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outputRoot, "history", `${date}.json`), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outputRoot, "reports", `${date}.md`), buildReport(catalog, repos), "utf8");
  writeKnowledgeIndex(catalog, repos);

  console.log(`GitHub radar scanned ${repos.length} repos into ${outputRoot}`);
  console.log(`Report: ${path.join(outputRoot, "reports", `${date}.md`)}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

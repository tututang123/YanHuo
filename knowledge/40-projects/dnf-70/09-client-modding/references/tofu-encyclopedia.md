# 豆腐百科 2.5 客户端改动资料

## 定位

豆腐百科 2.5 不是主要编辑器，而是 70 DNF 客户端改动说明、资料查询和修改心得的参考来源。

主要用途：

- 查询 PVF、NPK、IMG、NPC、装备、技能、怪物、地图、UI 等改动说明。
- 帮助判断一个功能应该改哪些客户端文件。
- 记录已经验证过的改动经验，沉淀成后续可复用流程。

## 本地位置

```text
C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\豆腐2.5.exe
```

录屏备份位置：

```text
private/dnf-70/client-tools/tofu-records/tofu-recording-20260619-073944.mp4
private/dnf-70/client-tools/tofu-records/frames/
```

注意：录屏和截图只放在 `private/`，不要上传 GitHub。

## 2026-06-19 录屏分析

视频文件：`QQ录屏20260619073944.mp4`

视频信息：

- 时长：约 5 分 54 秒。
- 分辨率：2238 x 1340。
- 抽帧方式：每 5 秒采样，并补充场景变化帧。

结论：这段录屏有帮助。它能作为“豆腐百科目录索引”和“客户端改动入口图”，尤其适合后续快速定位装备、怪物、物品、技能、NPC 商店、地图城镇、杂项、深度研究等主题。

## 重要时间点

| 时间 | 画面主题 | 对后续工作的价值 |
| --- | --- | --- |
| 00:00-01:10 | PVF 基础、脚本片段、参数和目录说明 | 适合用来理解 PVF 文件结构、字段含义、目录翻译 |
| 01:15 | `Script.pvf` 与服务端、客户端关系图 | 明确 `Script.pvf` 同时被服务端和客户端读取 |
| 01:20 | PVF 一级目录含义 | 可作为功能到目录的第一层映射 |
| 01:30-02:35 | 角色、职业、物品、ID、说明文本 | 适合查职业、物品、名称、描述、道具编号 |
| 02:40-03:15 | 装备改动目录 | 包含装备属性、技能、套装、掉落、描述、强化等主题 |
| 03:20-03:45 | 装备特效和装备文件结构 | 对“给装备加特效、加技能、改描述”有参考价值 |
| 03:55 | 怪物名称对照表 | 可辅助识别 `monster` 目录里的英文怪物名 |
| 04:00 | 怪物血量、攻击、防御修改示例 | 可用于定位 `.mob` 文件中的 `[HP MAX]`、`[level]` 等字段 |
| 04:20 | 装备掉落闪光、图片路径、IMG 路径 | 说明 PVF 中资源路径和客户端资源显示之间的关系 |
| 04:30 | 技能路径示例 | 看到 `skill/atfighter/*.skl` 这类技能文件路径 |
| 04:55-05:15 | NPC 商店、NPC 菜单添加 | 对 NPC 对话菜单、商店、分解、修理、强化等功能有参考价值 |
| 05:20-05:25 | UI/菜单与脚本示例 | 适合后续改界面入口或菜单文案时回看 |
| 05:40-05:53 | NPK/IMG/Sprite 资源路径列表 | 对补图、改图标、查资源路径有参考价值 |

## 从录屏提取出的核心规则

### Script.pvf 的作用

`Script.pvf` 是客户端和服务端都会读取的核心数据包。

- 服务端侧更关注数据通信、数据库操作、购买物品后的 ID、金币、商城价格等。
- 客户端侧更关注数据通信、动画、图片、声音和资源路径调用。
- 如果 PVF 中引用的客户端资源路径找不到，可能出现红叉、界面异常、客户端闪退等问题。

修改客户端功能时，不能只看 PVF 数值，还要检查它引用的 NPK/IMG/Sprite 资源是否存在。

### PVF 一级目录映射

| 目录 | 含义 | 备注 |
| --- | --- | --- |
| `character` | 角色相关，包括副职业 | 角色、职业、成长、技能入口常见 |
| `chatemoticon` | 聊天表情 | 客户端表现类 |
| `clientonly` | 客户端部分配置文件 | 只影响客户端的配置优先看这里 |
| `common` | 通用调用文件 | 例如地图传送等 |
| `creature` | 宠物 | 宠物相关 |
| `data` | 技能、UI 等相关数据 | 具体用途需按文件确认 |
| `dungeon` | 地下城 | 副本、地下城逻辑 |
| `equipment` | 装备 | 装备属性、说明、图标、特效常见 |
| `etc` | 配置文件 | 商城、爆率等也可能在这里 |
| `event` | 活动相关 | 活动脚本和配置 |
| `itemshop` | NPC 商店 | NPC 售卖、菜单功能 |
| `map` | 地图 | 地图和场景 |
| `monster` | 怪物 | 血量、攻击、防御、掉落等 |
| `n_quest` | 任务 | 任务数据 |
| `npc` | NPC | NPC 对话、菜单、商店 |
| `passiveobject` | 被动对象 | 固定对象、机关类 |
| `pet` | 宠物 | 宠物数据 |
| `pvp_mission` | PVP | PVP 相关 |
| `region` | 区域 | 阿拉德、天界、素喃等区域 |
| `skill` | 技能相关 | `.skl` 技能文件 |
| `sqr` | 脚本 | 部分脚本逻辑 |
| `stackable` | 可叠放物品 | 例如材料、消耗品 |
| `town` | 城镇 | 城镇地图和入口 |
| `ui` | 界面相关 | UI 配置 |
| `worldmap` | 世界地图 | 洛兰、赫顿玛尔、异次元裂缝、素喃、时空之门等 |

### 文本和列表文件

- `.lst` 文件更像列表/索引，新增物品或资源时通常要确认是否需要加入对应列表。
- `.kor.str` 是语言描述文件，装备说明、物品说明、部分文本显示会指向这里。
- 如果要查有哪些 `.kor.str`，豆腐百科提示可以看 `n_string.lst`。
- 国服 PVF 中，`.kor.str` 对应关系常见于 `chn.stk` 一类文件名，具体仍需以当前包导出内容为准。

### 怪物修改入口

豆腐百科示例指向：

```text
monster/<分类>/<怪物名>/<怪物名>.mob
```

常见字段：

- `[HP MAX]`：生命值。
- `[level]`：怪物等级。
- `[fire resistance]`、`[water resistance]` 等：属性抗性。
- 攻击、防御等字段也在怪物数据附近，但具体字段名要以目标 `.mob` 文件为准。

录屏中的示例还提示：怪物 AI、动作、攻击逻辑可能分散在同目录下的 `ai`、`animation`、`attackinfo`、`action` 等子目录，不要只改 `.mob` 就默认完成。

### 装备修改入口

录屏中装备相关主题很多，适合后续重点查：

- 装备属性。
- 装备加技能。
- 装备触发技能。
- 装备套装属性。
- 装备描述。
- 装备掉落特效。
- 装备图标和资源路径。

装备文件示例：

```text
equipment/character/common/jacket/cloth/11552.equ
```

录屏里出现的资源字段示例：

```text
[field image]
Item/field_equip1.img
```

关于装备掉落闪光，豆腐百科提示：

- 最好在闪光补丁中新增 IMG，再把改好的图片塞进去。
- PVF 装备里涉及的资源路径必须一起改。
- 改完需要替换 PVF，并重启服务器。
- 是否需要改 NPK 里的 IMG、贴图、坐标，要按目标功能验证。

### 技能修改入口

录屏中技能路径示例：

```text
skill/atfighter/1000hands1000eyes.skl
skill/atfighter/108stairsex.skl
skill/atfighter/activepropertystuckupex.skl
skill/atfighter/aimvitalpoint.skl
skill/atfighter/alchemy.skl
```

豆腐百科左侧目录中有：

- 全职业技能对照表。
- 全职业技能全解。
- 技能 PVF 修改教程。
- PVF 技能全技能制作。
- 全技能路径。
- SP 点、QQ 商店、独立掉落、自定义物品独立掉落等经验帖。

后续要改技能时，应先在豆腐百科里查职业路径和技能名，再到 `private/dnf-70/client-workspace/pvf-export/skill/` 下找对应文件。

### NPC 商店和菜单入口

录屏中出现 `npc/seria.npc` 的示例，菜单段落包括：

```text
[item shop]
[disjoint item]
[disjoint repair]
[upgrade item]
[amplify item]
[product item]
[one a day shop]
[mouse register]
[random option operate]
```

这说明 NPC 菜单不是单纯 UI 文案，通常要改 NPC 脚本段落和功能入口。后续要加 NPC 商店、修理、分解、强化、生产等菜单，应优先查 `npc/*.npc` 和 `itemshop` 目录。

## 后续整理方式

当你在豆腐百科里看到有用内容时，可以按下面方式交给 Codex：

1. 复制文字内容。
2. 截图并说明要记录哪部分。
3. 录屏浏览某个专题目录。
4. 口述目标功能，例如“我要给某件装备加技能”“我要改赛丽亚商店”“我要改怪物血量”。

Codex 后续应同步整理到：

```text
knowledge/40-projects/dnf-70/09-client-modding/references/tofu-encyclopedia.md
knowledge/40-projects/dnf-70/09-client-modding/file-maps/client-file-index.md
knowledge/40-projects/dnf-70/09-client-modding/patches/
```

## 待验证事项

| 主题 | 当前状态 | 后续动作 |
| --- | --- | --- |
| PVF Utility 整包导入导出 | 已知可行思路，细节待实操验证 | 第一次真实改动时记录完整步骤 |
| `.kor.str` 与国服文本文件对应 | 录屏有说明，但当前包未验证 | 在导出目录中查 `n_string.lst` 和文本文件 |
| 装备掉落闪光 | 录屏有经验说明 | 选一个低风险装备做测试 |
| NPC 商店菜单 | 录屏有 `seria.npc` 示例 | 先复制 NPC 文件做局部实验 |
| 怪物血量/防御 | 录屏有 `.mob` 示例 | 选一个测试怪物验证字段 |

## 注意

- 不要把客户端文件、EXE、导出的 PVF 内容、录屏、截图上传 GitHub。
- 如果内容涉及具体修改步骤，记录时要写清楚“是否已经在当前 70 DNF 项目里验证”。
- 如果涉及 PVF 导出文件修改，必须遵守 `format-safety-rules.md`：不要改编码、换行、缩进、分隔符、字体相关格式，不要自动格式化。

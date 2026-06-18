# 客户端文件索引 Client File Index

这个文件记录“想改某个功能时，优先查哪些客户端文件或目录”。具体字段仍要以当前导出的 `Script.pvf` 内容为准。

| 功能区域 | 客户端文件/目录 | 格式 | 工具 | 说明 |
| --- | --- | --- | --- | --- |
| PVF 总包 | `Script.pvf` | PVF | PVF Utility | 客户端和服务端都会读取；改动前必须备份 |
| PVF 导出工作区 | `private/dnf-70/client-workspace/pvf-export` | 文件夹 | PVF Utility | 整包导出的工作副本，不上传 GitHub |
| 角色/职业 | `character/` | PVF 导出文件 | PVF Utility / 文本查看 | 角色、副职业、职业相关入口 |
| 技能 | `skill/<职业>/<技能>.skl` | `.skl` | PVF Utility / 文本查看 | 技能属性、技能路径、技能制作、SP 等 |
| 装备 | `equipment/` | `.equ` 等 | PVF Utility / 文本查看 | 装备属性、描述、加技能、套装、掉落、图标 |
| 可叠放物品 | `stackable/` | PVF 导出文件 | PVF Utility / 文本查看 | 材料、消耗品等可叠放物品 |
| 物品名称/列表 | `*.lst`、`itemname.lst` 等 | 列表 | 文本查看 | 新增物品或资源时检查是否需要加入列表 |
| 文本描述 | `.kor.str`、`n_string.lst`、国服对应文本文件 | 文本/列表 | 文本查看 | 装备说明、物品说明、显示文本等 |
| 怪物 | `monster/<分类>/<怪物名>/<怪物名>.mob` | `.mob` | PVF Utility / 文本查看 | 血量、等级、抗性、攻击防御等 |
| 怪物动作/AI | `monster/<分类>/<怪物名>/ai`、`animation`、`attackinfo`、`action` | 多种 | PVF Utility / 文本查看 | 怪物技能、动作、攻击逻辑可能分散在这些目录 |
| NPC | `npc/*.npc` | `.npc` | PVF Utility / 文本查看 | NPC 对话、菜单、功能入口 |
| NPC 商店 | `itemshop/`、`npc/*.npc` | PVF 导出文件 | PVF Utility / 文本查看 | 售卖、修理、分解、强化、生产等菜单 |
| 地下城 | `dungeon/` | PVF 导出文件 | PVF Utility / 文本查看 | 副本、地下城相关 |
| 地图 | `map/` | PVF 导出文件 | PVF Utility / 文本查看 | 地图与场景 |
| 城镇 | `town/` | PVF 导出文件 | PVF Utility / 文本查看 | 城镇地图和入口 |
| 世界地图 | `worldmap/` | PVF 导出文件 | PVF Utility / 文本查看 | 世界地图、区域入口 |
| 区域 | `region/` | PVF 导出文件 | PVF Utility / 文本查看 | 阿拉德、天界、素喃等 |
| UI | `ui/`、`data/`、`clientonly/` | PVF 导出文件 | PVF Utility / 文本查看 | 界面配置、客户端专用配置 |
| 资源路径 | PVF 中的 `.img`、Sprite、NPK 路径字段 | 路径引用 | PVF Utility / NPK 工具 | PVF 只保存引用时，还要确认资源包里是否存在 |
| 活动 | `event/` | PVF 导出文件 | PVF Utility / 文本查看 | 活动相关脚本和配置 |
| 任务 | `n_quest/` | PVF 导出文件 | PVF Utility / 文本查看 | 任务数据 |
| 通用逻辑 | `common/` | PVF 导出文件 | PVF Utility / 文本查看 | 地图传送、通用调用等 |
| 杂项配置 | `etc/` | PVF 导出文件 | PVF Utility / 文本查看 | 商城、爆率、配置类内容可能在这里 |

## 已从豆腐百科录屏确认的示例

怪物血量、等级、抗性示例：

```text
monster/<分类>/<怪物名>/<怪物名>.mob
[HP MAX]
[level]
[fire resistance]
[water resistance]
```

装备文件和资源路径示例：

```text
equipment/character/common/jacket/cloth/11552.equ
[field image]
Item/field_equip1.img
```

技能路径示例：

```text
skill/atfighter/1000hands1000eyes.skl
skill/atfighter/108stairsex.skl
skill/atfighter/activepropertystuckupex.skl
```

NPC 菜单段落示例：

```text
npc/seria.npc
[item shop]
[disjoint item]
[disjoint repair]
[upgrade item]
[amplify item]
[product item]
[one a day shop]
```

## 使用规则

- 这里只做索引，不直接保存客户端大文件、导出 PVF、截图、录屏。
- 真正修改前，先在 `patches/` 记录目标、涉及文件、备份位置、回滚方式。
- 修改 PVF 导出文件时，必须遵守 `format-safety-rules.md`，只做最小改动。

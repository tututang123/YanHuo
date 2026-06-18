# 数据结构 Data Schemas

大规模整理数据前，先定义稳定结构。

## 职业 Class

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| id | 内部 ID | `slayer_m` |
| name_cn | 中文名 | `男鬼剑士` |
| status | 状态：confirmed / uncertain | `confirmed` |
| notes | 备注 | |

## 技能 Skill

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| id | 内部 ID | |
| class | 职业 ID | |
| name_cn | 中文名 | |
| level_required | 需求等级 | |
| type | active / passive / buff | |
| source | 来源 | |

## 道具 Item

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| id | 内部 ID | |
| name_cn | 中文名 | |
| level | 道具等级 | |
| rarity | 品级 | |
| slot | 装备部位 | |
| source | 来源 | |


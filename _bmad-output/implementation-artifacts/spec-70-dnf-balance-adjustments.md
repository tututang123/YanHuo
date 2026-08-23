---
title: '70 DNF 技能与物品平衡改动'
type: 'feature'
created: '2026-06-19'
status: 'draft'
context:
  - '{project-root}/knowledge/40-projects/dnf-70/09-client-modding/format-safety-rules.md'
  - '{project-root}/knowledge/40-projects/dnf-70/09-client-modding/file-maps/client-file-index.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** 需要对 70 DNF 当前导出的 `Script.pvf` 内容做一批技能、物品、套装、称号和角色配置调整，并让改动可通过 Git 对比。

**Approach:** 先在导出工作区中定位目标文件，只对确认过的字段做最小替换；对入口不明确的需求先向用户确认，避免误改相近技能、男女职业或套装效果。

## Boundaries & Constraints

**Always:** 保留 PVF 导出文件原始编码、换行、缩进、分隔符和字段结构；每个改动必须记录原值、新值、文件路径和验证状态；修改文件需要形成可对比的 Git 记录。

**Ask First:** 念气罩加血需要先确认目标数值；套装效果需要先确认具体属性改动；杀人/背叛药剂需要先确认目标物品和效果入口；如果实际原值和需求描述不一致，先确认再改。

**Confirmed:** Git 管理可以做；本轮职业范围只改 `fighter` 女格斗相关和 `gunner` 男枪手/男弹药相关，不改 `atfighter`、`atgunner`；PVF 时间单位按毫秒处理，`20000` 等于 20 秒；可交易的特殊狄瑞吉之血 `490004323` 从 `itemshop/equipmentshop7.shp` 出售列表删除。

**Never:** 不直接覆盖原始 `Script.pvf`；不上传整包 PVF 导出、客户端二进制、工具、录屏、截图或备份；不运行格式化工具；不批量重写无关文件。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 已定位技能 CD | 目标 `.skl` 文件存在且原值符合需求 | 只替换对应 CD 数值，例如 `40000` -> `10000` | 若原值不一致，暂停确认 |
| 男女职业同名技能 | `fighter` / `atfighter` 或 `gunner` / `atgunner` 都有同名技能 | 本轮只改 `fighter` 和 `gunner` | `atfighter`、`atgunner` 不改 |
| 套装/称号/魔盒类需求 | 不能从技能文件直接定位 | 先记录候选目录和需要用户补充的信息 | 不猜测套装 ID 或物品 ID |
| Git 对比 | PVF 导出目录位于 `private/` 且默认忽略 | 建立可追踪的补丁镜像或经用户确认后强制追踪指定文件 | 不把整包导出加入 Git |

</frozen-after-approval>

## Code Map

- `private/dnf-70/client-workspace/pvf-export/skill/fighter/LightningDance.skl` -- 闪电之舞候选；当前 `[cool time]` 为 `20000 20000`，按毫秒确认为 20 秒，本轮可改为 `8000 8000`。
- `private/dnf-70/client-workspace/pvf-export/skill/atfighter/LightningDance.skl` -- 非本轮范围，不改。
- `private/dnf-70/client-workspace/pvf-export/skill/gunner/NapalmBomb.skl` -- 地狱烈焰/光子爆弹候选；当前 `[cool time]` 为 `20000 20000`。
- `private/dnf-70/client-workspace/pvf-export/skill/atgunner/NapalmBomb.skl` -- 非本轮范围，不改。
- `private/dnf-70/client-workspace/pvf-export/skill/gunner/NielSniping.skl` -- 尼尔狙击候选；当前 `[cool time]` 为 `45000 45000`。
- `private/dnf-70/client-workspace/pvf-export/skill/atgunner/NielSniping.skl` -- 非本轮范围，不改。
- `private/dnf-70/client-workspace/pvf-export/skill/atgunner/G1.skl` -- 非本轮范围，不改。
- `private/dnf-70/client-workspace/pvf-export/skill/gunner/G1.skl` -- 当前 dungeon `[cool time]` 为 `20000 20000`，不符合“40 改 10 秒”的原值；目标未确认前不改。
- `private/dnf-70/client-workspace/pvf-export/skill/fighter/EnergyBallCharge.skl` -- 蓄念炮候选；当前 `[cool time]` 为 `6000 6000`，符合“6 改 4 秒”的原值。
- `private/dnf-70/client-workspace/pvf-export/skill/atfighter/EnergyBallCharge.skl` -- 非本轮范围，不改。
- `private/dnf-70/client-workspace/pvf-export/skill/fighter/NenGuard.skl` -- 念气罩候选；dungeon `[level info]` 为 3 列一组，推断为持续时间/范围/罩子 HP，第三列是加血/血量候选；目标数值未确认前不改。
- `private/dnf-70/client-workspace/pvf-export/skill/atfighter/NenGuard.skl` -- 非本轮范围，不改。
- `private/dnf-70/client-workspace/pvf-export/skill/mage/VoidEx.skl` -- 强化-虚无之球候选；当前无 `[cool time]`，主要是 `[static data]` 和 `[level info]`。
- `private/dnf-70/client-workspace/pvf-export/skill/swordman/SenseViolentTemper.skl` -- 修罗挫折意志“删除口蓝”需求取消，不改。
- `private/dnf-70/client-workspace/pvf-export/stackable/` -- 药剂、魔盒、宠物碎片、角色栏扩展券候选目录。
- `private/dnf-70/client-workspace/pvf-export/equipment/` -- 套装、称号属性、触发属性候选目录。
- `private/dnf-70/client-workspace/pvf-export/etc/` -- 全局配置、角色数量、商城、掉落、限制规则候选目录。
- `private/dnf-70/client-workspace/pvf-export/stackable/cash/randomcerabox.stk` -- 高级宠物盒碎片 `478896` 已存在于炽星魔盒奖励列表。
- `private/dnf-70/client-workspace/pvf-export/etc/equipmentpartset.etc` -- 全部装备套装索引入口；其中引用 `character/partset/3choroset64.equ`。
- `private/dnf-70/client-workspace/pvf-export/character/partset/3choroset64.equ` -- 套装属性名字文件；具体属性改法待确认。
- `private/dnf-70/client-workspace/pvf-export/itemshop/equipmentshop7.shp` -- 特殊的狄瑞吉之血(可交易) `490004323` 出售入口；本轮从 `[sell item]` 删除。

## Tasks & Acceptance

**Execution:**
- [x] 确认 Git 管理策略 -- 使用补丁镜像目录追踪修改文件，`private` 保留真实工作副本和导入准备文件。
- [x] 确认职业映射 -- 本轮只改 `fighter` 和 `gunner`，不改 `atfighter`、`atgunner`。
- [ ] `skill/*/*.skl` -- 修改已确认技能 CD、伤害、概率或静态字段。
- [ ] `stackable/**/*.stk` -- 修改已确认物品绑定、药剂删除或角色栏扩展相关配置。
- [ ] `equipment/**/*` -- 修改已确认套装和称号触发属性。
- [ ] `knowledge/40-projects/dnf-70/09-client-modding/patches/` -- 新增本次补丁记录，写清改动、文件、原值、新值、测试状态、回滚方式。
- [x] 取消需求 -- 加角色数量、修罗挫折意志“删除口蓝”、称号触发体力/精神去掉，本轮不处理。

**Acceptance Criteria:**
- Given 一个已确认技能 CD 改动, when 查看 Git diff, then 只能看到目标文件中目标 CD 数值变化。
- Given 一个入口不明确的需求, when 用户未确认, then 不修改任何猜测文件。
- Given PVF 文件被修改, when 检查文件, then 编码、换行、缩进和无关字段保持原样。
- Given 本轮补丁完成, when 查看 Git 状态, then 能看到可对比的改动文件和补丁说明。

## Spec Change Log

- 2026-06-20: 吸收用户确认：Git 管理允许；职业范围限定为 `fighter` 和 `gunner`；时间单位为毫秒；删除可交易特殊狄瑞吉之血 `490004323` 的商城出售入口；高级宠物盒碎片 ID 为 `478896`；念气罩 HP 字段需先定位再改；套装入口为 `etc/equipmentpartset.etc` 和 `character/partset/3choroset64.equ`；加角色数量、修罗挫折意志、称号触发体力/精神需求取消。

## Design Notes

因为 `private/` 默认不进入 Git，而用户需要对比改动，推荐做法是：

1. 真实导入用文件仍放在 `private/dnf-70/client-workspace/pvf-modified/` 或 `pvf-import-ready/`。
2. Git 对比用文件放在 `knowledge/40-projects/dnf-70/09-client-modding/patches/2026-06-19-balance-adjustments/files/`，只放本次改过的少量文件镜像。
3. 补丁说明记录每个镜像文件对应的原始 PVF 路径，导入时再复制到 `pvf-import-ready`。

这样可以对比改动，又不会把整包 PVF 导出加入 Git。

## Verification

**Commands:**
- `git diff --stat` -- expected: 只出现本轮补丁说明和已确认改动文件。
- `git diff -- <file>` -- expected: 每个文件只出现目标数值替换。
- `git status --short` -- expected: 没有整包 PVF 导出、录屏、截图、工具或备份进入 Git。

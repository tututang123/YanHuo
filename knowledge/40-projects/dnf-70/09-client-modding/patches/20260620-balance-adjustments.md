# 补丁记录：20260620 技能与商店平衡调整

## 日期

2026-06-20

## 目标

只处理已经确认的 `fighter`、`gunner` 范围改动，并删除可交易特殊狄瑞吉之血的商店出售入口。

## 修改原因

- 女格斗相关技能 CD 需要按毫秒单位调整。
- 可交易特殊狄瑞吉之血 `490004323` 在商店中出售后，消耗血效果不生效，因此从 `itemshop/equipmentshop7.shp` 删除该出售入口。

## 范围

### 包含

- `fighter/LightningDance.skl`：闪电之舞 CD 从 `20000 20000` 改为 `8000 8000`。
- `fighter/EnergyBallCharge.skl`：蓄念炮 CD 从 `6000 6000` 改为 `4000 4000`。
- `itemshop/equipmentshop7.shp`：从 `[sell item]` 列表删除 `490004323`。

### 不包含

- 不改 `atfighter`、`atgunner`。
- 不处理角色数量增加。
- 不处理修罗挫折意志“删除口蓝”。
- 不处理称号触发属性中的体力/精神。
- 念气罩加血只记录字段分析，等待目标数值后再改。
- 套装 `equipmentpartset.etc` / `character/partset/3choroset64.equ` 只记录入口，等待具体属性目标后再改。

## 修改文件

| 文件 | 原始路径 | 工作路径 | 导入准备路径 | Git 对比路径 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `LightningDance.skl` | `private/dnf-70/client-workspace/pvf-export/skill/fighter/LightningDance.skl` | `private/dnf-70/client-workspace/pvf-modified/skill/fighter/LightningDance.skl` | `private/dnf-70/client-workspace/pvf-import-ready/skill/fighter/LightningDance.skl` | `knowledge/40-projects/dnf-70/09-client-modding/patches/20260620-balance-adjustments/files/skill/fighter/LightningDance.skl` | 只改 `[cool time]` 第一处 |
| `EnergyBallCharge.skl` | `private/dnf-70/client-workspace/pvf-export/skill/fighter/EnergyBallCharge.skl` | `private/dnf-70/client-workspace/pvf-modified/skill/fighter/EnergyBallCharge.skl` | `private/dnf-70/client-workspace/pvf-import-ready/skill/fighter/EnergyBallCharge.skl` | `knowledge/40-projects/dnf-70/09-client-modding/patches/20260620-balance-adjustments/files/skill/fighter/EnergyBallCharge.skl` | 只改 `[cool time]` 第一处 |
| `equipmentshop7.shp` | `private/dnf-70/client-workspace/pvf-export/itemshop/equipmentshop7.shp` | `private/dnf-70/client-workspace/pvf-modified/itemshop/equipmentshop7.shp` | `private/dnf-70/client-workspace/pvf-import-ready/itemshop/equipmentshop7.shp` | `knowledge/40-projects/dnf-70/09-client-modding/patches/20260620-balance-adjustments/files/itemshop/equipmentshop7.shp` | 删除 `490004323` |

## 备份路径

```text
private/dnf-70/client-backups/20260620-balance-adjustments/
```

## 操作步骤

1. 从 `pvf-export` 复制目标文件到 `pvf-modified`。
2. 使用字节级精确替换，只修改目标字段。
3. 将修改后文件复制到 `pvf-import-ready`。
4. 将同一份修改文件复制到本补丁目录的 `files/` 下，供 Git 对比。
5. 生成 `changes.diff`，用于直接查看原始导出文件和修改文件之间的最小差异。

## 待确认

- `fighter/NenGuard.skl` 的 dungeon `[level info]` 目前看是 3 列一组，推断为持续时间、范围、罩子 HP；第三列是“加血/血量”候选。需要你确认目标数值后再改。
- `gunner/NapalmBomb.skl`、`gunner/NielSniping.skl` 目前 spec 只记录了当前 CD，没有明确目标值，暂不改。
- `gunner/G1.skl` 当前值是 `20000 20000`，和原需求“40 改 10 秒”不一致，暂不改。

## 测试结果

- 客户端启动：未测试。
- 功能生效：未测试，需要导入 PVF 后进游戏验证。
- 文件对比：已生成 Git 可对比镜像文件和 `changes.diff`。

## 回滚方法

用备份目录中的同路径文件覆盖 `pvf-modified` / `pvf-import-ready` 中对应文件，或重新从 `pvf-export` 复制原始文件。
